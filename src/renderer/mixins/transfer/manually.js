import {mapGetters} from "vuex"
export default{
	props : {
		selection : {
			type : Array,
			default : []
		}
	},
	data(){
		return {
			submitting : false,
			initModal : false,
			selectProductsModal : false,
			cancelPrompt: false,
			successModal : false,
			transferData : {
				branch : '',
				tags : [],
			},

			products : [],
			visibleIndex : 0


		}
	},
	computed : {
		...mapGetters({
			branches : 'branches/activeBranches',
			availableTags : 'tags/transfer_tags',
		}),

		filled(){
			return this.products.every(entries => {
				return entries.items.length > 0 && entries.items.every(item => {return item.quantity && item.quantity > 0})
			}) 
		},

		selectedProducts(){
			return this.products.length
		}
	},


	methods : {

		async setProductsData(){
			let products = []
			await this.selection.forEach( async item => {
				let product__variation = {
					variation : item.uuid,
					variation_name : item.variation.name,
					product_name : item.product.name,
					boundary : item.warehouse_quantity,
					code : item.code,
					availablePurchases : item.available_purchases,
					items : [],
					purchases : []
				}

				await products.push(product__variation)

				this.products = products
			})

		},


		removeProduct(variation){
			this.products = this.products.filter(item => {return item.variation !== variation})
		},

		resetData(){
			this.transferData = {
				branch : '',
				tags : [],
			}
		},
		async init(){
			let found =	await this.branches.filter(branch => { return branch.uuid === this.transferData.branch})[0]
			this.transferData.custom_properties = {
				branch : found
			}
			this.selectProductsModal = true
		},


		async submitTransfer(){
			this.submitting = true
			this.$axios.$post(`/transfers`, {...this.transferData, products : [...this.products], type : 'manual'})
			.then(()=>{
				this.successModal = true
				this.$message.success('Transfer of products initiated', 4)
				this.initModal = false
				this.$emit('transfer-initiated')
			})
			.catch( err =>{
				this.$message.error(`Failed to initiate transfer. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 5)
			})
			.finally(()=>{
				this.submitting = false
			})

		},

		destroyTransfer(){
			this.initModal = false
			this.selectProductsModal = false
			this.cancelPrompt = false
			this.successModal = false
			this.products = []
			this.$emit('emptied')
			this.resetData()
		},

		addPurchase(productIndex, value){
			let product = this.products[productIndex]
			let exists = product.items.filter(item => {return item.purchase === value})
			let originalReference =  product.availablePurchases.filter(item => {return item.uuid === value})
			let payload = {
				purchase : value,
				quantity : ''
			}
			if (originalReference && originalReference.length > 0) {
				payload.original = originalReference[0]
			}

			if (product) {
				if(product.purchases.includes(value) && exists.length < 1){
					this.products[productIndex].items.push(payload)
				} 
			}
		},

		removePurchase(productIndex, value){
			this.products[productIndex].items = this.products[productIndex].items.filter(item => {return item.purchase !== value})
			this.products[productIndex].purchases = this.products[productIndex].items.filter(item => {return item !== value})
		},


		getTotal(productIndex){
			let total = 0

			this.products[productIndex].items.forEach(item => {
				total = total + item.quantity
			})

			return total
		},


		checkValidity(productIndex){
			let valid = this.products[productIndex].items.every(item => {
				return item.quantity && item.quantity > 0
			})

			return (valid && this.products[productIndex].items.length > 0) 
		}
	},


	watch : {
		selectedProducts(){
			if (this.selectedProducts < 1) {
				this.selectProductsModal = false
				this.initModal = false
				this.$emit('emptied')
			}
		}
	}
}