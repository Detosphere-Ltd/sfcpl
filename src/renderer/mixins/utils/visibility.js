const showHidePass = {
	data(){
		return {
			passwordFieldType : 'password',
		}
	}
}

const toggleVisibility = {
	data(){
		return {
			visible : false
		}
	},

	methods : {
		toggle(){
			this.visible = !this.visible
		}
	}
}

export { showHidePass , toggleVisibility}