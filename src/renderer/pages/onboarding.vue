<template>
	<div class="uk-padding">
		<div class="uk-width-2xlarge uk-margin-auto" v-if="!emporium.setup_completed">
			<onboarding-wizard v-if="can('setup-store')"></onboarding-wizard>
			<template v-else>
				<div class="uk-padding bordered uk-border-rounded">
					<h3>
						Sorry.
					</h3>
					<p class="uk-margin-remove">
						It appears you do not have the permissions to setup {{emporium.name}} on {{$appName}}.
					</p>

					<div class="border-bottom uk-margin-small-bottom uk-margin-small-top"></div>

					<nuxt-link :to="{name: 'home'}" class="uk-button uk-button-primary">
						Back To Dashboard
					</nuxt-link>
				</div>
			</template>
		</div>
		<template v-else>
			<div class="uk-padding uk-width-xlarge uk-flex uk-flex-column uk-flex-middle uk-margin-auto">
				<h3>
					Awesome!
				</h3>
				<p class="uk-margin-remove">
					{{emporium.name}} is all setup and ready to go on {{$appName}}.
				</p>

				<div class="border-bottom uk-margin-small-bottom uk-margin-small-top"></div>

				<nuxt-link :to="{name: 'home'}" class="uk-button uk-button-primary">
					Back To Dashboard
				</nuxt-link>
			</div>
		</template>
	</div>
</template>
<script>
export default {
	
}
</script>
