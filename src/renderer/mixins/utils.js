const showHidePass = {
	data(){
		return {
			passwordFieldType : 'password',
		}
	}
}

const greetings = {
	computed : {
		greetings(){
			let currentHour = this.$moment().format("HH")

			if (currentHour >= 3 && currentHour < 12){
				return `Good Morning, ${this.$auth.user.name}`
			} else if (currentHour >= 12 && currentHour < 15){
				return `Good Afternoon, ${this.$auth.user.name}`
			}   else if (currentHour >= 15 && currentHour < 20){
				return `Good Evening, ${this.$auth.user.name}`
			} 
			else{
				return  `Hello, ${this.$auth.user.name}`
			}
		}
	}
}

export { showHidePass, greetings }