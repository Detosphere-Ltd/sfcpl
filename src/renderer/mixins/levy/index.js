const bindProps = {
	props : {
		levy : {
			type : Object,
			required : true
		}
	}
}

const base = {
	data(){
		return {
			loading : false,
			form : {
				name : '',
				percent : 0,
				applies_to : ''
			}
		}
	}
}

const create = {


	methods : {
		async create(){
			this.loading = true
			this.$message.destroy()

			await this.$axios.$post(`/levies`, this.form)
			.then(()=>{
				this.$emit('done')
				this.$message.success('Your new levy has been added', 5)
			})
			.catch(err => {
				this.$message.error(`${err.response && err.response.data.message !== undefined ? err.response.data.message : 'Failed to create levy'}`, 5)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}

}

const patch = {

	methods : {
		async patch(){
			this.loading = true
			this.$message.destroy()

			await this.$axios.$patch(`/levies/${this.levy.uuid}`, this.form)
			.then(()=>{
				this.$emit('done')
				this.$message.success('Levy updated', 5)
			})
			.catch(err => {
				this.$message.error(`${err.response && err.response.data.message !== undefined ? err.response.data.message : 'Failed to update levy'}`, 5)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}

const toggle = {

	data(){
		return {
			loading : false,
		}
	},

	methods : {
		async toggle(){
			this.loading = true
			this.$axios.$post(`/levies/${this.levy.uuid}/toggle-active-status`)
			.then(()=>{
				this.$emit('done')
				this.$message.success(this.theMessagge, 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to ${this.levy.active ? 'deatcivate' : 'activate'} ${this.levy.name}. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})

		}
	},

	computed : {
		theMessagge(){
			return `${this.levy.name} has been ${this.levy.active ? 'deactivated' : 'activated'}`
		},
	}

}


const attach = {

	data(){
		return {
			processing : false,
			selectAll : false,
			selectedProducts : [],
		}
	},


	methods : {
		async attach(){
			this.processing = true
			await this.$axios.$post(`/levies/${this.levy.uuid}/products`, {products : this.selectedProducts})
			.then(()=>{
				this.$emit('done')
				this.selectedProducts = []
				this.$message.success(`The selected products have been attached to ${this.levy.name}`, 5)
			})
			.catch((err)=>{
				this.$message.error(`${err.response && err.response.data.message !== undefined ? err.response.data.message : 'Failed to attach the selected products to '+this.levy.name }`, 5)
			})
			.finally(()=>{
				this.processing = false
			})
		}
	}



}

export { bindProps , base , create, patch, toggle, attach}