const bindProps = {
	data(){
		return {
			loading : false
		}
	},
}

const resetPassword = {
	data(){
		return {
			form : {
				email : '',
				token : '',
				password : ''
			},

			stage : "START"
		}
	},

	methods : {
		async requestPasswordChange(){
			this.loading = true
			await this.$axios.$post('/forgot-password', { email : this.form.email })
			.then((res)=>{
				this.stage = "SENT"
			})
			.catch(err =>{
				this.$message.error(`Request to change password failed. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},

		async changePassword(){
			this.loading = true
			this.form.password_confirmation = this.form.password
			await this.$axios.$post('/reset-password', this.form)
			.then(async (res)=>{
				await this.loginUser()
			})
			.catch(err =>{
				this.$message.error(`Password reset failed. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},

		async loginUser(){
			this.loading = true
			try{
				await this.$auth.loginWith('local', { data : this.form})
				this.loading = false
				await this.$router.push({
					name: 'home',
				})
				this.$message.success("You are now logged in", 4)
				this.loading = false
			}

			catch(e){
				this.loading = false
			}
		}
	}
}

export {bindProps , resetPassword}