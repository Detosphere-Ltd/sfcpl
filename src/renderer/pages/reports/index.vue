<template>
	<div>
		<section class="uk-section uk-section-small uk-padding-remove-bottom">
			<div class="uk-container uk-container-xlarge">
				<div class="uk-width-1-1">
					<div class="uk-width-1-1 uk-flex uk-flex-between uk-flex-bottom">

						<div class="uk-width-xlarge uk-margin-auto uk-flex uk-flex-column uk-flex-middle">


							<p class="uk-text-center uk-margin-small-bottom">
								{{$moment().format('dddd, MMMM DD')}}
							</p>
							<div class="uk-width-1-1  tiny-padding background raised bordered pill uk-text-truncate" v-if="can('view-store-statistics')">
								<stats-generic-summary></stats-generic-summary>
							</div>
						</div>

					</div>
				</div>
			</div>
		</section>
		<!-- -->
		<section class="uk-section uk-section-small uk-padding-remove-bottom" v-if="!emporium.setup_completed && can('setup-store')" >
			<div class="uk-container uk-container-xlarge">
				<div class="expresso uk-padding-small uk-border-rounded uk-flex uk-flex-middle uk-flex-wrap uk-text-white">
					<p class="uk-margin-remove uk-width-expand ">
						Welcome to {{$appName}}. Follow our Setup Guide to get your store up and running in no time
					</p>

					<nuxt-link :to="{name : 'onboarding'}" class="chip uk-border-rounded uk-margin-left" style="border: 1px solid #fff;">
						<span class="text-small uk-text-white">
							Set Up Store
						</span>
					</nuxt-link>
				</div>
			</div>
		</section>

		<section class="uk-section uk-section-small">
			<div class="uk-container uk-container-xlarge">

				<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-grid-collapse" uk-grid="masonry: true"> 

					<div class="grid-gutter uk-padding-remove-top uk-width-1-2@m uk-flex uk-flex-wrap">


						<template v-if="can('view-store-statistics')">

							<div class="uk-width-1-2 grid-gutter uk-padding-remove-left">
								<div class="uk-width-1-1 uk-margin-small-bottom">
									<lazy-stats-sales-payments  class="bordered">
									</lazy-stats-sales-payments>
								</div>

								<div class="uk-width-1-1">
									<lazy-stats-store-transfers class="bordered">
									</lazy-stats-store-transfers>
								</div>
							</div>
							<div class="uk-width-1-2 grid-gutter uk-padding-remove-left">
								<div class="uk-width-1-1 uk-margin-small-bottom">
									<lazy-stats-store-last-thirty class="bordered">
									</lazy-stats-store-last-thirty>
								</div>
								<div class="uk-width-1-1">
									<lazy-stats-store-transfer-requests class="bordered">
									</lazy-stats-store-transfer-requests>
								</div>
							</div>

						</template>

					</div>

					<div class="grid-gutter uk-padding-remove-top uk-width-1-2@m" v-if="can('view-sales-statistics')">

						<div class="uk-width-1-1 uk-margin-small-bottom">
							<stats-generic-overview class="bordered">
							</stats-generic-overview>
						</div>
						<stats-sales-items  class="bordered uk-width-1-1"></stats-sales-items>
					</div>
				</div>

			</div>
		</section>

	</div>
</template>
<script>
export default{
	head(){
		return {
			title : `${this.$appName} | ${this.emporium.name} - Reports Dashboard`
		}
	},
};
</script>

