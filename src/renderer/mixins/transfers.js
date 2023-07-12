import { debounce } from "lodash"
export default {
	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			transfers : [],
			pagination : undefined,
			state : '',
			fetching : false,
			to : undefined,
			from : undefined,
			direction : '',
			type : '',
			origin : '',
			searching : '',
			searchTerm : '',
		}
	},


	computed : {
		allTransfers(){
			return this.transfers
		},
		queryParameters(){
			return `
			${this.state ? '&state='+this.state : ''}
			${this.direction ? '&direction='+this.direction : ''}
			${this.type ? '&type='+this.type : ''}
			${this.origin ? '&from_transfer_request='+this.origin : ''}
			${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}
			`
		},

		states(){
			return [
			{value : 'created' , 		text : 'Created Transfers'},
			{value : 'cancelled' , 		text : 'Cancelled Transfers'},
			{value : 'dispatched' , 	text : 'Dispatched Transfers'},
			{value : 'raised_issue' , 	text : 'Tranfers with Pending Issues'},
			{value : 'resolved' , 		text : 'Transfers with Resolved Issues'},
			{value : 'confirmed' , 		text : 'Accepted / Confirmed Transfers'},
			]
		},
		directions(){
			return [
			{value : 'branch', text : 'Outgoing to Branches'},
			{value : 'warehouse', text : 'Incoming from Branches'},
			]
		},

		types(){
			return [
			{value : '', text : 'All Transfer Types'},
			{value : 'automatic', text : 'Automatic Transfers'},
			{value : 'manual', text : 'Manual Transfers'},
			]
		},

		origins(){
			return [
			{value : '', text : 'All Causes'},
			{value : 'false', text : 'Direct Transfers'},
			{value : 'true', text : 'Initiated from Request'},
			]
		}
	},


	methods : {
		async loadTransfers(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/transfers?include=branch,created_by&paginate=50${this.queryParameters}`)
			.then((res)=>{
				this.transfers = res.data
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
					this.transfers.push(entry)
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
			this.$emit('fresh')
			await this.$axios.$get(`/transfers?include=branch,created_by&paginate=50&reference_no=${this.searchTerm}`)
			.then((res)=>{
				this.transfers = res.data
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

		applyDate(payload){
			this.to = this.$moment(payload.endDate).format('DD/MM/YYYY')
			this.from = this.$moment(payload.startDate).format('DD/MM/YYYY')
		},
		clearFilters(){
			this.from = ""
			this.to = ""
			this.state = ""
			this.direction = ""
			this.type = ""
			this.origin = ""
			this.searchTerm = ""
		}
	},


	watch : {
		async queryParameters(){
			await this.loadTransfers()
		}
	}
}