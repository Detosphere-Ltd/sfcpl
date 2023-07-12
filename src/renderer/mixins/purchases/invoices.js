import { debounce } from "lodash"
export default {
	data(){
		return {
			failed : false,
			searching : false,
			errData : undefined,
			loading : false,
			invoices : [],
			pagination : undefined,
			state : '',
			fetching : false,
			to : undefined,
			from : undefined,
			outstanding : '',
			searchTerm : '',
			supplier : ''
		}
	},


	computed : {
		queryParameters(){
			return `
			${this.state ? '&reversed='+this.state : ''}
			${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}
			${this.outstanding ? '&outstanding='+this.outstanding : ''}
			${this.supplier ? '&supplier='+this.supplier : ''}
			`
		},

		states(){
			return [
			{value : 'false' , 		text : 'Valid Purchases'},
			{value : 'true' , 		text : 'Reversed Purchases'},
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
		async getInvoices(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/purchase-invoices?include=supplier,created_by,reversed_by&paginate=25${this.queryParameters}`)
			.then((res)=>{
				this.invoices = res.data
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

		async search(){
			this.searching = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/purchase-invoices?include=supplier,created_by,reversed_by&paginate=25&query=${this.searchTerm}`)
			.then((res)=>{
				this.invoices = res.data
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
			await this.search()
		},250),

		async loadExtraData(){
			this.fetching = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(this.pagination.links.next)
			.then(async(res)=>{
				await res.data.forEach((entry)=>{
					this.invoices.push(entry)
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
			this.outstanding = ""
			this.supplier = ""
			this.searchTerm = ""

		}
	},


	watch : {
		async queryParameters(){
			await this.getInvoices()
		}
	}
}