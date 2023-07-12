const base = {
	data(){
		return {
			loading : false,
			state : 'FILLING'
		}
	}
}

const create  =  {
	data(){
		return {
			form : {
				name : "",
				manager_id : "",
				city : '',
				country : '',
			},
		}
	},

	methods : {
		async setupBranch(){
			this.loading = true
			this.state = 'FILLING'
			await this.$axios.$post('/branches', this.form)
			.then( async res => {
				await this.$store.dispatch('staff/getStaff')
				this.form = {
					manager_id : "",
					city : '',
					country : '',
				}
				this.state = 'SUCCESS'
				this.$emit('created')
			})
			.catch((err)=>{
				this.state = 'FAILED'
			})
			.finally(()=>{
				this.loading = false

			})
		},

		initNew(){
			this.loading = false
			this.state = "FILLING"
			this.form = {
				name : "",
				manager_id : "",
				city : '',
				country : '',
			}
		}
	},


	computed : {
		selectedManager (){
			return this.staff.filter((sm)=>{return sm.uuid === this.form.manager_id})
		}
	}
}

const bindProps = {
	props : {
		branch : {
			required : true,
			type : Object
		}
	}
}


export { base , create , bindProps}