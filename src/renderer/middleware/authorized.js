export default function ({$auth, redirect}) {
	if ( $auth.loggedIn && ($auth.user.is_branch_user)) {
		return redirect('/unauthorized')
	}
}