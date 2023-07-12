export default {
	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			activities : [],
			pagination : undefined,
			fetching : false,
			to : undefined,
			from : undefined,
			staff : '',
			branch : '',
			action : '',
			activity : '',
		}
	},


	computed : {

		allActivities(){
			return this.activities
		},

		queryParameters(){
			return `
			${this.action ? '&action='+this.action : ''}
			${this.staff ? '&staff='+this.staff : ''}
			${this.branch ? '&branch='+this.branch : ''}
			${this.activity ? '&activity='+this.activity : ''}
			${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}
			`
		},

		states(){
			return [
			{value :  false , 		text : 'Active Sales'},
			{value : true , 		text : 'Reversed Sales'},
			]
		},

		sources(){
			return [
			{value : 'pos_generated' , 	text : 'POS Sales'},
			{value : 'manual_entry' , 	text : 'Manual Entries'},
			]
		}
	},


	methods : {
		async getData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/branches?paginate=100${this.queryParameters}`)
			.then((res)=>{
				this.activities = res.data
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
					this.activities.push(entry)
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
			this.staff = ''
			this.branch = ''
			this.action = ''
			this.activity = ''
			this.from = undefined
			this.to = undefined
		}
	},


	watch : {
		async queryParameters(){
			await this.getData()
		}
	}
}