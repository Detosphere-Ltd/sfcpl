export default {
	props : {
		branch : {
			type : Object,
			required : true
		}
	},
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
			await this.$axios.$get(`/statistics/last-30-days?branch=${this.branch.uuid}`)
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