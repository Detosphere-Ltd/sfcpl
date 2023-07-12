const searchStaff = {
	data(){
		return {
			searchTerm : ''
		}
	},

	computed: {
		filteredStaff(){
			return this.staff.filter( member => {
				return member.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			})
		},


		hasCreatedOtherUsers(){
			return this.staff.some(member => {return member.uuid !== this.$auth.user.uuid})
		}
	}
}

export { searchStaff }