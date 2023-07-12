export const state = () =>	({
	staff : []
})

export const getters = {
	staff (state){
		return state.staff
	},

	activeCorporateStaff ({} , getters){
		return getters.staff.filter((item)=>{return item.active && !item.is_branch_user})
	},

	otherStaff({}, getters, {}, rootGetters){
		return getters.staff.filter((item)=>{return item.uuid !== rootGetters.user.uuid && item.active})
	},

	otherCorporateStaff({}, getters, {}, rootGetters){
		return getters.staff.filter((item)=>{return item.uuid !== rootGetters.user.uuid && item.active && !item.is_branch_user})
	},

	unAssignedStaff({}, getters){
		return getters.otherStaff.filter((user)=>{ return !user.is_branch_user && user.active})
	}
}

export const mutations = {
	SET_STAFF_DATA(state, payload){
		state.staff = payload
	}
}

export const actions = {
	async getStaff({commit}){
		await this.$axios.$get('/users?include=branch,role,permissions,avatar')
		.then( async (res) => {
			await commit('SET_STAFF_DATA', res.data)
		})
		.catch((err)=>{
			return Promise.reject(err)
		})
	}
}

