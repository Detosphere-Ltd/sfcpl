import { debounce } from "lodash"
export default {

	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			products : [],
			pagination : undefined,
			fetching : false,
			searching : '',
			searchTerm : '',
			instock : '',
			has_expired_items : '',
			alert_type : '',
		}
	},


	computed : {
		allProducts(){
			return this.products
		},
		expiry(){
			return [
			{value : '' , 		text : 'All Stock'},
			{value : 'false' , 		text : 'Healthy Stock'},
			{value : 'true' , 		text : 'Expired Stock'},
			]
		},

		stockLevels(){
			return [
			{value : '' , 		text : 'All Products'},
			{value : 'false' , 		text : 'Out of Stock Products'},
			{value : 'true' , 		text : 'Products In Stock'},
			]
		},

		stockAlerts(){
			return [
			{value : '' , 		text : 'All Levels'},
			{value : 'unknown' , 		text : 'Unknown Stock Level'},
			{value : 'safe' , 		text : 'Safe Stock Level'},
			{value : 'warning' , 		text : 'Warning Stock Level'},
			{value : 'danger' , 		text : 'Danger Stock Level'},
			]
		},
		queryParameters(){
			return `
			${this.has_expired_items ? '&has_expired_items='+this.has_expired_items : ''}
			${this.alert_type ? '&alert_type='+this.alert_type : ''}
			${this.instock ? '&instock='+this.instock : ''}
			`
		},

	},


	methods : {
		async fetchData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			this.$emit('fresh')
			await this.$axios.$get(`/branches/${this.branch.uuid}/stock?include=product_variation,product_variation.product,product_variation.variation&paginate=25${this.queryParameters}`)
			.then((res)=>{
				this.products = res.data
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


		async searchData(){
			this.searching = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/branches/${this.branch.uuid}/stock?include=product_variation,product_variation.product,product_variation.variation&paginate=25&query=${this.searchTerm}`)
			.then((res)=>{
				this.products = res.data
				this.pagination = res.meta.pagination
			})
			.catch((err)=>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.searching = false
			})
		},

		debouncedSearch : debounce( async function () {
			this.searching = true
			await this.searchData()
		},250),



		async loadExtraData(){
			this.fetching = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(this.pagination.links.next)
			.then(async(res)=>{
				await res.data.forEach((entry)=>{
					this.products.push(entry)
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
		clearFilters(){
			this.has_expired_items = ''
			this.instock = ''
			this.alert_type = ''
		}


	},


	watch : {
		async queryParameters(){
			await this.fetchData()
		}
	}
}