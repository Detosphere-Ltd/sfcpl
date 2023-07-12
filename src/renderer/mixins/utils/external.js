const shell = require("electron").shell

export default {
	methods : {
		openLink(link){
			shell.openExternal(link)
		}
	}
}