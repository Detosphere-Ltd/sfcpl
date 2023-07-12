const searchBranch = {
	data(){
		return {
			branchSearchTerm : ""
		}
	},

	computed: {
		filteredBranches(){
			if (this.branchSearchTerm) {
				return this.branches.filter( branch => {
					return branch.name.toLowerCase().includes(this.branchSearchTerm.toLowerCase())
				})
			}
			return this.branches
			
		}
	}
}

export { searchBranch }