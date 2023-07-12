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
			branch : '',
			tags : [],
			at_branch : '',
			reversed : '',
		}
	},


	computed : {

		queryParameters(){
			return `
			${this.caused_by ? '&recorded_by='+this.caused_by : ''}
			${this.at_branch ? '&at_branch='+this.at_branch : ''}
			${this.reversed ? '&reversed='+this.reversed : ''}
			${this.tags && this.tags.length > 0 ? '&tags='+this.tags.toString() : ''}
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
			await this.$axios.$get(`/stock-adjustments?include=branch,model,model.purchase,model.product_variation,model.product_variation.variation,model.product_variation.product,model.purchase.supplier,model.supplier,created_by,reversed_by,tags&paginate=100${this.queryParameters}`)
			.then((res)=>{
				this.logs = res.data
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
			this.at_branch = ''
			this.reversed = ''
			this.tags = []
		}
	},


	watch : {
		async queryParameters(){
			if (!this.loading && !this.fetching) {
				await this.getData()
			}
		}
	}
}