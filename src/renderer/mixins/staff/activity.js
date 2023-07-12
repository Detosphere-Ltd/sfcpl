export default {
	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			logs : [],
			pagination : undefined,
			state : '',
			fetching : false,
			to : undefined,
			from : undefined,
			caused_by : '',
			stats : {},
			branch : '',
			actions : [],
			activity_types : [],
			activity_type : '',
			action : '',
		}
	},


	computed : {

		queryParameters(){
			return `
			${this.caused_by ? '&caused_by='+this.caused_by : ''}
			${this.action ? '&action='+this.action : ''}
			${this.activity_type ? '&log_name='+this.activity_type : ''}
			${this.branch ? '&branch='+this.branch : ''}
			${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}
			`
		},
	},


	methods : {
		async getData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/activities?include=subject,causer&paginate=100${this.queryParameters}`)
			.then((res)=>{
				this.logs = res.data
				this.activity_types = res.meta.activity_types
				this.actions = res.meta.actions
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
				let logKeys = await Object.keys(this.logs)
				let keys = await Object.keys(res.data)
				
				await keys.forEach(item => {
					if (logKeys.includes(item)) {
						res.data[item].forEach(instance => {
							this.logs[item].push(instance)
						})
					}
					else{
						let activity = {}
						this.logs[item] = res.data[item]
					}
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
			this.caused_by = ''
			this.branch = ''
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