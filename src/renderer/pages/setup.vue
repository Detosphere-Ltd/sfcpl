<template>
	<div class="uk-height-viewport uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-padding-small background">
		
		<div class="uk-width-1-1 uk-width-large@s background uk-padding bordered uk-border-rounded">
			<nuxt-link :to="{name: 'home'}">
				<partials-app-logo></partials-app-logo>
			</nuxt-link>
			<auth-password-setup-form></auth-password-setup-form>
		</div>
	</div>
</template>
<script>
export default{
	layout : 'setup',

	mounted () {
		if (this.$auth.loggedIn && !this.$auth.user.change_password){
			this.$router.push({name: 'home'})
		}
	}
};
</script>
