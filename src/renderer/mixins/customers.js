import { debounce } from "lodash"
export default {
	data(){
		return {
			searching : false,
			failed : false,
			errData : undefined,
			loading : false,
			customers : [],
			pagination : undefined,
			state : '',
			fetching : false,
			searchTerm : '',
			has_debt : '',
			type : ''
		}
	},


	computed : {
		allCustomers(){
			return this.customers
		},
		queryParameters(){
			return `
			${this.state ? '&active='+this.state : ''}
			${this.has_debt ? '&has_debt='+this.has_debt : ''}
			${this.type ? '&type='+this.type : ''}
			`
		},

		states(){
			return [
			{value : '' , 		text : 'All Customers'},
			{value : 'true' , 	text : 'Active Customers'},
			{value : 'false' , 		text : 'Inactive Customers'},
			]
		},

		debtors(){
			return [
			{value : '' , 		text : 'All Customers'},
			{value : 'true' , 	text : 'Customers With Debt'},
			{value : 'false' , 		text : 'Customers With No Debt'},
			]
		},

		types(){
			return [
			{value : '' , 		text : 'All Customer Types'},
			{value : 'individual' , 	text : 'Individuals Only'},
			{value : 'company' , 		text : 'Companies Only'},
			]
		},

	},


	methods : {
		async fetchData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/customers?include=branch,created_by&paginate=500${this.queryParameters}`)
			.then((res)=>{
				this.customers = res.data
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
			await this.$axios.$get(`/customers?include=branch,created_by&paginate=500&query=${this.searchTerm}`)
			.then((res)=>{
				this.customers = res.data
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
					this.customers.push(entry)
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
			this.state = ""
			this.searchTerm = ""
			this.has_debt = ""
			this.type = ""
		}
	},


	watch : {
		async queryParameters(){
			await this.fetchData()
		}
	}
}