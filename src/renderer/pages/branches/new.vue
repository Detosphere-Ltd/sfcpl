<template>
	<div  class="uk-container uk-container-large uk-padding-remove-horizontal">
		<div class="uk-padding-small uk-padding-remove-top uk-border-rounded uk-width-1-1">

			<div class="uk-width-1-1 uk-flex  uk-flex-wrap uk-flex-middle uk-padding">
				<div class="uk-width-1-1 uk-width-2xlarge@m uk-margin-auto">
					<div class="uk-flex uk-flex-middle uk-padding-small uk-padding-remove-horizontal uk-width-auto">
						<a @click="$router.go(-1)" class="square-40 uk-border-circle background uk-margin-small-right uk-flex uk-flex-column uk-flex-center uk-flex-middle raised-deep bordered">
							<span class="mdi mdi-chevron-left lni-mid-large"></span>
						</a>
						<div class="uk-width-expand">
							<h5 class="uk-text-bold uk-margin-remove">
								New Branch
							</h5>
							<p class="uk-margin-remove">
								Set up  a new branch for {{$auth.user.store.name}}
							</p>
						</div>
					</div>

					<div class="background uk-padding rounded bordered">
						<branch-forms-add-new></branch-forms-add-new>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	async fetch(){
		await this.$store.dispatch('staff/getStaff')
	}

};
</script>
