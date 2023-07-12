export const state = () =>	({
	license : ''
})

export const getters = {
	license(state){
		return state.license
	}
}

export const mutations = {

	SET_LICENSE(state, payload){
		state.license = payload
	}

}

export const actions = {
	setLicense({commit}, payload){
		commit('SET_LICENSE', payload)
	}
}


