export const state = () =>	({
	suppliers : [],
	statistics : undefined
})

export const getters = {
	suppliers (state){
		return state.suppliers
	},

	activeSuppliers({}, getters){
		return getters.suppliers.filter((item)=>{ 
			return item.active === true
		})
	},

	statistics(state){
		return state.statistics
	}
}

export const mutations = {
	
	SET_SUPPLIERS_DATA(state, payload){
		state.suppliers = payload
	},

	SET_STATS_DATA(state, payload){
		state.statistics = payload
	},

}

export const actions = {
	async getSuppliers({commit}){
		await this.$axios.$get('/suppliers?include=created_by')
		.then( async (res) => {
			await commit('SET_SUPPLIERS_DATA', res.data)
		})
		.catch((err)=>{
			return Promise.reject(err)	
		})
	},

	async getSupplierStatistics({commit}){
		await this.$axios.$get('/suppliers/statistics')
		.then( async (res) => {
			await commit('SET_STATS_DATA', res.data)
		})
		.catch((err)=>{
			return Promise.reject(err)	
		})
	}
}

