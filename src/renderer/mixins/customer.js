const bindProps = {
	props : {
		customer : {
			type : Object,
			required : true
		}
	},

	methods : {
		async copyPhoneNumber(){
			let codeNode = document.createElement('input')
			document.body.appendChild(codeNode)
			codeNode.value = `${this.customer.phone}`
			codeNode.select();
			document.execCommand("copy");
			document.body.removeChild(codeNode);
			this.$message.success('Phone Number Copied')
		},


		async copyEmailAddress(){
			let codeNode = document.createElement('input')
			document.body.appendChild(codeNode)
			codeNode.value = `${this.customer.email}`
			codeNode.select();
			document.execCommand("copy");
			document.body.removeChild(codeNode);
			this.$message.success('Email Address Copied')
		},


	}

}

const base = {
	data(){
		return {
			loading : false,
			showModal : false
		}
	}
}


const create = {
	data(){
		return {
			customerForm : {
				name : '',
				email : '',
				phone : '',
				gender : '',
				date_of_birth : '',
				type : 'individual',
			}
		}
	},

	methods : {
		async createCustomer(){
			this.loading = true
			await this.$axios.$post(`/customers`, this.customerForm)
			.then(()=>{
				this.showModal = false
				this.$emit('customer-created')
				this.$message.success("New customer added to your store.", 4)
			})
			.catch((err)=>{
				this.$message.success(`Failed to add customer. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},

		reset(){
			this.customerForm = {
				name : '',
				email : '',
				phone : '',
				gender : '',
				date_of_birth : '',
				type : 'individual',
			}
		}
	}
}


const update = {
	data(){
		return {
			customerForm : {
				name : this.customer.name ? this.customer.name : '',
				email : this.customer.email ? this.customer.email : '',
				phone : this.customer.phone ? this.customer.phone : '',
				gender : this.customer.gender ? this.customer.gender : '',
				date_of_birth : this.customer.date_of_birth ? this.$moment(this.customer.date_of_birth).format('YYYY-MM-DD') : '',
				type : this.customer.type ? this.customer.type : '',
			}
		}
	},

	methods : {
		async updateCustomer(){
			this.loading = true
			await this.$axios.$patch(`/customers/${this.customer.uuid}`, this.customerForm)
			.then(()=>{
				this.showModal = false
				this.$emit('needs-to-refresh')
				this.$message.success(`${this.customer.name}'s customer profile has been updated`, 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to update customer. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}


const toggleActiveState = {

	methods : {
		async toggle(){
			this.loading = true
			this.$axios.$post(`/customers/${this.customer.uuid}/toggle-active-status`)
			.then(()=>{
				this.$emit('status-changed')
				this.$message.success(this.theMessagge, 4)
				this.showModal = false
			})
			.catch((err)=>{
				this.$message.error(`Failed to ${this.customer.active ? 'deatcivate' : 'activate'} ${this.customer.name}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})

		}
	},

	computed : {
		theMessagge(){
			return `Customer profile ${this.customer.active ? 'deactivated' : 'activated'}`
		},
	}
}

const sales = {
	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			sales : [],
			pagination : undefined,
			fetching : false,
			to : undefined,
			from : undefined,
			state : '',
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
			await this.$axios.$get(`/customers/${this.customer.uuid}/sales?include=created_by,branch,reversed_by&paginate=100${this.queryParameters}`)
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




export {bindProps, base, create, update, toggleActiveState, sales}