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
			direction : ''
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
			${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}
			`
		},

		states(){
			return [
			{value : 'submitted' , 		text : 'Submitted Requests '},
			{value : 'cancelled' , 		text : 'Cancelled Requests '},
			{value : 'accepted' , 		text : 'Accepted Requests '},
			]
		},

		directions(){
			return [
			{value : 'branch', text : 'Warehouse To Branches'},
			{value : 'warehouse', text : 'Branches To Warehouse'},
			]
		}
	},


	methods : {
		async loadTransfers(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/transfer-requests?include=branch,created_by&paginate=50${this.queryParameters}`)
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

		applyDate(payload){
			this.to = this.$moment(payload.endDate).format('DD/MM/YYYY')
			this.from = this.$moment(payload.startDate).format('DD/MM/YYYY')
		},
		clearFilters(){
			this.from = ""
			this.to = ""
			this.state = ""
			this.direction = ""
		}
	},


	watch : {
		async queryParameters(){
			await this.loadTransfers()
		}
	}
}