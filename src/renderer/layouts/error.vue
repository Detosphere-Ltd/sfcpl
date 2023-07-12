<template>
	
	<div :class="colorMode">
		<div class="uk-width-1-1 uk-height-viewport background uk-flex uk-flex-column uk-flex-middle uk-flex-center">
			<div class="uk-padding uk-width-large@s uk-width-2xlarge@m uk-flex uk-flex-column uk-flex-center uk-flex-middle">
				<img src="/logo.svg" width="150" class="uk-margin-medium-bottom">
				<div>

					<h4 class="uk-text-center">
						We're sorry that happpened. 
					</h4>
					<p class="uk-text-center">
						Our technical team has been notified and will look into it.
					</p>
				</div>
				<div>
					<nuxt-link :to="{name: 'home'}" class="uk-button uk-button-primary uk-border-rounded">
						Go to Dashboard
					</nuxt-link>

					<a href="" class="uk-button uk-button-view uk-border-rounded">
						Reload {{$appName}}
					</a>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	layout : 'plain'
};
</script>
