export const state = () =>	({
	application : []
})

export const getters = {
	application (state){
		return state.application
	}
}

export const mutations = {
	SET_APP_DATA(state, payload){
		state.application = payload
	}
}

export const actions = {
	async getAppData({commit}){
		await this.$axios.$get('?include=logo')
		.then( res => {
			commit('SET_APP_DATA', res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
	}
}

