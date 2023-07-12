export const state = () =>	({
	periods : [],
})

export const getters = {
	periods (state){
		return state.periods
	}
}

export const mutations = {
	SET_FINANCIAL_PERIODS(state, payload){
		state.periods = payload
	}
}

export const actions = {
	async getData({commit}){
		await this.$axios.$get('/financial-periods')
		.then( async (res) => {
			await commit('SET_FINANCIAL_PERIODS', res.data)
		})
		.catch((err)=>{
			return Promise.reject(err)	
		})
	}
}

