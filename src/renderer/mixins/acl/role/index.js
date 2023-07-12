import { mapGetters } from "vuex"
const bindProps = {
	props : {
		role : {
			type : Object,
			required : true
		}
	},

}

const update = {
	data(){
		return {
			updating : false,
			roleForm : {
				name : this.role.name,
				level : this.role.level,
				description : this.role.description ? this.role.description : '',
			}
		}
	},

	methods : {
		async updateRole(){
			this.updating = true
			this.$axios.$patch(`/roles/${this.role.uuid}`, this.roleForm)
			.then(async ()=>{
				this.$emit('role-updated')
				this.$message.success("Role updated", 4)
			})
			.catch(()=>{
				this.$message.error("Sorry. Failed to upload role", 4)
			})
			.finally(()=>{
				this.updating = false
			})

		}
	}
}

const managePermissions = {

	data(){
		return {
			existingPemissions : Object.values(this.role.permissions),
			rolePermisisons : [],
			saving : false,
		}
	},

	computed : {
		availablePermissions(){
			return Object.values(this.permissions)
		},

		...mapGetters({
			permissions : 'access/permissions'
		})
	},

	methods : {
		
		permissionIsSelected(permission){
			return  this.rolePermisisons.some((item)=>{
				return item.slug === permission
			})
		},
		syncSelected(permission){

			if(this.rolePermisisons.some( item => { return item.slug === permission})){
				this.rolePermisisons =  this.rolePermisisons.filter( perm => {
					return perm.slug !== permission
				})

				return
			}
			
			let perm = this.availablePermissions.forEach((module)=>{
				return module.forEach((item, index) => {
					if (item.slug === permission) {
						this.rolePermisisons.push(item)
					}
				})
			})
		},

		async updateRolePermissions(){
			this.saving = true
			this.$message.destroy();
			
			let perms = []
			await this.rolePermisisons.forEach(item => {
				perms.push(item.slug)
			})

			await this.$axios.$patch(`/roles/${this.role.uuid}`, { permissions : perms})
			.then(()=>{
				this.$emit('role-updated')
				this.$message.success("Role permissions updated ", 3)
				this.showModal = false
			})
			.catch(()=>{
				this.$message.error("Failed to update role permissions", 3)
			})
			.finally(()=>{
				this.saving = false
			})


		}

	},

	mounted(){
		// await this.getPermissions()
		this.rolePermisisons = this.existingPemissions
	}



}

const toggleActiveState = {
	data(){
		return {
			loadstate : false
		}
	},
	methods : {
		async toggleActiveStatus(){
			this.loadstate = true
			this.$axios.$post(`/roles/${this.role.uuid}/toggle-active-status`)
			.then(()=>{
				this.$emit('role-status-changed')
				this.$message.success(this.theMessagge, 5)
				this.showModal = false
			})
			.catch((err)=>{
				this.$message.error(`Failed to ${this.role.active ? 'deactivate' : 'activate'} role`, 5)
			})
			.finally(()=>{
				this.loadstate = false
			})
			

		}
	},

	computed : {
		theMessagge(){
			return `The role ${this.role.name} ${this.role.active ? 'has been deactivated' : 'has been activated'}`
		},
	}
}


export {bindProps,update,managePermissions, toggleActiveState}
