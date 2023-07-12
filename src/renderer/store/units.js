export const state = () =>	({
	units : [],
})

export const getters = {
	units (state){
		return state.units
	},

	activeUnits(state){
		return state.units.filter((item)=>{return item.active})
	}
}

export const mutations = {
	SET_UNITS_DATA(state, payload){
		state.units = payload
	},
}

export const actions = {
	async getData({commit}){
		await this.$axios.$get('/unit-types?include=created_by')
		.then( async (res) => {
			await commit('SET_UNITS_DATA', res.data)
		})
		.catch((err)=>{
			return Promise.reject(err)
		})
	}
}

