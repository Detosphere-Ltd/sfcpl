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
			searchTerm : ''

		}
	},


	computed : {
		allProducts(){
			return this.products
		},
		queryParameters(){
			return ""
		},

	},


	methods : {
		async fetchData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/products?paginate=25`)
			.then((res)=>{
				this.products = res.data
				this.pagination = res.meta.pagination
				this.$emit('loaded')
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
			await this.$axios.$get(`/products?paginate=25&query=${this.searchTerm}`)
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


	},


	watch : {
		async queryParameters(){
			await this.fetchData()
		}
	}
}