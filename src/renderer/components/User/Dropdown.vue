<template>
	<div>
		<div class="uk-flex uk-flex-middle uk-width-auto click bordered grid-padding uk-border-rounded" style="max-width:300px">
			<partials-avatar :media="$auth.user.avatar" :size="40"></partials-avatar>
			<div class="uk-flex uk-flex-column uk-margin-small-left uk-text-truncate uk-width-expand">
				<h6 class="uk-margin-remove">
					{{$auth.user.name}}
				</h6>
				<span class="uk-text-small">
					{{$auth.user.role.name}}
				</span>
			</div>

			<span class="mdi mdi-chevron-down lni-large uk-margin-small-left"></span>
		</div>

		<div uk-drop="mode: click; pos: bottom-center; offset: 0; delay-hide:0" ref="optionsDrop" class="uk-width-auto uk-border-rounded bordered background">
			<div class="uk-flex uk-flex-column" style="max-width:300px">
				<nuxt-link :to="{name: 'profile'}" class="tiny-padding border-bottom">
					<span>Manage My Profile</span>
				</nuxt-link>
				<nuxt-link :to="{name: 'logout'}" class="tiny-padding">
					<span class="uk-text-danger uk-text-bold">
						Sign Out
					</span>
				</nuxt-link>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	watch : {
		'$route'(){
			this.$uikit.drop(this.$refs.optionsDrop).hide()
		}
	}
};
</script>
