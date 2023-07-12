export default function ({$auth, redirect}) {
	if ( $auth.loggedIn && $auth.user.change_password) {
		return redirect('/setup')
	}
}