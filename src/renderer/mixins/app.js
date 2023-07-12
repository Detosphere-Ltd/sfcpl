export default {
	data(){
		return {
			loaded : false
		}
	},
	async mounted(){
		if (!this.$store.getters['keychain/license']) {
			this.loaded = true
			return
		}
		await this.$store.dispatch('app/getAppData')
		.catch(()=>{
			// 
		})
		.finally(()=>{
			this.loaded = true
		})
	}
}