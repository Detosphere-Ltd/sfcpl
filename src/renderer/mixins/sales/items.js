export default {
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
			saleBranch : '',
			outstanding : '',
			tags : [],
			variation : '',
			searchTerm : '',
			searching : false
		}
	},


	computed : {
		queryParameters(){
			return `
			${this.state ? '&reversed='+this.state : ''}
			${this.variation ? '&variation='+this.variation : ''}
			${this.source ? '&source='+this.source : ''}
			${this.saleBranch ? '&branch='+this.saleBranch : ''}
			${this.outstanding ? '&outstanding='+this.outstanding : ''}
			${this.tags && this.tags.length > 0 ? '&tags='+this.tags.toString() : ''}
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
			await this.$axios.$get(`/sale-items?include=stock,stock.product_variation,stock.product_variation.product,stock.product_variation.variation,sale.created_by,sale.branch,sale.customer,sale.reversed_by&paginate=50${this.queryParameters}`)
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

		async searchData(){
			this.searching = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/sale-items?include=stock,stock.product_variation,stock.product_variation.product,stock.product_variation.variation,sale.created_by,sale.branch,sale.customer,sale.reversed_by&paginate=50&query=${this.searchTerm}`)
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
				this.searching = false
			})
		},


		applyDate(payload){
			this.to = this.$moment(payload.endDate).format('DD/MM/YYYY')
			this.from = this.$moment(payload.startDate).format('DD/MM/YYYY')
		},
		clearFilters(){
			this.state = ''
			this.source = ''
			this.saleBranch = ''
			this.from = undefined
			this.to = undefined
			this.outstanding = ''
			this.tags = []
			this.searchTerm = ''
			this.variation = ''
		}
	},


	watch : {
		async queryParameters(){
			if (!this.loading || !this.searching || !this.fetching) {
				await this.loadSales()
			}
		}
	}
}