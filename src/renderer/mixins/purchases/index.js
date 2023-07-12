export default {
	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			purchases : [],
			pagination : undefined,
			state : '',
			fetching : false,
			to : undefined,
			from : undefined,
			outstanding : '',
			unit_types : [],
			expired : '',
			belongs_to_invoice : '',
			supplier : ''
		}
	},


	computed : {
		allPurchases(){
			return this.purchases
		},
		queryParameters(){
			return `
			${this.state ? '&reversed='+this.state : ''}
			${this.expired ? '&expired='+this.expired : ''}
			${this.belongs_to_invoice ? '&belongs_to_invoice='+this.belongs_to_invoice : ''}
			${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}
			${this.outstanding ? '&outstanding='+this.outstanding : ''}
			${this.supplier ? '&supplier='+this.supplier : ''}
			${this.unit_types && this.unit_types.length > 0 ? '&unit_types='+this.unit_types.toString() : ''}`
		},

		states(){
			return [
			{value : 'false' , 		text : 'Valid Purchases'},
			{value : 'true' , 		text : 'Reversed Purchases'},
			]
		},

		sources(){
			return [
			{value : '' , 		text : 'All Sources'},
			{value : 'false' , 		text : 'Single Purchases'},
			{value : 'true' , 		text : 'Invoice Purchases'},
			]
		},

		expiry(){
			return [
			{value : '' , 		text : 'All Statuses'},
			{value : 'false' , 		text : 'Purchases in Good Health'},
			{value : 'true' , 		text : 'Expired Purchases'},
			]
		},
	},


	methods : {
		async getPurchases(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/purchases?include=product_variation,product_variation.product,product_variation.variation,created_by,supplier,purchase_invoice,reversed_by,payments&paginate=25${this.queryParameters}`)
			.then((res)=>{
				this.purchases = res.data
				this.pagination = res.meta.pagination
			})
			.catch((err)=>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.loading = false
			})
		},

		async loadExtraData(){
			this.fetching = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(this.pagination.links.next)
			.then(async(res)=>{
				await res.data.forEach((entry)=>{
					this.purchases.push(entry)
				})
				this.pagination = res.meta.pagination
			})
			.catch((err)=>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.fetching = false
			})
		},

		applyDate(payload){
			this.to = this.$moment(payload.endDate).format('DD/MM/YYYY')
			this.from = this.$moment(payload.startDate).format('DD/MM/YYYY')
		},
		clearFilters(){
			this.from = ""
			this.to = ""
			this.state = ""
			this.unit_types = []
			this.outstanding = ""
			this.supplier = ""
			this.expired = ""
			this.belongs_to_invoice = ''
		}
	},


	watch : {
		async queryParameters(){
			await this.getPurchases()
		}
	}
}