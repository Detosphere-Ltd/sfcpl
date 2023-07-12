const years = {
	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			years : [],
			pagination : undefined,
			cancelled : false,
		}
	},


	computed : {
		queryParameters(){
			return `
			${this.cancelled ? '&with-cancelled='+this.cancelled : ''}
			`
		}
	},


	methods : {
		async getData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/financial-years?include=closed_by,cancelled_by&paginate=50${this.queryParameters}`)
			.then((res)=>{
				this.years = res.data
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
					this.years.push(entry)
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
			this.cancelled = false
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


export {years}