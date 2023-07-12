export const state = () =>	({
	transferData : undefined
})

export const getters = {
	transferInProgress(state){
		return state.transferData !== undefined
	},

	currentTransfer(state){
		return state.transferData
	}
}

export const mutations = {
	INITIALIZE_TRANSFER_DATA(state , payload){
		state.transferData = payload
	},

	ADD_VARIATION_TO_TRANSFER(state, payload){
		let exists = state.transferData.products.forEach( product => {
			
			return payload.some(item => {
				return product.variation === item.variation
			})
			
		})



		return 

		if (exists) {
			throw new Error({message : 'Variation exists'})
		}

		payload.forEach((productVariant)=>{
			state.transferData.products.push(productVariant)
		})
		
	}
}

export const actions = {
	initialize({commit}, payload){
		try{
			commit('INITIALIZE_TRANSFER_DATA', payload)
			return Promise.resolve()
		}
		catch(err){
			return Promise.reject(err)
		}
	},

	addVariation({commit}, payload){
		try {
			commit('ADD_VARIATION_TO_TRANSFER', payload)
			return Promise.resolve()
		}
		catch(err){
			return Promise.reject(err)
		}
	}
}

