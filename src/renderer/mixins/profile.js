const updatePassword = {
	data(){
		return {
			loading : false,
			showPassword : false,
			passwordFileds : {
				current_password : '',
				password : ''
			}
		}
	},

	methods : {
		async changePassword(){
			this.loading = true
			this.passwordFileds.password_confirmation = this.passwordFileds.password
			await this.$axios.$patch('/profile/password', this.passwordFileds)
			.then(()=>{
				this.$message.success("Password updated", 4)
				this.passwordFileds = {
					current_password : '',
					password : ''
				}
			})
			.catch(()=>{
				this.$message.error("Failed to update password", 4)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}

export {updatePassword}