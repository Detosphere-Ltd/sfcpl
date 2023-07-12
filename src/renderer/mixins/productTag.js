const bindProps = {
	props: {
		tag : {
			type : Object,
			required : true
		}
	}
}

const modify = {
	data(){
		return {
			loading : false,
			tagForm: {
				name : this.tag.name,
			}
		}
	},
	methods : {
		async update(){
			this.loading = true
			await this.$axios.$patch(`/tags/${this.tag.slug}`, this.tagForm)
			.then(()=>{
				this.$emit('updated')
				this.$message.success("Product tag updated", 4)
				this.showModal = false
			})
			.catch(()=>{
				this.$message.error("Failed to update product tag", 4)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	},
}

const purge = {
	data(){
		return {
			loading : false			
		}
	},
	methods : {
		async deleteTag(){
			this.loading = true
			await this.$axios.$delete(`/tags/${this.tag.slug}`)
			.then(()=>{
				this.$emit('purged')
				this.$message.success("Product tag deleted", 4)
				this.showModal = false
			})
			.catch(()=>{
				this.$message.error("Failed to delete product tag", 4)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	},
}

export {bindProps, modify, purge}