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
			has_expired_items : '',
			instock : '',
			order_by : '',
			direction : '',
			reportType : 'overall',
		}
	},


	computed : {
		stockLevels(){
			return [
				{value : '' , 		text : 'Show Everything'},
				{value : 'true' , 		text : 'Products In Stock'},
				{value : 'false' , 		text : 'Products Out Stock'},
				]
		},

		reportTypes(){
			return [
				{value : 'overall' , 		text : 'Entire Store'},
				{value : 'warehouse' , 		text : 'Warehouse Only'},
				{value : 'branches' , 		text : 'Branches Only'},
				{value : '' , 		text : 'General Stock Info'},
				]
		},

		criteria(){
			return [
				{value : '' , 	text : 'No Criteria'},
				
				{value : 'total_profit_margin' , 	text : 'Total Profit Margin(%)'},
				{value : 'total_cost_price' , 	text : 'Total Cost Price'},
				{value : 'total_profit' , 	text : 'Total Profit'},

				{value : 'total_tax_amount' , 	text : 'Total Tax Amount'},

				{value : 'unit_selling_price' , 	text : 'Unit Selling Price'},

				{value : 'quantity_recorded' , 	text : 'Quantity Recorded (Incl. Reversed)'},
				{value : 'quantity_purchased' , 	text : 'Quantity Purchased (Excl. Reversed)'},

				{value : 'store_stock_selling_price' , 	text : 'Total Value of Stock At Current Price'},
				{value : 'store_stock_profit' , 	text : 'Total Estimated Profit At Current Price'},
				{value : 'store_stock_profit_margin' , 	text : 'Total Profit Margin(%) At Current Price'},

				{value : 'warehouse_stock' , 	text : 'Warehouse Quantity'},
				{value : 'warehouse_stock_cost_price' , 	text : 'Cost of Warehouse Qty.'},
				{value : 'warehouse_stock_selling_price' , 	text : 'Value of Warehouse Stock At Current Price'},
				{value : 'warehouse_stock_profit' , 	text : 'Estimated Profit of Warehouse Stock'},
				{value : 'warehouse_stock_profit_margin' , 	text : 'Profit Margin(%) of Warehouse Stock'},

				{value : 'branch_stock' , 	text : 'Qty. Held Across Branches'},
				{value : 'branch_stock_cost_price' , 	text : 'Cost of Items Across Branches'},
				{value : 'branch_stock_selling_price' , 	text : 'Value of Stock Across Branches'},
				{value : 'branch_stock_profit' , 	text : 'Estimated Profit Across Branches'},
				{value : 'branch_stock_profit_margin' , 	text : 'Estimated Profit Margin(%) Across Branches'},

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
			${this.has_expired_items ? '&has_expired_items='+this.has_expired_items : ''}
			${this.instock ? '&instock='+this.instock : ''}
			${this.order_by ? '&order_by='+this.order_by : ''}
			${this.direction ? '&direction='+this.direction : ''}
			`
		},
	},

	methods : {
		async getData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/reports/sales/products?paginate=50${this.queryParameters}`)
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
			await this.$axios.$get(`/reports/sales/products?paginate=50&query=${this.searchTerm}`)
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
			this.has_expired_items = ''
			this.instock = ''
			this.direction = ''
			this.order_by = ''
			this.reportType = 'overall'
		}

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
			has_expired_items : '',
			instock : '',
			order_by : '',
			direction : '',
			branch : '',
		}
	},


	computed : {
		stockLevels(){
			return [
				{value : '' , 		text : 'Everything'},
				{value : 'true' , 		text : 'In Stock'},
				{value : 'false' , 		text : 'Out Stock'},
				]
		},


		criteria(){
			return [
				{value : '' , 	text : 'No Criteria'},

				{value : 'quantity_available' , 	text : 'Qty. Available in Branch'},
				{value : 'quantity_available_cost_price' , 	text : 'Cost of Available Branch Stock'},
				{value : 'quantity_available_selling_price' , 	text : 'Value of Availbale Branch Stock'},
				{value : 'quantity_available_profit' , 	text : 'Estimated Profit of Branch Stock'},
				{value : 'quantity_available_profit_margin' , 	text : 'Estimated Profit Margin(%) of Branch Stock'},

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
			${this.has_expired_items ? '&has_expired_items='+this.has_expired_items : ''}
			${this.instock ? '&instock='+this.instock : ''}
			${this.order_by ? '&order_by='+this.order_by : ''}
			${this.direction ? '&direction='+this.direction : ''}
			${this.branch ? '&branch='+this.branch : ''}
			`
		},
	},

	methods : {
		async getData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/reports/stock/branch?paginate=50${this.queryParameters}`)
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
			await this.$axios.$get(`/reports/stock/branch?paginate=50&query=${this.searchTerm}`)
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
			this.has_expired_items = ''
			this.instock = ''
			this.direction = ''
			this.order_by = ''
			this.branch = ''
		}

	},


	watch : {
		async queryParameters(){
			await this.getData()
		}
	}
}

const warehouse = {
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
			has_expired_items : '',
			instock : '',
			order_by : '',
			direction : '',
			branch : '',
		}
	},


	computed : {
		stockLevels(){
			return [
				{value : '' , 		text : 'Everything'},
				{value : 'true' , 		text : 'In Stock'},
				{value : 'false' , 		text : 'Out Stock'},
				]
		},


		criteria(){
			return [
				{value : '' , 	text : 'No Criteria'},
				
				{value : 'quantity_available' , 	text : 'Qty. Available at Warehouse'},
				{value : 'quantity_available_cost_price' , 	text : 'Cost of Available Warehouse Stock'},
				{value : 'quantity_available_selling_price' , 	text : 'Value of Availbale Warehouse Stock'},
				{value : 'quantity_available_profit' , 	text : 'Estimated Profit of Warehouse Stock'},
				{value : 'quantity_available_profit_margin' , 	text : 'Estimated Profit Margin(%) of Warehouse Stock'},

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
			${this.has_expired_items ? '&has_expired_items='+this.has_expired_items : ''}
			${this.instock ? '&instock='+this.instock : ''}
			${this.order_by ? '&order_by='+this.order_by : ''}
			${this.direction ? '&direction='+this.direction : ''}
			`
		},
	},

	methods : {
		async getData(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/reports/stock/warehouse?paginate=50${this.queryParameters}`)
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
			await this.$axios.$get(`/reports/stock/warehouse?paginate=50&query=${this.searchTerm}`)
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
			this.has_expired_items = ''
			this.instock = ''
			this.direction = ''
			this.order_by = ''
			this.branch = ''
		}

	},


	watch : {
		async queryParameters(){
			await this.getData()
		}
	}
}

export {store, branches, warehouse}