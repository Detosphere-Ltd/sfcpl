const bindProps = {
	props: {
		unit : {
			type : Object,
			required : true
		}
	}
}

const modify = {
	data(){
		return {
			loading : false,
			unitForm: {
				name : this.unit.name,
				description : this.unit.description,
			}
		}
	},
	methods : {
		async patch(){
			this.loading = true
			await this.$axios.$patch(`/unit-types/${this.unit.uuid}`, this.unitForm)
			.then(()=>{
				this.$emit('done')
				this.$message.success("Purchase unit updated", 4)
				this.showModal = false
			})
			.catch(()=>{
				this.$message.error("Failed to update purchase unit", 4)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	},
}

const toggleActiveState = {
	data(){
		return {
			loading : false			
		}
	},
	methods : {
		async toggle(){
			this.loading = true
			this.$axios.$post(`/unit-types/${this.unit.uuid}/toggle-active-status`)
			.then(()=>{
				this.$emit('done')
				this.$message.success( this.theMessagge, 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to ${this.unit.active ? 'deatcivate' : 'activate'} ${this.unit.name}. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false

			})
			

		}
	},

	computed : {
		theMessagge(){
			return `${this.unit.name} ${this.unit.active ? 'has been deactivated' : 'has been restored'}`
		}
	}
}

export {bindProps, modify, toggleActiveState}