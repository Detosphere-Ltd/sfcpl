const parent = {
	data(){
		return {
			selectAll : undefined,
			selectedItems : []
		}
	},

	computed : {
		selectionArray(){
			return this.selectedItems.map(item => {return item.uuid})
		}
	},

	methods : {
		removeFromSelection(payload){
			this.selectedItems = this.selectedItems.filter(item => {return item.uuid !== payload.uuid})
		},

		addToSelection(payload){
			this.selectedItems.push(payload)
		}
	},

	watch : {
		selectAll(newVal, oldVal){
			if (!this.selectAll) {
				this.selectedItems = []
			}
		}
	}
}

const child = {
	data(){
		return {
			select : undefined
		}
	},
	props : {
		allSelected : {
			type : Boolean,
			default : false
		}
	},

	computed : {
		isSelected(){
			return this.select
		}
	},

	watch : {
		allSelected(newVal , oldVal){
			this.select = newVal
		},

		async isSelected(newVal, oldVal){
			if (!newVal) {
				await this.$emit('remove', this.product)
				return
			}
			await this.$emit('select', this.product)

		}
	}
}

export {parent , child}