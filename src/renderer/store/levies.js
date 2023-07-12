export const state = () =>	({
	product_levies : []
})

export const getters = {
	product_levies (state){
		return state.product_levies
	},
}

export const mutations = {
	SET_PRODUCT_LEVIES(state, payload){
		state.product_levies = payload
	}
}

export const actions = {
	async getProductLevies({commit}){
		await this.$axios.$get('/levies?active=true&applies_to=product')
		.then( async (res) => {
			await commit('SET_PRODUCT_LEVIES', res.data)
		})
		.catch((err)=>{
			return Promise.reject(err)	
		})
	},


}

