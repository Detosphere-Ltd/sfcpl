export default {
	data(){
		return {
			failed : false,
			errData : undefined,
			loading : false,
			suppliers : []
		}
	},

	methods : {
		async getProductSuppliers(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			await this.$axios.$get(`/products/${this.product.uuid}/suppliers`)
			.then((res)=>{
				this.suppliers = res.data
			})
			.catch((err)=>{
				this.failed = true
				this.errData = err
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}