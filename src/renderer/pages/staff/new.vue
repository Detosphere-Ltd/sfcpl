<template>
	<div class="uk-padding-small uk-padding-remove-top uk-border-rounded uk-width-1-1 table uk-margin-auto">

		<div class="uk-width-1-1 uk-flex  uk-flex-wrap uk-flex-middle uk-padding">
			<div class="uk-width-1-1 uk-width-2xlarge@m uk-margin-auto">
				<div class="uk-flex uk-flex-middle uk-padding-small uk-padding-remove-horizontal uk-width-auto">
					<nuxt-link :to="{name: 'staff'}" class="square-40 uk-border-circle background bordered uk-margin-small-right uk-flex uk-flex-column uk-flex-center uk-flex-middle">
						<span class="mdi mdi-chevron-left  lni-mid-large"></span>
					</nuxt-link>
					<div class="uk-width-expand uk-light">
						<h4 class="uk-text-bold uk-margin-remove">
							Add New Staff
						</h4>
						<p class="uk-margin-remove">
							Add New Staff
						</p>
					</div>

					<import-excel :resource="{name: 'Users', path : 'users'}"></import-excel>
				</div>

				<div class="background uk-padding rounded bordered">
					<staff-forms-new-staff></staff-forms-new-staff>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	async fetch(){
		await this.$store.dispatch('branches/getBranches')
		await this.$store.dispatch('access/getRoles')
	},

};
</script>

