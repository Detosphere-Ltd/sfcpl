const bindProps = {
	props : {
		branch : {
			type : Object,
			required : true
		}
	}
}

const branchStaff = {
	data(){
		return {
			staff : [],
			loading : false,
			failed : false,
			errData : undefined,
			searchTerm : ''
		}
	},
	methods : {
		async getBranchStaff(){
			this.loading = true
			this.failed = false
			this.$axios.$get(`/branches/${this.branch.uuid}/users?&include=branch,role,permissions,avatar,created_by`)
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
		}
	},

	computed : {
		filteredStaff(){
			return this.staff.filter( member => {
				return member.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			})
		}
	}
}


const fetchActivities = {
	data(){
		return{
			loading : false,
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
			await this.$axios.$get(`/branches/${this.branch.uuid}/activities`)
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
			await this.$axios.$get(`/branches/${this.branch.uuid}/activities?page=${page}`)
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

const branchSales = {
	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			sales : [],
			pagination : undefined,
			state : '',
			fetching : false,
			to : undefined,
			from : undefined,
			source : '',
			stats : {},
			outstanding : '',
			payment_modes : [],
		}
	},


	computed : {
		allSales(){
			return this.sales
		},
		queryParameters(){
			return `
			${this.state ? '&reversed='+this.state : ''}
			${this.source ? '&source='+this.source : ''}
			${this.outstanding ? '&outstanding='+this.outstanding : ''}
			${this.payment_modes && this.payment_modes.length > 0 ? '&payment_modes='+this.payment_modes.toString() : ''}
			${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}
			`
		},

		states(){
			return [
				{value :  false , 		text : 'Active Sales'},
				{value : true , 		text : 'Reversed Sales'},
				]
		},

		sources(){
			return [
				{value : 'pos_generated' , 	text : 'POS Sales'},
				{value : 'manual_entry' , 	text : 'Manual Entries'},
				]
		}
	},


	methods : {
		async loadSales(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/branches/${this.branch.uuid}/sales?include=created_by,branch,customer,reversed_by&paginate=100${this.queryParameters}`)
			.then((res)=>{
				this.sales = res.data
				this.stats = res.meta.stats
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
					this.sales.push(entry)
				})
				this.stats = res.meta.stats
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
			this.state = ''
			this.source = ''
			this.from = undefined
			this.to = undefined
			this.outstanding = ''
			this.payment_modes = []
		}
	},


	watch : {
		async queryParameters(){
			await this.loadSales()
		}
	}
}


const manager = {

	data(){
		return {
			processing : false
		}
	},

	methods : {
		async assignManager(manager){
			this.processing = true
			this.$message.destroy()
			await this.$axios.$patch(`/branches/${this.branch.uuid}`, {manager_id : manager})
			.then(res => {
				this.$emit('done')
				this.$message.success('Branch Manager Assigned Successfully', 5)
			})
			.catch(err => {
				this.$message.error(`Failed to assign Branch Manager. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 5)
			})
			.finally(()=>{
				this.processing = false
			})
		}
	}
}

export {bindProps , branchStaff, fetchActivities, branchSales, manager}