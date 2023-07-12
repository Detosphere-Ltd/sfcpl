export default {
	data(){
		return {
			failed : false,
			errData : undefined,
			loadingData : false,
			products : [],
			pagination : undefined,
			fetching : false,
			searching : false,
			searchTerm : '',
			state : '',
		}
	},


	computed : {
		queryParameters(){
			return `
			${this.state ? '&active='+this.state : ''}
			`
		},

		states(){
			return [
			{value :  '' , 		text : 'All Product Variations'},
			{value :  'false' , 		text : 'Inactive Product Variations'},
			{value : 'true' , 		text : 'Active Product Variations'},
			]
		}
	},


	methods : {
		async getVariations(){
			this.loadingData = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/product-variations?include=product,variation&paginate=25${this.queryParameters}`)
			.then((res)=>{
				this.products = res.data
				this.pagination = res.meta.pagination
			})
			.catch((err)=>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.loadingData = false
			})
		},

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

		async searchData(){
			this.searching = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/product-variations?include=product,variation&paginate=25&query=${this.searchTerm}`)
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
		clearFilters(){
			this.state = ''
			this.searchTerm = ''
		}
	},


	watch : {
		async queryParameters(){
			await this.getVariations()
		}
	}
}