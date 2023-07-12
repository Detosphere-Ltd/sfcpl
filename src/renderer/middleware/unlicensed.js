export default function ({store, redirect}) {
	if (!store.getters['keychain/license']) {
		return redirect('/')
	}
}