const products = {
	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			stats : [],
			fetching : false,
			to : undefined,
			from : undefined,
			productSelection : [],
			loadModal : false,
			showModal : false
		}
	},

	computed : {

		reportQueryParameters(){
			return `
			${this.productSelection ? '&products='+this.productSelection.toString() : ''}
			${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}
			`
		},
	},

	methods : {
		async getData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/reports/comparisons/products?${this.reportQueryParameters}`)
			.then((res)=>{
				this.stats = res.data
				this.$emit('data-loaded')
			})
			.catch( err =>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.loading = false
			})
		},

		

		clearFilters(){
			this.from = undefined
			this.to = undefined
			this.branches =  []
			
		},

		applyDate(payload){
			this.to = this.$moment(payload.endDate).format('DD/MM/YYYY')
			this.from = this.$moment(payload.startDate).format('DD/MM/YYYY')
		},

	}
}





const branches = {
	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			stats : [],
			fetching : false,
			to : undefined,
			from : undefined,
			branches : [],
			loadModal : false,
			showModal : false
		}
	},


	computed : {

		queryParameters(){
			return `
			${this.branches ? '&branches='+this.branches.toString() : ''}
			${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}
			`
		},
	},

	methods : {
		async getData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/reports/comparisons/branches?${this.queryParameters}`)
			.then((res)=>{
				this.stats = res.data
				this.$emit('data-loaded')
			})
			.catch( err =>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.loading = false
			})
		},

		

		clearFilters(){
			this.from = undefined
			this.to = undefined
			this.branches =  []
		},

		applyDate(payload){
			this.to = this.$moment(payload.endDate).format('DD/MM/YYYY')
			this.from = this.$moment(payload.startDate).format('DD/MM/YYYY')
		},

	}
}



export {branches, products}