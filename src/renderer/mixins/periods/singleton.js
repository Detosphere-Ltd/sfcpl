const bindProps = {

	data(){
		return {
			loading : false,
			detailsModal : false,
			loadModal : false,
			errData : undefined,
			failed : false,
			period : {}
		}
	},

	computed : {
		statuses(){
			return {
				processing : 'uk-background-primary uk-text-white',
				cancelled : 'uk-background-danger uk-text-white',
				pending : 'background bordered',
				completed : 'uk-background-success uk-text-white'
			}
		}
	},
	props : {
		year : {
			type : Object,
			required : true
		}
	},

	methods : {
		async getFinancialYearDetails(){
			this.loading = true 
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/financial-years/${this.year.uuid}`)
			.then( res =>{
				this.period = res.data
				this.$emit('loaded')
			})
			.catch(err =>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}

const close = {
	data(){
		return {
			loading : false,
			consent : false,
			showModal : false,
		}
	},

	methods : {
		async closePeriod(){
			this.loading = true
			await this.$axios.$post(`/financial-years`)
			.then( () => {
				this.$message.success('The operational period has been scheduled to close.', 5)
			})
			.catch(err => {
				this.$message.error(`${err.response && err.response.data.message !== undefined ? err.response.data.message : 'Operation failed.'}`, 10)
			})
			.finally(()=>{
				this.loading = false
				this.showModal = false
				this.$emit('done')
			})
		}
	}
}

const cancel = {
	data(){
		return {
			loading : false,
			consent : false,
			showModal : false,
		}
	},

	methods : {
		async cancelClosure(){
			this.loading = true
			await this.$axios.$delete(`/financial-years/${this.year.uuid}`)
			.then( () => {
				this.$message.success('The scheduled closure has been cancelled', 5)
			})
			.catch(err => {
				this.$message.error(`${err.response && err.response.data.message !== undefined ? err.response.data.message : 'Operation failed.'}`, 10)
			})
			.finally(()=>{
				this.loading = false
				this.showModal = false
				this.$emit('done')
			})
		}
	}
}

export { bindProps, close , cancel }