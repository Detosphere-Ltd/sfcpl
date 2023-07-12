import { debounce } from "lodash"
let self = this

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
			has_expired_items : '',
			instock : ''
		}
	},


	computed : {
		allProducts(){
			return this.products
		},
		expiry(){
			return [
				{value : '' , 		text : 'Product Stock Health'},
				{value : 'false' , 		text : 'Non Expired Products'},
				{value : 'true' , 		text : 'Products with Expired Stock'},
				]
		},

		stockLevels(){
			return [
				{value : '' , 		text : 'All Products'},
				{value : 'false' , 		text : 'Out of Stock Products'},
				{value : 'true' , 		text : 'Products In Stock'},
				]
		},

		queryParameters(){
			return `
			${this.has_expired_items ? '&has_expired_items='+this.has_expired_items : ''}
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
			await this.$axios.$get(`/products?include=tags,variations,variations.variation,variations.created_by,created_by,media,variations.available_branches,stock_alert_settings&paginate=25${this.queryParameters}`)
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
			await this.$axios.$get(`/products?include=tags,variations,variations.variation,variations.created_by,created_by,media,variations.available_branches,stock_alert_settings&paginate=25&query=${this.searchTerm}`)
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
		}


	},


	watch : {
		async queryParameters(){
			await this.fetchData()
		}
	}
}