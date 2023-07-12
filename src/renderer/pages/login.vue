<template>
	<div class="uk-height-viewport uk-flex uk-background-white uk-light">
		<div class="uk-width-expand uk-flex">
			<div class="uk-width-1-1 uk-height-1-1  uk-flex uk-flex-column uk-flex-around uk-inline auth-bg">

				<div class="uk-position-cover scrim uk-flex uk-flex-column uk-flex-around uk-padding uk-inline uk-width-1-1">
					<div class="uk-position-top-center uk-padding-large uk-padding-remove-horizontal uk-width-large">
						<partials-pr class="uk-text-white uk-margin-bottom"></partials-pr>


						<div class="uk-width-large raised-deep uk-border-rounded uk-padding uk-background-white">
							<partials-app-logo></partials-app-logo>
							<auth-login-form ></auth-login-form>
						</div>
					</div>
				</div>
				
			</div>
		</div>
	</div>
</template>
<script>
export default{
	head(){
		return {
			title : `${this.$appName} | Control Panel Login`
		}
	},

	layout : 'start',
};
</script>
