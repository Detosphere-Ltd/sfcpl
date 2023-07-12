const bindProps = {
	props:{
		staff : {
			type : Object,
			required : true
		}
	}
}
const fetchActivities = {
	data(){
		return{
			loading : true,
			loadFailed: false,
			failedReason : undefined,
			activities : [],
			page : 1,
			totalPages : undefined,
		}
	},
	methods:{
		async initialFetch(){
			this.loading = true
			this.loadFailed = false
			this.page = 1
			await this.$axios.$get(`/users/${this.staff.uuid}/activities`)
			.then(res=>{
				this.activities = res.data
				this.page = res.meta.pagination.current_page
				this.totalPages = res.meta.pagination.total_pages
			}).catch(err => {
				this.loadFailed = true
				this.failedReason = err
			})
			.finally(()=>{
				this.loading = false
			})
		},

		async loadPageAt(page){
			this.loading = true
			this.loadFailed = false
			await this.$axios.$get(`/users/${this.staff.uuid}/activities?page=${page}`)
			.then(res=>{
				this.activities = res.data
				this.page = res.meta.pagination.current_page
				this.totalPages = res.meta.pagination.total_pages
			})
			.catch(err => {
				this.loadFailed = true
				this.failedReason = err
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}

export {
	fetchActivities, bindProps
}