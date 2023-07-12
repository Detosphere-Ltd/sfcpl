export default{
	data(){
		return {
			form : {
				email : '',
				password : '',
				full_name: '',
			},
			loading : false,
			
		}
	},


	methods : {
		async loginUser(){
			this.loading = true
			try{
				await this.$auth.loginWith('local', { data : this.form})
				this.loading = false
				await this.$router.push({
					name: 'home',
				})

				this.$message.success("You are now logged in", 2)
				this.loading = false
			}

			catch(e){
				this.loading = false
			}
		}

	}
}
