const bindProps = {
	props : {
		supplier : {
			type : Object,
			required : true
		}
	}
}

const create = {
	data(){
		return {
			loading : false,
			supplierForm:{
				name : '',
				country : '',
				phone : '',
				city : '',
				email : ''
			}
		}
	},

	methods : {
		async addSupplier(){
			this.loading = true
			if (!this.supplierForm.phone) {
				this.supplierForm.phone = null
			}
			await this.$axios.$post('/suppliers', this.supplierForm)
			.then(async ()=>{
				

				if (this.showModal) {
					this.showModal = false
				}
				
				await this.reset()
				await this.$store.dispatch('suppliers/getSuppliers')
				await this.$emit('supplier-created')
			})
			.catch((err)=>{
				this.$message.error(`Failed to create supplier. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)			
			})
			.finally(()=>{
				this.loading = false
			})
		},

		reset(){
			this.supplierForm = {
				name : '',
				country : '',
				phone : '',
				city : '',
				email : ''
			}
		}
	}
}

const loader = {
	data(){
		return {
			suppliers : [],
			loading : false,
			failed : false,
			errData : undefined,
			searchTerm : ''
		}
	},
	methods : {
		async getSuppliers(){
			this.loading = true
			this.failed = false
			this.$axios.$get('/suppliers?include=created_by')
			.then((res)=>{
				this.suppliers = res.data
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
		filteredSuppliers(){
			return this.suppliers.filter( brand => {
				return brand.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			})
		}
	}
}

const update = {
	data(){
		return {
			loading : false,
			supplierInfo: {
				name : '',
				country : '',
				phone : '',
				city : '',
				email : ''
			}
		}
	},
	methods : {
		async updateSupplier(){
			this.loading = true
			await this.$axios.$patch(`/suppliers/${this.supplier.uuid}`, this.supplierInfo)
			.then(()=>{
				this.$emit('supplier-updated')
				this.$message.success("Supplier updated", 4)
				this.showModal = false
			})
			.catch(()=>{
				this.$message.error("Failed to update supplier", 4)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	},

	mounted(){
		Object.assign(this.supplierInfo , ...Object.keys(this.supplierInfo).map(k => k in this.supplier && { [k]: this.supplier[k] }))
	}
}

const toggleActiveState = {

	data(){
		return {
			loading : false,
		}
	},

	methods : {
		async toggle(){
			this.loading = true
			this.$axios.$post(`/suppliers/${this.supplier.uuid}/toggle-active-status`)
			.then(()=>{
				this.$emit('supplier-status-changed')
				this.$message.success(this.theMessagge, 4)
				this.showModal = false
			})
			.catch((err)=>{
				this.$message.error(`Failed to ${this.supplier.active ? 'deatcivate' : 'activate'} ${this.supplier.name}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})

		}
	},

	computed : {
		theMessagge(){
			return `Supplier ${this.supplier.active ? 'deactivated' : 'has been activated'}`
		},
	}
}

export { bindProps, loader, update, toggleActiveState, create}