<template>
	<div>
		<nuxt-child/>
	</div>
</template>
<script>
export default{
	async fetch(){
		let tags = 	await this.$store.dispatch('tags/getData')
		let variations  = 	await this.$store.dispatch('variations/getData')
		let suppliers  = 	await this.$store.dispatch('suppliers/getSuppliers')
		let branches  = 	await this.$store.dispatch('branches/getBranches')
		let transfer_tags  = 	await this.$store.dispatch('tags/getTransferTags')
		let units  = 	await this.$store.dispatch('units/getData')
		let levies  = 	await this.$store.dispatch('levies/getProductLevies')
		await Promise.all([tags , variations, suppliers, branches, transfer_tags,units, levies])
		.catch( err =>{

		})
	},
	head(){
		return{
			title : `${this.$appName} | ${this.emporium.name} - Inventory`
		}
	}
};
</script>
