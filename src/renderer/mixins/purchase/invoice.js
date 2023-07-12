const DOWNLOADER = require('js-file-download');
const mime = require('mime-types')
const bindProps = {
	props : {
		invoice  : {
			type : Object,
			required : true
		}
	},

	data(){
		return {
			failed : false,
			errData : undefined,
			invoiceDetails : undefined,
			fetching : false,
			loadModal : false,
			detailsModal : false,
			reasonModal : false,
			showing : 'DETAILS',
			downloading : false,

		}
	},

	methods : {
		async getInvoiceDetails(){
			this.failed = false
			this.errData = undefined
			this.fetching = true
			await this.$axios.$get(`/purchase-invoices/${this.invoice.uuid}
				?include=purchase_items,purchase_items.product_variation,purchase_items.product_variation.product,
				purchase_items.product_variation.variation,purchase_items.unit_type,payments,payments.created_by,payments.reversed_by,created_by,supplier`)
			.then(res => {
				this.invoiceDetails = res.data
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
		},

		async downloadAttachment(){
			this.$message.loading('Downloading file...', 0)
			this.$axios.$get(`${this.invoice.file}`,  { responseType: 'blob'})
			.then(async (res) =>{
				let extension = mime.extension(res.type)
				await DOWNLOADER(res, `${this.invoice.invoice_no ? this.invoice.invoice_no : this.invoice.code}.${extension}`)
				this.$message.destroy()
				this.$message.success(`Attachment downloaded` , 4)
			})
			.catch((err)=>{
				this.$message.destroy()
				this.$message.error(`Failed to download file` , 4)
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
		async reverseInvoice(){
			this.loading = true
			await this.$axios.$post(`/purchase-invoices/${this.invoice.uuid}/reverse`, {reason : this.reason})
			.then(()=>{
				this.reason = ''
				this.showModal = false
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to reverse invoice. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 7)
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
		async recordPayment(){
			this.loading = true
			await this.$axios.$post(`/purchase-invoices/${this.invoice.uuid}/payments`, this.repayForm)
			.then(()=>{
				this.reason = ''
				this.showModal = false
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to record payment for invoice. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 5)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}


export { bindProps , reversal , repay}