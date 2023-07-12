<template>
	<div>
		<nuxt-child/>
	</div>
</template>
<script>
export default{
	head(){
		return{
			title : `${this.$appName} | ${this.emporium.name} - Staff`
		}
	},
};
</script>
