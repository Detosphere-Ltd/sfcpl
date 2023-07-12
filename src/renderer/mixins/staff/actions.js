const base = {
	data(){
		return {
			loading : false,
		}
	}
}

const create  =  {
	data(){
		return {
			form : {
				name : "",
				branch_id : "",
				email : '',
				phone : '',
				gender : '',
				role_id : '',
				date_of_birth: '',
				title : ''
			},
		}
	},

	methods : {
		async addStaffMember(){
			this.loading = true
			await this.$axios.$post('/users', this.form)
			.then(async ()=>{
				this.$message.success(`${this.form.name} has been added to your staff`, 4)
				await this.initNew()
				this.$emit('staff-added')
			})
			.catch((err)=>{
				this.$message.error(`We were unable to add ${this.form.name} to your staff list. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)

			})
			.finally(()=>{
				this.loading = false
			})
		},

		initNew(){
			this.loading = false
			this.form = {
				name : "",
				branch_id : "",
				email : '',
				phone : '',
				gender : '',
				role_id : '',
				date_of_birth: '',
				title : ''
			}
		}
	},

	computed : {
		selectedBranch (){
			return this.branches.filter((br)=>{return br.uuid === this.form.branch_id})
		},
		selectedRole (){
			return this.roles.filter((ro)=>{return ro.uuid === this.form.role_id})
		}
	}
}

const update = {
	data(){
		return {
			form : {
				name : this.staff.name,
				email : this.staff.email,
				phone : this.staff.phone ? this.staff.phone : '',
				gender : this.staff.gender ? this.staff.gender : '',
				date_of_birth: this.staff.date_of_birth ? this.$moment(this.staff.date_of_birth).format('YYYY-MM-DD') : '',
				title : this.staff.title ? this.staff.title : ''
			}
		}
	},

	methods : {
		async updateStaffInfo(){
			this.loading = true			
			await this.$axios.$patch(`/users/${this.staff.uuid}`, this.form)
			.then((res)=> {
				this.$emit('staff-update-success')
				this.$message.success("Staf Info Updated", 4)
			})
			.catch((err)=>{
				this.$emit('staff-update-failed')
			})
			.finally(()=>{
				this.loading = false

			})
		}
	}
}

const avatarUpload = {
	data(){
		return {
			previewImageFile : null,
			uploading : false,
			croppedImage : null,
		}
	},

	computed:{
		displayImage(){
			if (this.previewImageFile) {
				return this.previewImageFile
			}
			if (this.staff.avatar && this.staff.avatar.large !== undefined) {
				return this.staff.avatar.large
			}
			return `/avatar.png`
		}
	},

	methods : {
		openFileDialog(){
			this.$refs.fileSelect.click()
		},

		async handFileSelected(){
			let selectedFile = this.$refs.fileSelect.files[0]
			let reader = new FileReader();
			await reader.addEventListener("load", function(){
				this.previewImageFile = reader.result
			}.bind(this), false)

			if (selectedFile) {
				if ( /\.(jpeg|jpg|png)$/i.test( selectedFile.name ) ) {
					reader.readAsDataURL( selectedFile );
				}
			}
		},

		removeSelectedFile(){
			this.previewImageFile = null
			this.$refs.fileSelect.files = null
		},

		convertCroppedImageToBlob(dataURI) {
			var byteString;
			if (dataURI.split(',')[0].indexOf('base64') >= 0)
				byteString = atob(dataURI.split(',')[1]);
			else
				byteString = unescape(dataURI.split(',')[1]);

			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
			var ia = new Uint8Array(byteString.length);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}

			return new Blob([ia], {type:mimeString});
		},

		async uploadAvatar(){

			if (this.previewImageFile && this.uploading) {
				return
			}

			if (!this.croppedImage) {
				return
			}

			let fileToUpload = this.convertCroppedImageToBlob(this.croppedImage)
			let uploadForm = new FormData();

			await uploadForm.append('avatar', fileToUpload);

			this.uploading = true

			await this.$axios.$post(`/users/${this.staff.uuid}/avatar`, uploadForm,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then( async () => {
				this.removeSelectedFile()
				this.$emit('avatar-uploaded')
				this.$message.success(`${this.staff.name}'s avatar has been uploaded`, 4)
				if (this.$auth.user.uuid === this.staff.uuid){
					await this.$store.dispatch('refreshUser')
				}
			})
			.catch((err)=>{
				this.$message.error(`Sorry. Failed to avatar for ${this.staff.name}.  ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.uploading = false
			})
		},

		setFileData(){
			this.croppedImage = this.$refs.cropper.getCroppedCanvas().toDataURL('image/jpeg')
		}
	}
}

const toggleActiveState = {

	methods : {
		async toggle(){
			this.loading = true
			this.$axios.$post(`/users/${this.staff.uuid}/toggle-active-status`)
			.then(()=>{
				this.$emit('staff-status-changed')
				this.$message.success( this.theMessagge, 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to ${this.staff.active ? 'deatcivate' : 'activate'} ${this.staff.name}'s account. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false

			})
			

		}
	},

	computed : {
		theMessagge(){
			return `${this.staff.name}'s ${this.staff.active ? 'account has been deactivated' : 'account has been restored'}`
		}
	}

}




const credentials = {
	methods : {
		async resendCredentials(){
			this.loading = true
			this.$axios.$post(`/users/${this.staff.uuid}/resend-credentials`)
			.then(()=>{
				this.$emit('staff-status-changed')
				this.$message.success(`Account credentials have been resent to ${this.staff.name}`, 4)
				this.showModal = false
			})
			.catch((err)=>{
				this.$message.error(`Failed to resend credentials. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false

			})
			

		}
	}
}

const detach = {
	methods : {
		async detachUser(){
			this.loading = true
			this.$axios.$post(`/users/${this.staff.uuid}/detach`)
			.then(()=>{
				this.$emit('done')
				this.$message.success(`${this.staff.name} is now a corporate level user`, 4)
				this.showModal = false
			})
			.catch((err)=>{
				this.$message.error(`Failed to detach ${this.staff.name} from branch. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false

			})
			

		}
	}
}


export { base , create, update, avatarUpload, toggleActiveState, credentials, detach}