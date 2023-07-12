<template>
	<div class="uk-width-1-1">

		<div class="uk-container uk-container-xsmall uk-margin-small-top uk-padding-remove-horizontal">
			<div class="background bordered uk-border-rounded">
				<div class="tiny-padding border-bottom sidebar rounded-top uk-padding-remove-bottom">
					<h4 class="uk-margin-remove-top">
						Manage Your Store Settings
					</h4>

					<nav uk-slider>
						<div class="uk-flex uk-slider-items">
							<div class="tab click rounded-top" :class="doing === 'GENERAL' ? 'tabActive' : ''" @click="doing = 'GENERAL'">
								<span class="uk-text-small tiny-margin-left tiny-margin-right" :class="doing === 'GENERAL' ? 'uk-text-white' : ''">
									General
								</span>
							</div>


							<div class="tab click rounded-top" :class="doing === 'LEVIES' ? 'tabActive' : ''" @click="doing = 'LEVIES'">
								<span class="uk-text-small tiny-margin-left tiny-margin-right" :class="doing === 'LEVIES' ? 'uk-text-white' : ''">
									Taxes & Levies 
								</span>
							</div>

						<!-- 	<div class="tab click rounded-top" :class="doing === 'SERVICE' ? 'tabActive' : ''" @click="doing = 'SERVICE'">
								<span class="uk-text-small tiny-margin-left tiny-margin-right" :class="doing === 'SERVICE' ? 'uk-text-white' : ''">
									Quality Control
								</span>
							</div> -->
							<div class="tab click rounded-top" :class="doing === 'SALES' ? 'tabActive' : ''" @click="doing = 'SALES'">
								<span class="uk-text-small tiny-margin-left tiny-margin-right" :class="doing === 'SALES' ? 'uk-text-white' : ''">
									Sales & Reporting
								</span>
							</div>
						</div>


					</nav>

				</div>

				<div class="uk-overflow-auto" style="max-height: 75vh">
					<div class="uk-width-1-1 stripped-bottom" v-if="doing === 'GENERAL'">
						<div class="uk-width-1-1">
							<customize-logo></customize-logo>
						</div>
						<div class="uk-width-1-1">
							<customize-basic-info></customize-basic-info>
						</div>
					</div>


					<div class="uk-width-1-1" v-else-if="doing === 'LEVIES'">
						<levy-loader :url="`levies?include=created_by`"></levy-loader>
					</div>


					<div class="uk-width-1-1 uk-padding-small" v-else>
						<customize-currency></customize-currency>
					</div>

					<!-- <div class="uk-width-1-1 uk-padding-small" v-else>
						<customize-expiry-settings></customize-expiry-settings>
					</div> -->
				</div>
			</div>
		</div>
	</div>
</template>
<script>

export default{
	head(){
		return {
			title : 'Store Settings'
		}
	},

	data(){
		return {
			doing : 'GENERAL'
		}
	}
};
</script>
