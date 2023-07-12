const bindProps = {
	props : {
		transfer : {
			type : Object,
			required : true
		}
	}
}

const base = {
	props : {
		status : {
			required : true,
			type :  String,
			default : 'confirmed'
		}
	},
	data(){
		return {
			comments : '',
			loading : false,
			showModal : false
		}
	},

	computed : {
		statuses(){
			const STATUSES = {
				dispatched : 'Dispatch Transfer',
				raised_issue : 'Raise An Issue',
				cancelled : 'Cancel Transfer',
				confirmed : 'confirmed Transfer'
			}

			return STATUSES
		}
	}
}


const resolve = {
	data(){
		return {
			loading : false,
			showModal : false,
			fetching : false,
			failed : false,
			transferData : {
				products : []
			},
			errData : undefined,
			allow : false
		}
	},
	methods : {
		async getTransferDetails(){
			this.fetching = true
			this.failed = false
			this.errData = undefined

			await this.$axios.$get(`/transfers/${this.transfer.uuid}?include=branch,created_by,created_by.avatar,selected_products,selected_products.product,tags`)
			.then(async (res)=>{
				await res.data.selected_products.forEach(async(item)=>{
					let product = {}
					product.name = item.product.name
					product.variation = item.uuid
					product.variation_name = item.variation.name
					product.quantity = item.quantity_transferred
					product.boundary = (item.product.quantity_in_transition + item.product.warehouse_quantity)
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

		async resolveTransfer(){
			this.loading = true
			await this.$axios.$patch(`/transfers/${this.transfer.uuid}`, {...this.transferData, status : 'resolved'})
			.then(()=>{
				this.showModal = false
				this.$message.success("Transfer issue resolved", 4)
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to resolve transfer issue. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},


		resetData(){
			this.transferData = {
				products : []
			}
			this.allow = false
		}
	}
}

const updateTransferStatus = {
	methods : {
		async updateTransfer(payload){
			if (!payload) {
				this.$message.error('A status is required')
				return
			}
			this.loading = true
			await this.$axios.$patch(`/transfers/${this.transfer.uuid}`, {status : payload, comments : this.comments })
			.then(()=>{
				this.comments = ''
				this.$emit('done')
				this.showModal = false
				this.$message.success(`Transfer status updated to ${payload}`, 4)

			})
			.catch((err)=>{
				this.$message.error(`Failed to update transfer status to ${payload}. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}
export {bindProps, base, updateTransferStatus, resolve}
