const cancel= {
	methods : {
		async cancelTransfer(){
			this.processing = true
			this.$message.destroy()
			await this.$axios.$patch(`/transfers/${this.transfer.uuid}`, {status : 'cancelled', comments : this.comments ? this.comments : ''})
			.then(()=>{
				this.$message.success("Transfer cancelled successfully.")
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to cancel transfer. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.processing = false
			})
		}
	}
}


const confirm= {
	methods : {
		async confirmTransfer(){
			this.processing = true
			this.$message.destroy()
			await this.$axios.$patch(`/transfers/${this.transfer.uuid}`, {status : 'confirmed', comments : this.comments ? this.comments : ''})
			.then(()=>{
				this.$message.success("Transfer successfully confirmed.")
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to cancel transfer. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.processing = false
			})
		}
	}
}



const dispatch = {
	methods : {
		async dispatchTransfer(){
			this.processing = true
			this.$message.destroy()
			await this.transferData.products.forEach(item => {
				item.items = item.purchases
			})
			await this.$axios.$patch(`/transfers/${this.transfer.uuid}`, {status : 'dispatched', ...this.transferData})
			.then(()=>{
				this.$message.success("Transfer dispatched.")
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Dispatching transfer failed. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.processing = false
			})
		},

		async dispatchAuto(){
			this.processing = true
			
			await this.$axios.$patch(`/transfers/${this.transfer.uuid}`, {status : 'dispatched', ...this.transferData})
			.then(()=>{
				this.$message.success("Transfer dispatched.")
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to dispatch transfer. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.processing = false
			})
		}

	}
}

const raise_issue = {
	methods : {
		async raiseTransferIssue(){
			this.processing = true
			this.$message.destroy()
			await this.$axios.$patch(`/transfers/${this.transfer.uuid}`, {status : 'raised_issue', comments : this.comments ? this.comments : ''})
			.then(()=>{
				this.$message.success("An issue has been raised for the transfer.")
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to raise an issue on the transfer. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.processing = false
			})
		}
	}
}


const resolve = {
	methods : {
		async autoResolve(){
			this.processing = true
			this.$message.destroy()
			await this.$axios.$patch(`/transfers/${this.transfer.uuid}`, {status : 'resolved', ...this.transferData})
			.then(()=>{
				this.$message.success("Transfer issue resolved.")
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to resolve transfer issue. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.processing = false
			})
		},

		async manualResolve(){
			this.processing = true
			this.$message.destroy()
			await this.transferData.products.forEach(item => {
				item.items = item.purchases
			})
			
			await this.$axios.$patch(`/transfers/${this.transfer.uuid}`, {status : 'resolved', ...this.transferData})
			.then(()=>{
				this.$message.success("Transfer issue resolved.")
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to resolve transfer issue. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.processing = false
			})
		}


	}
}

export { dispatch, cancel, confirm, raise_issue, resolve}