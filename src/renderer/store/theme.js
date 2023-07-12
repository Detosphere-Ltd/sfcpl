export const state = () =>	({
	theme : 'uk-dark'
})

export const getters = {
	theme(state){
		return state.theme
	}
}

export const mutations = {
	SET_THEME(state, payload){
		if (payload === 'uk-light' || payload === 'uk-dark') {
			state.theme = payload
			return
		}
		state.theme = payload
	}
}

export const actions = {
	setTheTheme({commit}, payload){
		commit('SET_THEME', payload)
	}
}

