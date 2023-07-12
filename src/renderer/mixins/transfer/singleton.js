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

			await this.$axios.$get(`/transfers/${this.transfer.uuid}?include=branch,created_by,created_by.avatar,selected_products,selected_products.items,selected_products.items.model,selected_products.items.model.supplier,selected_products.items.model.purchase,tags,state_history`)
			.then(async (res)=>{
				this.stateHistory = res.data.state_history
				await res.data.selected_products.forEach(async(item)=>{
					let product = {}
					product.name = item.product.name
					product.variation = item.uuid
					product.variation_name = item.variation.name
					product.code = item.code
					product.quantity = item.total_units_transferred
					product.boundary = item.total_units_transferred

					if (res.data.type === 'manual') {
						await item.items.forEach((entry)=>{
							entry.quantity = entry.quantity_transferred
							entry.purchase = entry.model.uuid
							entry.model = entry.model
							entry.transferable_qty = entry.model.quantity + entry.quantity_transferred
						})
					}

					{
						
						let sum = 0 
						await item.items.forEach((entry)=>{
							sum = sum + entry.model.quantity

						})

						product.boundary = sum+item.total_units_transferred
					}
					
					product.purchases = item.items
					await this.transferData.products.push(product)
				})
			})
			.catch( err =>{
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

			this.$message.warning('Tranfer cannot be empty. At least one product if required', 4)
		},

		removeItem(productIndex, itemIndex){
			this.transferData.products[productIndex].purchases = this.transferData.products[productIndex].purchases.filter((item, index) => {
				return itemIndex !== index
			})
		},

		getTransferQunatity(productIndex){
			let total = 0
			this.transferData.products[productIndex].purchases.forEach(item => {
				total = total + item.quantity
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


export {bindProps, base}