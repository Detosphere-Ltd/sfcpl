export default {
	data(){
		return {
			staff : [],
			loading : false,
			failed : false,
			errData : undefined,
			searchTerm : '',
			active : true,
			level : ''
		}
	},
	methods : {
		async getStaff(){
			this.loading = true
			this.failed = false
			this.$axios.$get(`/users?include=branch,role,permissions,avatar,created_by${this.queryParameters}`)
			.then((res)=>{
				this.staff = res.data
			})
			.catch((err)=>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.loading = false
			})
		},

		clearFilters(){
			this.active = true
			this.level = ''
		}
	},

	computed : {
		filteredStaff(){
			return this.staff.filter( member => {
				return member.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			})
		},


		queryParameters(){
			return `
			${'&active='+this.active}${'&is_branch_user='+this.level}
			`
		}
	},

	watch : {
		async queryParameters(){
			await this.getStaff()
		}
	}
}