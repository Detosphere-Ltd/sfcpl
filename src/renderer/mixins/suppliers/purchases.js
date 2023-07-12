export default {
	props : {
		supplier : {
			type : Object,
			required : true
		}
	},
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
			from : undefined
		}
	},


	computed : {
		allPurchases(){
			return this.purchases
		},
		queryParameters(){
			return `${this.state ? '&reversed='+this.state : ''}${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}`
		},

		states(){
			return [
			{value : 'false' , 		text : 'Valid Purchases'},
			{value : 'true' , 		text : 'Reversed Purchases'},
			]

		}
	},


	methods : {
		async getPurchases(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/suppliers/${this.supplier.uuid}/purchases?include=product_variation,product_variation.product,product_variation.variation,created_by,supplier,reversed_by,payments&paginate=50${this.queryParameters}`)
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
		}
	},


	watch : {
		async queryParameters(){
			await this.getPurchases()
		}
	}
}