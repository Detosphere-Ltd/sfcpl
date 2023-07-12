const bindProps = {
	props : {
		sale : {
			type : Object,
			required : true
		},
		view : {
			type : String,
		default : 'DETAILS'
		}
	},
	data(){
		return {
			loading : false,
			completedSale : undefined,
			failed : false,
			errData : undefined,
			loadModal : false,
			receiptModal : false,
			viewing : ''
		}
	},
	methods : {
		async getSaleDetails(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/sales/${this.sale.uuid}?include=branch,created_by,customer,sale_items,sale_items.stock,sale_items.stock.product_variation,sale_items.stock.product_variation.product,sale_items.stock.product_variation.product.variation,payments,payments.created_by,levies`)
			.then( res => {
				this.completedSale = res.data
				this.loadModal = false
				this.receiptModal = true
				this.viewing = this.view
			})
			.catch( err => {
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}

const reversal = {
	data(){
		return {
			retractionData : {
				reason : '',
				note : ''
			},
			reasons : ["Broken Items", "Expired / Expiring Items", "Wrong Item Selection", "Return Policy", "Other"],
		}
	},

	methods : {
		async reversSale(){
			this.loading = true
			await this.$axios.$post(`/sales/${this.sale.uuid}`, this.retractionData)
			.then(()=>{
				this.reverseModal = false
				this.$emit('done')
				this.$message.success('Sale reversed', 4)
			})
			.catch(err=>{
				this.$message.error(`Failed to reverse sale. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	} 
}
export {bindProps, reversal}
