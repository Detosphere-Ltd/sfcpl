const logoUpdoad = {
	data(){
		return {
			previewImageFile : null,
			uploading : false
		}
	},

	computed:{
		displayImage(){
			if (this.previewImageFile) {
				return this.previewImageFile
			}
			if (this.application.logo && this.application.logo.large !== undefined) {
				return this.application.logo.large
			}

			return `/logo.png`
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

		async uploadStoreLogo(){

			this.$message.destroy()
			if (this.previewImageFile && this.uploading) {
				return
			}

			let fileToUpload = this.$refs.fileSelect.files[0]
			let uploadForm = new FormData();

			await uploadForm.append('logo', fileToUpload);

			this.uploading = true
			await this.$axios.$post('/logo', uploadForm,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(async ()=>{
				await this.$store.dispatch('app/getAppData')
				await this.$store.dispatch('refreshUser')
				await this.removeSelectedFile()
				this.$emit('logo-updated')
				this.$message.success("Store logo updated", 3)
			})
			.catch((err)=>{
				this.$message.error(`Sorry. Failed to update store logo. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 3)
			})
			.finally(()=>{
				this.uploading = false
			})
		}
	}
}

const basic = {
	data(){
		return {
			form : {
				name : '',
				email : '',
				website : '',
				phone : ''
			}
		}
	}
}

const updateName = {
	data(){
		return {
			name : ""
		}
	}
}

const updateWebsite = {
	data(){
		return {
			website : ""
		}
	}
}


const updateEmail = {
	data(){
		return {
			email : ""
		}
	}
}

const updatePhone = {
	data(){
		return {
			phone : ""
		}
	}
}


const VatPolicy = {
	data(){
		return {
			vat_percent : ""
		}
	}
}

const updateCurrency = {
	data(){
		return {
			currency : ""
		}
	}
}


const updateExpirySettings = {
	data(){
		return {
			expiry_interval : {
				unit : '' ,
				number : ''
			}
		}
	}
} 

const updateFiscalYearSettings = {
	data(){
		return {
			fiscal_year_period : {
				start : '' ,
				end : ''
			}
		}
	}
} 

const performUpdate = {
	data(){
		return {
			updating : false
		}
	},
	methods : {
		async updateInfo(payload){
			this.$message.destroy()
			if (!payload) {
				return
			}
			this.updating = true
			await this.$axios.$patch('', payload)
			.then(async ()=>{
				await this.$store.dispatch('app/getAppData')
				await this.$store.dispatch('refreshUser')
				this.$emit('store-updated')
				this.$message.success("Store settings updated", 3)
			})
			.catch(()=>{
				this.$message.error("Sorry. Failed to update store settings", 3)
			})
			.finally(()=>{
				this.updating = false
			})

		}
	}
}

export {logoUpdoad  , updateName, updateWebsite, updateEmail, updatePhone, updateCurrency, 
	performUpdate, updateExpirySettings, updateFiscalYearSettings, VatPolicy, basic}


