
export default{
	props : {
		selection : {
			type : Array,
			default : []
		},

		branch : {
			type : Object
		}
	},
	data(){
		return {
			submitting : false,
			selectProductsModal : false,
			cancelPrompt: false,
			successModal : false,
			products : [],
		}
	},
	computed : {

		filled(){
			return this.products.every(item => {return item.quantity && item.quantity > 0})
		}
	},


	methods : {

		async setProductsData(){
			let products = []
			await this.selection.forEach( async item => {
				let product__variation = {
					variation : item.uuid,
					variation_name : item.product_variation.variation.name,
					product_name : item.product_variation.product.name,
					boundary : item.quantity,
					code : item.product_variation.code,
					quantity : ""
				}

				await products.push(product__variation)

				this.products = products
			})

		},

		async init(){
			this.selectProductsModal = true
		},


		removeProduct(variation){
			this.$message.destroy()
			if (this.products.length > 1) {
				this.products = this.products.filter(item => {return item.variation !== variation})
				return
			}

			this.$message.warning('At least one product is required to submit a stock request')
		},



		async submitTransferRequest(){
			this.submitting = true
			this.$axios.$post(`/branches/${this.branch.uuid}/transfer-requests`, {products : [...this.products]})
			.then(()=>{
				this.successModal = true
				this.$message.success('Transfer of products initiated', 4)
				this.$emit('transfer-initiated')
			})
			.catch( err =>{
				this.$message.error(`Failed to initiate transfer. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 5)
			})
			.finally(()=>{
				this.submitting = false
			})

		},

		cancelRequest(){
			this.selectProductsModal = false
			this.cancelPrompt = false
			this.successModal = false
			this.products = []
			this.$emit('emptied')
		}
	}
}