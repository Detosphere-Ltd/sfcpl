export const state = () =>	({
	variations : []
})

export const getters = {
	variations (state){
		return state.variations
	},

	activeVariations(state){
		return state.variations.filter(variation => {return variation.active})
	}
}

export const mutations = {
	SET_VARIATIONS_DATA(state, payload){
		state.variations = payload
	}
}

export const actions = {
	async getData({commit}){
		await this.$axios.$get('/variations?include=created_by')
		.then( async (res) => {
			await commit('SET_VARIATIONS_DATA', res.data)
		})
		.catch((err)=>{
			return Promise.reject(err)
		})
	}
}

