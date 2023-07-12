export default {
	data(){
		return {
			links : [
			{ to : 'medicines', name : 'Meicines', iconPath : '~/assets/icons/medicine.svg' , sub_links: [
			{ to : 'medicines', name : 'Medicines', iconPath : '~/assets/icons/medicine.svg'},
			{ to : 'medicines-categories', name : 'Categories', iconPath : '~/assets/icons/category.svg'},
			{ to : 'medicines-categories', name : 'Categories', iconPath : '~/assets/icons/category.svg'},
			]},
			]
		}
	}
}