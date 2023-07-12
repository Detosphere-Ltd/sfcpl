import Vue from 'vue'
import Vue2Filters from 'vue2-filters'

Vue.filter('branchize', function(text){
	if (text.toLowerCase().includes('branch')) {
		return text
	}
	return `${text} Branch`
})


Vue.filter('variationize', function(text){
	if (text.toLowerCase().includes('variation')) {
		return text
	}
	return `${text} `
})

let Vue2FiltersConfig = {
	pluralize: {
		includeNumber: true
	},
	currency : {
		spaceBetweenAmountAndSymbol: true 
	}
}



Vue.use(Vue2Filters, Vue2FiltersConfig)