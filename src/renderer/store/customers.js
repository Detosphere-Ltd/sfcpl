export const state = () =>	({
	customers : [],
})

export const getters = {
	customers (state){
		return state.customers
	},

	activeCustomers({}, getters){
		return getters.customers.filter((item)=>{ 
			return item.active === true
		})
	}
}

export const mutations = {
	SET_CUSTOMERS_DATA(state, payload){
		state.customers = payload
	}
}

export const actions = {
	async getData({commit}){
		await this.$axios.$get('/customers?include=branch,created_by')
		.then( async (res) => {
			await commit('SET_CUSTOMERS_DATA', res.data)
		})
		.catch((err)=>{
			return Promise.reject(err)	
		})
	}
}

