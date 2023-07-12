export default function ({$auth, redirect}) {
	if ( $auth.loggedIn && ($auth.user.permissions === undefined || $auth.user.permissions.length < 1)) {
		return redirect('/noperms')
	}
}