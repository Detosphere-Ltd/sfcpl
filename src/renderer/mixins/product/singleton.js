import {mapGetters} from "vuex"
const bindProps = {
	props : {
		product : {
			type : Object,
			required : true
		}
	}
}

const toggleActiveState = {
	data(){
		return {
			loading : false,
		}
	},

	methods : {
		async toggle(){
			this.loading = true
			this.$axios.$post(`/products/${this.product.uuid}/toggle-active-status`)
			.then(()=>{
				this.$emit('status-changed')
				this.$message.success(this.theMessagge, 4)
				this.showModal = false
			})
			.catch((err)=>{
				this.$message.error(`Failed to ${this.product.active ? 'deatcivate' : 'activate'} ${this.product.name}. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})

		}
	},

	computed : {
		theMessagge(){
			return `${this.product.name} has been ${this.product.active ? 'deactivated' : 'activated'}`
		},
	}
}

const create = {
	data(){
		return {
			showModal : false,
			supplierPrompt : false,
			first_purchase : false,
			previewImageFile : null,
			loading : false,
			openTags : false,
			levies : [],
			productForm : {
				name : '',
				description : '',
				vat_exclusive : false,
				expires : false,
				code : ''
			},
			tags : [],
			purchaseForm : {
				variation: '',
				quantity : '',
				cost_price : '',
				unit_selling_price : null,
				discount_received : null,
				supplier : '',
				amount_paid : null,
				expires_at : '',
				payment_mode : '',
				reference_no : '',
				unit_type : '',
			}
		}
	},

	computed:{
		disableCreation(){
			if (this.first_purchase) {
				if (!this.purchaseForm.quantity || !this.purchaseForm.cost_price || !this.purchaseForm.unit_selling_price) {
					return true
				}
			}
			return false
		},

		...mapGetters({
			availableTags  : 'tags/tags',
			variations  : 'variations/variations',
			suppliers : 'suppliers/activeSuppliers',
			units : 'units/activeUnits'
		})
	},

	methods : {

		async createProduct(ignorePrompt = false){

			if ((!this.purchaseForm.amount_paid && !this.purchaseForm.supplier) && !ignorePrompt) {
				this.supplierPrompt = true
				return
			}

			
			let form = this.productForm
			
			form.purchase = this.purchaseForm
			
			form.first_purchase = this.first_purchase

			if (this.tags && this.tags.length > 0) {
				form.tags = this.tags
			}

			if (this.levies && this.levies.length > 0) {
				form.levies = this.levies
			}

			this.loading = true
			await this.$axios.$post(`/products`, form)
			.then(()=>{
				this.showModal = false
				this.supplierPrompt = false
				this.$emit('needs-to-refresh')
				this.$message.success(`New product added to your catalog.`, 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to add new product to your catalog. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},

		resetData(){
			this.productForm = {
				name : '',
				description : '',
			}
			this.tags = []
			this.levies = []
			this.first_purchase = false
			this.purchaseForm = {
				variation: '',
				quantity : '',
				cost_price : '',
				unit_selling_price : '',
				discount_received : 0,
				supplier : '',
				amount_paid : '',
			}
		}
	}
}

const patch = {
	data(){
		return {
			showModal : false,
			loading : false,
			fetching : false,
			productDetails : null,
			productForm : {
				name : this.product.name ? this.product.name : '',
				description : this.product.description ? this.product.description : '',
				code : this.product.code ? this.product.code : '',
				expires : this.product.expires ? this.product.expires : false,
				vat_exclusive : this.product.vat_exclusive ? this.product.vat_exclusive : false,
			},
			tags : [],
			levies : []
		}
	},

	computed:{
		...mapGetters({
			availableTags  : 'tags/tags',
		})
	},

	methods : {
		async updateProduct(){
			
			let form = this.productForm
			form.purchase = this.purchaseForm
			if (this.tags && this.tags.length > 0) {
				form.tags = this.tags
			}
			this.loading = true
			await this.$axios.$patch(`/products/${this.product.uuid}`, form)
			.then(()=>{
				this.showModal = false
				this.$emit('done')
				this.$message.success(`Products details updated.`, 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to update product. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},

		async updateLevies(){
			
			let form = {}
			if (this.levies) {
				form.levies = this.levies
			}
			this.loading = true
			await this.$axios.$patch(`/products/${this.product.uuid}`, form)
			.then(()=>{
				this.showModal = false
				this.$emit('done')
				this.$message.success(`Products levies updated.`, 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to update product. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},

		async getDetails(){
			this.fetching = true
			this.levies = []
			await this.$axios.$get(`/products/${this.product.uuid}?include=levies`)
			.then(res => {
				this.productDetails = res.data
				if (res.data.levies && res.data.levies.length > 0) {
					res.data.levies.forEach(levy => {
						this.levies.push(levy.uuid)
					})
				}
			})
			.catch(err => {

			})
			.finally(()=>{
				this.fetching = false
			})
		}
	},

	async created(){
		if (this.product.tags && this.product.tags.length > 0) {
			await this.product.tags.forEach(tag => {
				this.tags.push(tag.slug)
			})
		}
	}
}

const stockAlerts = {
	data(){
		return {
			showModal : false,
			loading : false,
			stock_alert_settings : {
				warehouse : {
					warning : this.product.stock_alert_setting && this.product.stock_alert_setting.warehouse && this.product.stock_alert_setting.warehouse.warning ? this.product.stock_alert_setting.warehouse.warning : 0,
					danger : this.product.stock_alert_setting && this.product.stock_alert_setting.warehouse && this.product.stock_alert_setting.warehouse.danger ? this.product.stock_alert_setting.warehouse.danger : 0,
				},
				branch : {
					warning : this.product.stock_alert_setting && this.product.stock_alert_setting.branch && this.product.stock_alert_setting.branch.warning ? this.product.stock_alert_setting.branch.warning : 0,
					danger : this.product.stock_alert_setting && this.product.stock_alert_setting.branch && this.product.stock_alert_setting.branch.danger  ? this.product.stock_alert_setting.branch.danger : 0,
				}
			}
		}
	},

	

	methods : {
		async updateStockAlerts(){
			this.loading = true
			await this.$axios.$patch(`/products/${this.product.uuid}`, {stock_alert_setting : this.stock_alert_settings})
			.then(()=>{
				this.showModal = false
				this.$emit('done')
				this.$message.success(`Product Stock Alert updated.`, 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to update product stock alert. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}


const purchase = {
	data(){
		return {
			supplierPrompt : false,
			purchaseForm : {
				product : this.product.uuid,
				variation: '',
				quantity : '',
				cost_price : '',
				unit_selling_price : null,
				discount_received : 0,
				supplier : '',
				amount_paid : null,
				expires_at : '',
				payment_mode : '',
				reference_no : '',
				unit_type : '',
				due_date : '',
			}
		}
	},

	computed : {
		disableCreation(){
			if(!this.purchaseForm.variation){
				return true
			}
			if (!this.purchaseForm.quantity || !this.purchaseForm.cost_price) {
				return true
			}
			if (this.product.expires && !this.purchaseForm.expires_at) {
				return true
			}
			if (this.purchaseForm.amount_paid && !this.purchaseForm.payment_mode) {
				return true
			}
			return false
		}
	},

	methods : {
		async recordPurchase(ignorePrompt = false){

			if (((this.purchaseForm.cost_price > this.purchaseForm.amount_paid) && !this.purchaseForm.supplier) && !ignorePrompt) {
				this.supplierPrompt = true
				return
			}

			let payload = this.purchaseForm

			if (this.fields && this.fields.length > 0) {
				payload.custom_attributes = {}
				await this.fields.forEach(entry =>{
					payload.custom_attributes[entry.key] = entry.value
				})
			}

			this.loading = true
			await this.$axios.$post(`/purchases`, this.purchaseForm)
			.then(()=>{
				this.showModal = false
				this.$emit('done')
				this.$message.success(`Purchase recorded for ${this.product.name}.`, 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to record purchase for ${this.product.name}. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},

		resetData(){
			this.purchaseForm = {
				product : this.product.uuid,
				variation: '',
				quantity : '',
				cost_price : '',
				unit_selling_price : '',
				discount_received : 0,
				supplier : '',
				amount_paid : '',
				expires_at : '',
				payment_mode : '',
				reference_no : '',
				unit_type : '',
			}
		}
	}
}

const CPF = {

	data(){
		return {
			showModal : false,
			loading : false,
			fields : [],
		}
	},
	methods : {
		
		addEntry(){

			this.$message.destroy()

			if (this.fields.every(item=>{return item.name && item.type})) {
				this.fields.push({
					name : '',
					type : '',
					required : false,
					match_quantity : false,
					unique : false
				})

				return
			}


			this.$message.warning('Fill in the name and type of all entries before adding another')

			
		},

		removeEntry(itemIndex){
			this.fields = this.fields.filter((item, index)=>{return index !== itemIndex})
		},

		async setupFields(){
			this.fields = []

			if (Object.keys(this.product.custom_purchase_attributes).length > 0) {
				await Object.entries(this.product.custom_purchase_attributes).forEach((entry, key)=>{
					// Use this.$set to make new values reactive
					this.$set(entry[1], 'value', entry[1].match_quantity ? [] : '')
					let item = entry[1]
					item.key = entry[0]
					this.fields.push(item)

				})

				return
			}

			this.fields = []
		}
	}

}

const pricing = {
	data(){
		return {
			loading : false,
			price : this.product.unit_selling_price ? this.product.unit_selling_price : 0,
			showModal : false
		}
	},

	methods : {
		async adjustPricing(){
			this.loading = true
			this.$axios.$patch(`/product-variations/${this.product.uuid}`, {unit_selling_price : this.price})
			.then(()=>{
				this.$emit('price-changed')
				this.$emit('done')
				this.$message.success(`Product price updated.`, 4)
				this.showModal = false
			})
			.catch((err)=>{
				this.$message.error(`Failed to update product price. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})

		}
	},
}


export {bindProps,purchase,toggleActiveState,pricing, create, patch, CPF, stockAlerts}