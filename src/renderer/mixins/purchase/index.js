const bindProps = {
	props : {
		purchase  : {
			type : Object,
			required : true
		}
	},

	data(){
		return {
			failed : false,
			errData : undefined,
			purchaseDetails : undefined,
			fetching : false,
			loadModal : false,
			detailsModal : false,
			showing : 'DETAILS'

		}
	},

	methods : {
		async getPurchaseDetails(){
			this.failed = false
			this.errData = undefined
			this.fetching = true
			await this.$axios.$get(`/purchases/${this.purchase.uuid}?include=product_variation.product,product_variation.variation,created_by,product.media,reversed_by,payments,payments.created_by,payments.reversed_by,unit_type`)
			.then(res => {
				this.purchaseDetails = res.data
				this.loadModal = false
				this.detailsModal = true
			})
			.catch(err => {
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.fetching = false
			})
		}
	}
}


const reversal = {
	data(){
		return {
			reason : '',
			loading : false,
			showModal : false,
		}
	},

	methods : {
		async reversePurchase(){
			this.loading = true
			await this.$axios.$post(`/purchases/${this.purchase.uuid}/reverse`, {reason : this.reason})
			.then(()=>{
				this.reason = ''
				this.showModal = false
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to reverse purchase. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 7)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}




const repay = {
	data(){
		return {
			loading : false,
			showModal : false,
			repayForm : {
				amount : '',
				payment_mode : '',
				reference_no : '',
			}
		}
	},

	methods : {
		async repayPurchase(){
			this.loading = true
			await this.$axios.$post(`/purchases/${this.purchase.uuid}/payments`, this.repayForm)
			.then(()=>{
				this.reason = ''
				this.showModal = false
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to record payment for purchase. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 5)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}


export {bindProps, reversal, repay}