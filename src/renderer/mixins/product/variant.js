const bindProps = {
	props : {
		variant : {
			type : Object,
			required : true
		}
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
			this.$axios.$post(`/variations/${this.variant.uuid}/toggle-active-status`)
			.then(()=>{
				this.$emit('status-changed')
				this.$message.success(this.theMessagge, 4)
				this.showModal = false
			})
			.catch((err)=>{
				this.$message.error(`Failed to ${this.variant.active ? 'deatcivate' : 'activate'} ${this.variant.name}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})

		}
	},

	computed : {
		theMessagge(){
			return `Variation ${this.variant.active ? 'deactivated' : 'has been activated'}`
		},
	}
}

const modify = {
	data(){
		return {
			loading : false,
			variantForm: {
				name : this.variant.name,
				code : this.variant.code ? this.variant.code : '' ,
			}
		}
	},
	methods : {
		async update(){
			this.loading = true
			await this.$axios.$patch(`/variations/${this.variant.uuid}`, this.variantForm)
			.then(()=>{
				this.$emit('updated')
				this.$message.success("Product variation type updated", 4)
				this.showModal = false
			})
			.catch(()=>{
				this.$message.error("Failed to update product variation type", 4)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	},
}


export {bindProps, toggleActiveState, modify}