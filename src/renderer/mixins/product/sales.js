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
			${this.saleBranch ? '&branch='+this.saleBranch : ''}
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
			await this.$axios.$get(`/products/${this.product.uuid}/sales?include=sale.created_by,sale.branch,sale.customer,sale.reversed_by&paginate=50${this.queryParameters}`)
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
			this.saleBranch = ''
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