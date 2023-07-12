export default function({$axios, $config, store}, inject) {
	const api = $axios.create({
		headers : {
			common : {
				Accept : 'text/plain, */*'
			}
		}
	})
	
	api.setBaseURL(`${$config.ROOT}`)

	api.onError(error => {
		if (error.response && error.response.status === 422) {
			store.dispatch('validation/setErrors', error.response.data.errors)
		}

		return Promise.reject(error);
	})
  // onRequest
	api.onRequest(config => {
		config.headers['Content-Type'] = 'application/json';
	})
	api.onRequest(() => {
		store.dispatch('validation/clearErrors')
	})
	
	inject('api', api)
}