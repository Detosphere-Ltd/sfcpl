export const state = () =>	({

})

export const getters = {
	authenticated (state){
		return state.auth.loggedIn
	},

	user (state){
		return state.auth.user
	},
	paymentModes(){
		return [{text : 'Cash', value : 'cash'}, {text : 'Mobile Money', value : 'momo'}, {text : 'Bank', value : 'bank'}, {text : 'Card', value : 'card'} ]
	}
}

export const actions = {
	async nuxtServerInit({dispatch}){
		await dispatch('app/getAppData')
	},
	async refreshUser(){
		await this.$axios.$get('/profile?include=branch,role,avatar,created_by,permissions,logo').
		then(async refreshedUser => {
			this.$auth.setUser(refreshedUser.data)
		})
		.catch(()=>{
			
		})
	},

	
}

