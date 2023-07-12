export default function ({$axios, store}) {
  $axios.onError(error => {
    if (error.response && error.response.status === 422) {
      store.dispatch('validation/setErrors', error.response.data.errors)
    }

    return Promise.reject(error);
  })
  // onRequest
  $axios.onRequest(config => {
    config.headers['Content-Type'] = 'application/json';
    if (store.getters['keychain/license']) {
      config.headers['License-Key'] = store.getters['keychain/license']
    }
  })
  $axios.onRequest(() => {
    store.dispatch('validation/clearErrors')
  })
}
