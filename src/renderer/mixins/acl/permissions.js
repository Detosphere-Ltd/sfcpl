export default {
	data(){
		return {
			permissions : [],
			loading : false,
			failed : false,
			errData : undefined,
			searchTerm : ''
		}
	},
	methods : {
		async getPermissions(){
			this.loading = true
			this.failed = false
			this.$axios.$get('/permissions')
			.then((res)=>{
				this.permissions = res.data
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
		filteredPermissions(){
			return this.permissions.filter( role => {
				return role.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			})
		}
	}
}