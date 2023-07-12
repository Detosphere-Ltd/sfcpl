export default {

	props : {
		url : {
			type : String,
		default : "products"
		},
		truncateBy : {
			type : Number,
		default : 0,
		}
	},

	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			list : [],
			pagination : undefined,
			fetching : false,
			searching : false,
			searchTerm : '',
			watcher : 'default',
			searched : false

		}
	},


	computed : {
		queryParameters(){
			return ''
		},

		ownUrl(){
			return null
		},

		theList(){
			if (this.truncateBy) {
				return this.list.splice(0, this.truncateBy)
			}

			return this.list
		}

	},


	methods : {
		async fetchData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/${this.ownUrl ? this.ownUrl : this.url}${this.queryParameters}`)
			.then((res)=>{
				this.list = res.data
				if (res.meta && res.meta.pagination) {
					this.pagination = res.meta.pagination
				}
				this.$emit('loaded')
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
					this.list.push(entry)
				})
				if (res.meta && res.meta.pagination) {
					this.pagination = res.meta.pagination
				}

				this.$emit('loaded')
			})
			.catch((err)=>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.fetching = false
			})
		},

		async getPaginatedResource(){

			if (this.pagination === undefined) {
				await this.fetchData()
				return
			}

			if (this.pagination.total_pages === this.pagination.current_page) {
				return
			}

			else{
				
				await this.loadExtraData()
			}
		},

		retry(){
			this.pagination = undefined
			this.watcher = this.watcher === 'default' ? 'fresh' : 'default'

		},

		async searchData(){
			this.searching = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/${this.url}&query=${this.searchTerm}`)
			.then((res)=>{
				this.list = res.data
				if (res.meta && res.meta.pagination) {
					this.pagination = res.meta.pagination
				}

				this.searched = true
			})
			.catch((err)=>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.searching = false
			})
		},


	},


	watch : {
		async queryParameters(){
			await this.fetchData()
		}
	}
}