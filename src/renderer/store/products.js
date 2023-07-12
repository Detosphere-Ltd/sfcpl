export const state = () =>	({
	products : {},
})

export const getters = {
	products (state){
		return state.products
	}
}

export const mutations = {
	SET_PRODUCTS_DATA(state, payload){
		state.products = payload
	}
}

export const actions = {
	async loadProducts({commit}){
		await this.$axios.$get('/products?include=tags,variations,variations.variation,variations.created_by,created_by,media,available_branches')
		.then( async (res) => {
			await commit('SET_PRODUCTS_DATA', res.data)
		})
		.catch((err)=>{
			return Promise.reject(err)	
		})
	}
}

