export default {
	computed : {
		filteredRoles(){
			return this.roles.filter( role => {
				return role.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			})
		}
	}
}