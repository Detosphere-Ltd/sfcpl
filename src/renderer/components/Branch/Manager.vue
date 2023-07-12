<template>
	<div class="tiny-padding">
		<div class="uk-flex uk-flex-column" v-if="manager && manager.name !== undefined">
			<span class="uk-text-small">
				This Branch is managed by 
			</span>

			<div class="uk-flex uk-flex-middle uk-margin-small-top">
				<div class="square-30 tiny-margin-right tiny-margin-left uk-background-secondary uk-border-circle uk-background-cover" :style="`background-image: url(${manager.avatar.large})`" v-if="manager.avatar && manager.avatar.large !== undefined">
				</div>

				<div class="square-30 tiny-margin-right tiny-margin-left uk-background-primary raised uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle" v-else>
					<h6 class="uk-margin-remove uk-text-bold uk-text-uppercase uk-text-white">
						{{manager.name.substring(0,2)}}
					</h6>
				</div>

				<h5 class="uk-margin-remove uk-text-bold uk-text-small">
					{{manager.name}}
				</h5>
			</div>
		</div>

		<div v-else>
			<span class="uk-text-small">
				No Manager heas been assigned to this branch.
			</span>
		</div>
	</div>
</template>
<script>
export default{
	props: {
		manager : {
			required : true,
		}
	}
};
</script>
