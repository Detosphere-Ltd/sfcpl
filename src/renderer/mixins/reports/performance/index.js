import { debounce } from "lodash"
const store = {
	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			stats : [],
			pagination : undefined,
			fetching : false,
			searching : '',
			searchTerm : '',
			order_by : '',
			direction : '',
			branch : '',
			to : undefined,
			from : undefined,
		}
	},


	computed : {


		criteria(){
			return [
				{value : '' , 	text : 'No Criteria'},
				{value : 'quantity' , 	text : 'Quantity Sold'},
				{value : 'gross_amount' , 	text : 'Gross Amount'},
				{value : 'discount_amount' , 	text : 'Discount Given'},
				{value : 'total_tax_amount' , 	text : 'Total Tax Amount'},
				{value : 'amount_payable' , 	text : 'Net Amount'},
				{value : 'profit' , 	text : 'Estimated Profit'},
				{value : 'profit_margin' , 	text : 'Estimated Profit Margin'},

				]
		},

		directions(){
			return [
				{value : '' , 		text : 'Unordered'},
				{value : 'desc' , 		text : 'Descending Order'},
				{value : 'asc' , 		text : 'Ascending Order'},
				]
		},
		queryParameters(){
			return `
			${this.branch ? '&branch='+this.branch : ''}
			${this.order_by ? '&order_by='+this.order_by : ''}
			${this.direction ? '&direction='+this.direction : ''}
			${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}
			`
		},
	},

	methods : {
		async getData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/reports/performance/products?paginate=1${this.queryParameters}`)
			.then((res)=>{
				this.stats = res.data
				this.pagination = res.meta.pagination
			})
			.catch( err =>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.loading = false
			})
		},

		async searchData(){
			this.searching = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/reports/performance/products?paginate=1&query=${this.searchTerm}`)
			.then((res)=>{
				this.stats = res.data
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

		debouncedSearch : debounce( async function () {
			this.searching = true
			await this.searchData()
		},250),


		async loadExtraData(){
			this.fetching = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(this.pagination.links.next)
			.then(async(res)=>{
				await res.data.forEach((entry)=>{
					this.stats.push(entry)
				})
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

		clearFilters(){
			this.from = undefined
			this.to = undefined
			this.branch =  ""
			this.direction = ''
			this.order_by = ''

		},

		applyDate(payload){
			this.to = this.$moment(payload.endDate).format('DD/MM/YYYY')
			this.from = this.$moment(payload.startDate).format('DD/MM/YYYY')
		},

	},


	watch : {
		async queryParameters(){
			await this.getData()
		}
	}
}

const branches = {
	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			stats : [],
			pagination : undefined,
			fetching : false,
			searching : '',
			searchTerm : '',
			order_by : '',
			direction : '',
			branch : '',
			to : undefined,
			from : undefined,
		}
	},


	computed : {


		criteria(){
			return [
				{value : '' , 	text : 'No Criteria'},
				{value : 'quantity' , 	text : 'Quantity Sold'},
				{value : 'sale_frequency' , 	text : 'Number of Sales'},
				{value : 'gross_amount' , 	text : 'Gross Amount'},
				{value : 'discount_amount' , 	text : 'Discount Given'},
				{value : 'vat_amount' , 	text : 'VAT Amount'},
				{value : 'amount_payable' , 	text : 'Net Amount'},
				{value : 'profit' , 	text : 'Estimated Profit'},
				{value : 'profit_margin' , 	text : 'Estimated Profit Margin'},

				]
		},

		directions(){
			return [
				{value : '' , 		text : 'Unordered'},
				{value : 'desc' , 		text : 'Descending Order'},
				{value : 'asc' , 		text : 'Ascending Order'},
				]
		},
		queryParameters(){
			return `
			${this.branch ? '&branch='+this.branch : ''}
			${this.order_by ? '&order_by='+this.order_by : ''}
			${this.direction ? '&direction='+this.direction : ''}
			${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}
			`
		},
	},

	methods : {
		async getData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/reports/sales/branches?paginate=50${this.queryParameters}`)
			.then((res)=>{
				this.stats = res.data
				this.pagination = res.meta.pagination
			})
			.catch( err =>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.loading = false
			})
		},

		async searchData(){
			this.searching = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/reports/sales/branches?paginate=50&query=${this.searchTerm}`)
			.then((res)=>{
				this.stats = res.data
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

		debouncedSearch : debounce( async function () {
			this.searching = true
			await this.searchData()
		},250),


		async loadExtraData(){
			this.fetching = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(this.pagination.links.next)
			.then(async(res)=>{
				await res.data.forEach((entry)=>{
					this.stats.push(entry)
				})
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

		clearFilters(){
			this.from = undefined
			this.to = undefined
			this.branch =  ""
			this.direction = ''
			this.order_by = ''
			
		},

		applyDate(payload){
			this.to = this.$moment(payload.endDate).format('DD/MM/YYYY')
			this.from = this.$moment(payload.startDate).format('DD/MM/YYYY')
		},

	},


	watch : {
		async queryParameters(){
			await this.getData()
		}
	}
}


const products = {
	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			stats : [],
			pagination : undefined,
			fetching : false,
			searching : '',
			searchTerm : '',
			order_by : '',
			direction : '',
			branch : '',
			to : undefined,
			from : undefined,
		}
	},


	computed : {


		criteria(){
			return [
				{value : '' , 	text : 'No Criteria'},
				{value : 'quantity' , 	text : 'Quantity Sold'},
				{value : 'frequency' , 	text : 'Number of Sales'},
				{value : 'amount' , 	text : 'Sale Value Amount'},
			// {value : 'discount_amount' , 	text : 'Discount Given'},
			// {value : 'vat_amount' , 	text : 'VAT Amount'},
			// {value : 'amount_payable' , 	text : 'Net Amount'},
			// {value : 'profit' , 	text : 'Estimated Profit'},
			// {value : 'profit_margin' , 	text : 'Estimated Profit Margin'},

				]
		},

		directions(){
			return [
				{value : '' , 		text : 'Unordered'},
				{value : 'desc' , 		text : 'Descending Order'},
				{value : 'asc' , 		text : 'Ascending Order'},
				]
		},
		queryParameters(){
			return `
			${this.branch ? '&branch='+this.branch : ''}
			${this.order_by ? '&order_by='+this.order_by : ''}
			${this.direction ? '&direction='+this.direction : ''}
			${this.to && this.from ? '&end='+this.to+'&start='+this.from : ''}
			`
		},
	},

	methods : {
		async getData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/statistics/top-product-sales?limit=${this.queryParameters}`)
			.then((res)=>{
				this.stats = res.data
			})
			.catch( err =>{
				this.errData = err
				this.failed = true
			})
			.finally(()=>{
				this.loading = false
			})
		},

		async searchData(){
			this.searching = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/statistics/top-product-sales?&query=${this.searchTerm}`)
			.then((res)=>{
				this.stats = res.data
			})
			.catch((err)=>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.searching = false
			})
		},

		debouncedSearch : debounce( async function () {
			this.searching = true
			await this.searchData()
		},250),


		async loadExtraData(){
			this.fetching = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(this.pagination.links.next)
			.then(async(res)=>{
				await res.data.forEach((entry)=>{
					this.stats.push(entry)
				})
			})
			.catch((err)=>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.fetching = false
			})
		},

		clearFilters(){
			this.from = undefined
			this.to = undefined
			this.branch =  ""
			this.direction = ''
			this.order_by = ''
			
		},

		applyDate(payload){
			this.to = this.$moment(payload.endDate).format('DD/MM/YYYY')
			this.from = this.$moment(payload.startDate).format('DD/MM/YYYY')
		},

	},


	watch : {
		async queryParameters(){
			await this.getData()
		}
	}
}



export {store, branches, products}