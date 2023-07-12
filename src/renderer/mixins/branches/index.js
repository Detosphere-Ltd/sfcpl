export default {
	data(){
		return {
			branches : [],
			loading : false,
			failed : false,
			errData : undefined,
			searchTerm : ''
		}
	},
	methods : {
		async getBranches(){
			this.loading = true
			this.failed = false
			this.$axios.$get(`/branches?include=manager,manager.avatar${this.$route.query.active !== undefined ? '&active='+this.$route.query.active : ''}`)
			.then((res)=>{
				this.branches = res.data
			})
			.catch((err)=>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.loading = false
			})
		}
	},

	computed : {
		filteredBranches(){
			return this.branches.filter( branch => {
				return branch.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			})
		}
	},

	watch : {
		async '$route'(){
			await this.getBranches()
		}
	}
}