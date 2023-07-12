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
		async getStats(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/statistics/transfer-requests`)
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