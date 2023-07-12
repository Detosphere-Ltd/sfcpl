const dataExporter = {
	data(){
		return {
			sent : false,
			email :  this.$auth.user.email ? this.$auth.user.email : '',
			type : '',
			loading : false
		}
	},

	methods : {
		async exportData(){
			this.loading = true
			this.sent = false
			let payload = {
				email : this.email
			}

			if (this.type) {
				payload.type = this.type
			}
			await this.$axios.$post(`/sales/export?${this.params}`, payload)
			.then(()=>{
				this.$message.success(`Data Exported`, 4)
				this.sent = true
			})	
			.catch( err =>{
				this.$message.error(`Operation failed. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 6)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}


const saleItemsExporter = {
	data(){
		return {
			sent : false,
			email :  this.$auth.user.email ? this.$auth.user.email : '',
			type : '',
			loading : false
		}
	},

	methods : {
		async exportData(){
			this.loading = true
			this.sent = false
			let payload = {
				email : this.email
			}

			if (this.type) {
				payload.type = this.type
			}
			await this.$axios.$post(`/sale-items/export?${this.params}`, payload)
			.then(()=>{
				this.$message.success(`Data Exported`, 4)
				this.sent = true
			})	
			.catch( err =>{
				this.$message.error(`Operation failed. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 6)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}

export {dataExporter, saleItemsExporter}