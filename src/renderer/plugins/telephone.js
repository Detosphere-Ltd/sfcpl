import Vue from 'vue'
import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/dist/vue-tel-input.css';
Vue.use(VueTelInput,{

	mode: "international",
	disabledFetchingCountry: false,
	disabled: false,
	disabledFormatting: false,
	placeholder: "Phone Number",
	required: true,
	enabledCountryCode: false,
	enabledFlags: false,
	autocomplete: "off",
	name: "telephone",
	maxLen: 25,
	inputClasses: "",
	inputOptions: {
		showDialCode: true
	},
})