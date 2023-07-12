export const state = () =>	({
	tags : [],
	transfer_tags : []
})

export const getters = {
	tags (state){
		return state.tags
	},

	transfer_tags (state){
		return state.transfer_tags
	},

}

export const mutations = {
	SET_TAGS_DATA(state, payload){
		state.tags = payload
	},
	SET_TRANSFER_TAGS_DATA(state, payload){
		state.transfer_tags = payload
	},
}

export const actions = {
	async getData({commit}){
		await this.$axios.$get('/tags')
		.then( async (res) => {
			await commit('SET_TAGS_DATA', res.data)
		})
		.catch((err)=>{
			return Promise.reject(err)
		})
	},

	async getTransferTags({commit}){
		await this.$axios.$get('/tags?type=transfers')
		.then( async (res) => {
			await commit('SET_TRANSFER_TAGS_DATA', res.data)
		})
		.catch((err)=>{
			return Promise.reject(err)
		})
	},
}

