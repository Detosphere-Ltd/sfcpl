<template>
	<div class="uk-border-rounded background uk-padding-small">
		

		<div class="uk-flex uk-flex-middle uk-flex-between" :class="visible ? 'border-bottom uk-margin-small-bottom tiny-padding uk-padding-remove-horizontal uk-padding-remove-top' : ''">
			<h4 class="uk-margin-remove">
				Your Store at A Glance
			</h4>

			<div class="chip uk-border-rounded click" @click="toggle" :class="visible ? 'uk-background-danger-op' : 'uk-background-success-op'">
				<span class="text-small">
					{{ visible ? 'Hide' : 'Show' }} Statistics
				</span>
			</div>
		</div>
		

		<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle tiny-padding"  v-if="loading">
			<loaders-spinner></loaders-spinner>
			<p class="uk-margin-top">
				Loading stats...
			</p>
		</div>
		<template v-else>
			<template v-if="failed">
				<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle uk-padding">
					<span class="mdi mdi-alert-box uk-text-danger uk-margin-small-bottom lni-extra-large"></span>
					<span class="chip bordered uk-border-rounded click uk-text-small" @click="getStats()">
						<span class="tiny-margin-right tiny-margin-left">
							Failed to load stock stats. Click to retry
						</span>
					</span>
				</div>
			</template>
			<div class="uk-width-1-1 " v-else>
				<div class="uk-flex uk-flex-wrap uk-child-width-1-2 uk-width-1-1" v-if="visible">
					<div class="uk-width-expand">
						<h5 class="uk-margin-remove uk-text-bold">Purchases</h5>
						<div class="tiny-padding uk-padding-remove-horizontal uk-padding-remove-bottom stat-list uk-flex uk-flex-column">
							<div class="uk-flex uk-flex-middle stat-item tiny-padding uk-padding-remove-horizontal uk-padding-remove-bottom">
								<div class="square-40 uk-margin-small-right uk-border-rounded uk-background-primary-op uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-receipt lni-large"></span>
								</div>

								<div class="uk-width-expand">
									<h5 class="uk-margin-remove uk-text-bold">
										{{stats['Total Amount of Purchases Made'] | currency(`${emporium.currency} `)}}  
									</h5>
									<span class="text-small">
										Total Amount of Purchases Made
									</span>
								</div>
							</div>

							<div class="uk-flex uk-flex-middle stat-item tiny-padding uk-padding-remove-horizontal uk-padding-remove-bottom">
								<div class="square-40 uk-margin-small-right uk-border-rounded uk-background-success-op uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-tag-plus lni-large"></span>
								</div>
								<div class="uk-width-expand">
									<h5 class="uk-margin-remove uk-text-bold">
										{{stats['Total Amount Paid for Purchases'] | currency(`${emporium.currency} `)}}  
									</h5>
									<span class="text-small">
										Total Amount Paid for Purchases
									</span>
								</div>
							</div>


							<div class="uk-flex uk-flex-middle stat-item tiny-padding uk-padding-remove-horizontal uk-padding-remove-bottom">
								<div class="square-40 uk-margin-small-right uk-border-rounded uk-background-danger-op uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-tag-minus lni-large uk-text-danger"></span>
								</div>
								<div class="uk-width-expand">
									<h5 class="uk-margin-remove uk-text-bold">
										{{stats['Total Amount of Unpaid Purchases'] | currency(`${emporium.currency} `)}}  
									</h5>
									<span class="text-small">
										Total Outstanding For Purchases
									</span>
								</div>
							</div>


							<div class="uk-flex uk-flex-middle stat-item tiny-padding uk-padding-remove-horizontal uk-padding-remove-bottom">
								<div class="square-40 uk-margin-small-right uk-border-rounded uk-background-pinkey-op uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-hand-heart lni-large uk-text-pinkey"></span>
								</div>
								<div class="uk-width-expand">
									<h5 class="uk-margin-remove uk-text-bold">
										{{stats['Total Amount Received as Discount on Purchases'] | currency(`${emporium.currency} `)}}  
									</h5>
									<span class="text-small">
										Discount Received On Purchases
									</span>
								</div>
							</div>
						</div>
					</div>


					<div class="border-right uk-width-auto uk-margin-small-right uk-margin-small-left"></div>


					<div class="uk-width-expand">
						<h5 class="uk-margin-remove uk-text-bold">Sales</h5>
						<div class="tiny-padding uk-padding-remove-horizontal uk-padding-remove-bottom stat-list uk-flex uk-flex-column">
							<div class="uk-flex uk-flex-middle stat-item tiny-padding uk-padding-remove-horizontal uk-padding-remove-bottom">
								<div class="square-40 uk-margin-small-right uk-border-rounded uk-background-primary-op uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-sale lni-large"></span>
								</div>

								<div class="uk-width-expand">
									<h5 class="uk-margin-remove uk-text-bold">
										{{stats['Total Amount Expected From Sales'] | currency(`${emporium.currency} `)}}  
									</h5>
									<span class="text-small">
										Amount Expected From Sales
									</span>
								</div>
							</div>

							<div class="uk-flex uk-flex-middle stat-item tiny-padding uk-padding-remove-horizontal uk-padding-remove-bottom">
								<div class="square-40 uk-margin-small-right uk-border-rounded uk-background-success-op uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-hand-coin lni-large"></span>
								</div>
								<div class="uk-width-expand">
									<h5 class="uk-margin-remove uk-text-bold">
										{{stats['Total Amount Received From Sales'] | currency(`${emporium.currency} `)}}  
									</h5>
									<span class="text-small">
										Amount Received From Sales
									</span>
								</div>
							</div>


							<div class="uk-flex uk-flex-middle stat-item tiny-padding uk-padding-remove-horizontal uk-padding-remove-bottom">
								<div class="square-40 uk-margin-small-right uk-border-rounded uk-background-danger-op uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-alert-decagram lni-large uk-text-danger"></span>
								</div>
								<div class="uk-width-expand">
									<h5 class="uk-margin-remove uk-text-bold">
										{{stats['Total Amount Outstanding on Sales'] | currency(`${emporium.currency} `)}}  
									</h5>
									<span class="text-small">
										Amount Outstanding From Sales
									</span>
								</div>
							</div>


							<div class="uk-flex uk-flex-middle stat-item tiny-padding uk-padding-remove-horizontal uk-padding-remove-bottom">
								<div class="square-40 uk-margin-small-right uk-border-rounded uk-background-warning-op uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-gift lni-large"></span>
								</div>
								<div class="uk-width-expand">
									<h5 class="uk-margin-remove uk-text-bold">
										{{stats['Total Amount Given out as Discount on Sales'] | currency(`${emporium.currency} `)}}  
									</h5>
									<span class="text-small">
										Discount Given On Sales
									</span>
								</div>
							</div>
						</div>
					</div>

					<!-- {{stats}} -->

				<!-- <template v-for="(stat, key, index) in stats">
					
					<div class="grid-padding stat-item" :key="index">
						<div class="uk-text-capitalize uk-flex uk-flex-column uk-flex-wrap uk-flex-top">
							<h4 class="uk-text-capitalize tiny-margin-bottom uk-text-bold">
								{{stat | currency(`${emporium.currency} `)}}  
							</h4> 
							<span>
								{{ key.split('_').join(' ') }}
							</span>
						</div>	
					</div>
				</template> -->



			</div>
		</div>
	</template>

	<template v-if="visible">
		<div class="border-bottom uk-margin-bottom uk-margin-top"></div>
		<p class="uk-margin-remove">
			*** Figures shown are relative to the current Financial Year
		</p>
	</template>
</div>
</template>
<script>
import basic from "@/mixins/stats/store"
import {toggleVisibility} from "@/mixins/utils/visibility"
export default{
	mixins : [basic, toggleVisibility],
	async created(){
		await this.toggle();
		await this.getStats()
	}
};
</script>
