const password = {
	data(){
		return {
			form : {
				password : '',
				password_confirmation : ''
			},
			loading : false 
		}
	},

	methods : {
		async setupPassword (){
			this.loading = true

			await this.$axios.$post('/change-password', this.form)
			.then(async () => {
				await this.$auth.fetchUser()
				await this.$router.push({
					name : 'home'
				})
			})
			.catch( () => {
				
			})
			.finally(()=>{
				this.loading = false
			})
		},
	}
}

const setup = {
	data(){
		return {
			showModal : false,
			loading : false,
			storeDetails : {
				name :  '',
				email : '',
				phone : '',
				currency : '',
				website : '',
				address : '',
				vat_percent : '',
			},

			setup : {
				has_stock : undefined,
				has_setup_tags : undefined,
				has_setup_branch : undefined,
				has_created_staff : undefined,
				has_stocked_branch : undefined,
				has_created_customer : undefined,
				has_created_products : undefined,
				has_created_supplier : undefined,
				has_setup_variations : undefined,
				has_confirmed_store_details : undefined,
			}
		}
	},

	methods : {
		async skipProcess(){
			let payload = this.setup
			for (let key in payload) {
				payload[key] = true
			}

			this.loading = true
			this.$message.destroy()
			await this.$axios.$post(`/setup-complete`, payload)
			.then(async (res) =>{
				await this.$store.dispatch('app/getAppData')
				await this.$auth.fetchUser()
				await this.syncKeys()
				this.showModal = false
				this.$emit('done')
				this.$message.destroy()
				this.$message.success("Onboarding process skipped", 4)
			})
			.catch(err => {
				this.$message.error(`Operation failed. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
				this.showModal = false
			})
		},


		async confirmStoreDetails(){
			this.loading = true
			await this.$axios.$patch('', this.storeDetails)
			.then(async () =>{
				await this.updateStage('has_confirmed_store_details')
				this.showModal = false
				this.$emit('store-updated')
				this.$message.destroy()
				this.$message.success("Store info confirmed.", 4)
			})
			.catch(err => {
				this.$message.error(`Sorry. Failed to confirm store details. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},

		async updateStage(key){
			let payload = this.setup
			payload[key] = true
			this.loading = true
			await this.$axios.$post(`/setup-complete`, payload)
			.then(async (res) =>{
				await this.$store.dispatch('app/getAppData')
				await this.$auth.fetchUser()
				await this.syncKeys()
				this.showModal = false
				this.$emit('completed')
				this.$message.destroy()
				this.$message.success("Stage completed.", 4)
			})
			.catch(err => {
				this.$message.error(`Operation failed. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},


		async skipStage(key){
			let payload = this.setup
			payload[key] = true

			this.loading = true
			await this.$axios.$post(`/setup-complete`, payload)
			.then(async (res) =>{
				await this.$store.dispatch('app/getAppData')
				await this.$auth.fetchUser()
				await this.syncKeys()
				this.showModal = false
				this.$emit('skipped')
				this.$message.destroy()
				this.$message.success("The stage was skipped", 4)
			})
			.catch(err => {
				this.$message.error(`Operation failed. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},

		async syncKeys(){
			await Object.assign(this.setup , ...Object.keys(this.setup).map(k => k in this.emporium.setups && { [k]: this.emporium.setups[k] }))
		},
	},

	async mounted(){
		await this.syncKeys()
	}
} 

export { password, setup }