export default {
	methods : {
		setupEditor(formName, model){
			Object.assign(this[formName] , ...Object.keys(this[formName]).map(k => k in model && { [k]: model[k] }))
		}
	}
}