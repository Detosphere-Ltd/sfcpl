const bindProps = {
	props : {
		transfer : {
			type : Object,
			required : true
		}
	}
}


const base = {
	data(){
		return {
			showModal : false,
			processing : false,
			comments : "",
			fetching : false,
			failed : false,
			transferData : {
				products : []
			},
			errData : undefined,
			stateHistory : []
		}
	},


	methods : {
		async getTransferDetails(){
			this.fetching = true
			this.failed = false
			this.errData = undefined
			this.transferData.products = []

			await this.$axios.$get(`/transfer-requests/${this.transfer.uuid}?include=branch,created_by,created_by.avatar,selected_products,selected_products.product,tags,state_history`)
			.then(async (res)=>{
				this.stateHistory = res.data.state_history
				await res.data.selected_products.forEach(async(item)=>{
					let product = {}
					product.name = item.product.name
					product.variation = item.uuid
					product.code = item.code
					product.variation_name = item.variation.name
					product.quantity = item.quantity_requested
					product.quantity_received = item.quantity_dispatched
					product.boundary = item.quantity_requested
					product.available = item.quantity_available
					product.available_batches = item.available_purchases
					
					if (item.available_purchases) {
						await item.available_purchases.forEach((entry)=>{
							entry.purchase = entry.uuid
							entry.boundary = entry.quantity
							entry.quantity = null
						})
					}

					product.batches = []
					await this.transferData.products.push(product)
				})
			})
			.catch((err)=>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.fetching = false
			})
		},

		resetData(){
			this.transferData = {
				products : []
			}
			this.processing = false
			this.failed = false
			this.errData = undefined
			this.comments = ""
			this.fetching = false
		},


		removeProduct(productIndex){
			this.$message.destroy()
			if (this.transferData.products.length > 1) {
				this.transferData.products = this.transferData.products.filter((item, index) => {
					return productIndex !== index
				})
				return
			}

			this.$message.warning('Request cannot be empty. At least one product if required', 4)
		},

		removeItem(productIndex, itemIndex){
			this.transferData.products[productIndex].purchases = this.transferData.products[productIndex].purchases.filter((item, index) => {
				return itemIndex !== index
			})
		},

		getTotalQuantity(productIndex){
			let total = 0
			let selectedBatches = this.transferData.products[productIndex].available_batches.filter(item => {
				return this.transferData.products[productIndex].batches.includes(item.uuid)
			})

			selectedBatches.forEach(iteration => {
				total = total + iteration.quantity
			})

			return Number(total)

		}
	},

	computed : {
		stateHistories(){
			return this.stateHistory.filter((history)=>{
				return (history.to && history.from)
			})
		},

		originator(){
			return this.transfer.created_by
		}
	}
}


const reject = {
	methods : {
		async rejectRequest(){
			this.processing = true
			this.$message.destroy()
			await this.$axios.$post(`/transfer-requests/${this.transfer.uuid}/reject`, { comments : this.comments ? this.comments : ''})
			.then(()=>{
				this.$message.success("Stock Request has been rejected.")
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to reject stock request. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.processing = false
			})
		}
	}
}


const cancel= {
	methods : {
		async cancelRequest(){
			this.processing = true
			this.$message.destroy()
			await this.$axios.$post(`/transfer-requests/${this.transfer.uuid}/cancel`, {comments : this.comments ? this.comments : ''})
			.then(()=>{
				this.$message.success("Stock request has been cancelled.")
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Cancellation failed. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.processing = false
			})
		}
	}
}


const accept = {
	methods : {
		async autoAccept(){
			this.processing = true
			this.$message.destroy()
			await this.$axios.$post(`/transfer-requests/${this.transfer.uuid}/accept`, {type : 'automatic', ...this.transferData})
			.then(()=>{
				this.$message.success("Stock request accepted.", 4)
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to  accept stock transfer. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.processing = false
			})
		},


		async acceptManually(){
			await this.transferData.products.forEach(product=>{
				product.items = product.available_batches.filter(item => {return product.batches.includes(item.uuid)})
			})
			
			this.processing = true
			this.$message.destroy()
			await this.$axios.$post(`/transfer-requests/${this.transfer.uuid}/accept`, {type : 'manual',  ...this.transferData})
			.then(()=>{
				this.$message.success("Stock request accepted.")
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to  accept stock transfer. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.processing = false
			})
		},
	}
}


export {base, bindProps , accept, reject, cancel}