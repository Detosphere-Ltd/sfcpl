export const state = () =>	({
	branches : []
})

export const getters = {
	branches (state){
		return state.branches
	},
	activeBranches({}, getters){
		return getters.branches.filter((item)=>{ 
			return item.active === true
		})
	}
}

export const mutations = {
	SET_BRANCHES_DATA(state, payload){
		state.branches = payload
	}
}

export const actions = {
	async getBranches({commit}){
		await this.$axios.$get('/branches?include=manager')
		.then( async (res) => {
			await commit('SET_BRANCHES_DATA', res.data)
			// 
		})
		.catch(()=>{
			// Log
		})
	}
}

