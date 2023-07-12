export default {
	data(){
		return {
			loading : false,
			stats : [],
			failed : false,
			errData : undefined,
		}
	},

	methods : {
		async getData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/reports/stock/warehouse`)
			.then((res)=>{
				this.stats = res.data
			})
			.catch( err =>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}