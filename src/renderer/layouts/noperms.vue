<template>
	<main class="uk-inline uk-width-1-1" :class="colorMode">
		<div class="uk-flex app uk-flex-wrap">
			<!-- <navs-main-sidebar class="uk-visible@m"></navs-main-sidebar> -->
			<div class="uk-width-expand content">
				<nuxt />
			</div>
		</div>
	</main>
</template>
<script>
export default{
	middleware : ['auth', 'unlicensed'],
	head(){
		return{
			title : `Access Denied | ${this.$appName}`
		}
	}
};
</script>
