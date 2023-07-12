export const state = () =>	({
	roles : [],
	permissions : []
})

export const getters = {
	roles (state){
		return state.roles.filter(item => {return item.editable})
	},

	permissions (state){
		return state.permissions
	},

	branchRoles({}, getters){
		return getters.roles.filter((item)=>{return item.level !== 'corporate'})
	},

	corporateRoles({}, getters){
		return getters.roles.filter((item)=>{return item.level !== 'branch'})
	},

	// unAssignedStaff({}, getters){
	// 	return getters.otherStaff.filter((user)=>{ return !user.is_branch_user})
	// }
}

export const mutations = {
	SET_ROLES_DATA(state, payload){
		state.roles = payload
	},
	SET_PERMISSIONS_DATA(state, payload){
		state.permissions = payload
	}
}

export const actions = {
	async getRoles({commit}){
		await this.$axios.$get('/roles?include=created_by,permissions')
		.then( async (res) => {
			await commit('SET_ROLES_DATA', res.data)
		})
		.catch((err)=>{
			return Promise.reject(err)	
		})
	},

	async getPermissions({commit}){
		await this.$axios.$get('/permissions')
		.then( async (res) => {
			await commit('SET_PERMISSIONS_DATA', res.data)
		})
		.catch((err)=>{
			return Promise.reject(err)	
		})
	}
}

