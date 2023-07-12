<template>
	<div class="background">
		<div class="tiny-padding border-bottom uk-flex uk-flex-between">
			<div class="uk-width-expand uk-flex uk-flex-middle">
				<tips-compare-branches class="uk-margin-small-right"></tips-compare-branches>
				<h4 class="uk-margin-remove">Compare Branches</h4>
			</div>

		</div>

		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-flex uk-flex-middle uk-flex-between uk-flex-wrap">
				
				<div class="uk-width-auto uk-margin-small-right uk-flex uk-flex-middle">
					<span class="text-small uk-margin-small-right">Select A Date Range</span>
					<partials-date-picker @date-set="applyDate"></partials-date-picker>
				</div>

				<div class="uk-width-auto" v-if="branches && branches.length > 0">
					<div class="chip uk-background-danger pill uk-flex-middle click" @click="branches = []">
						<span class="mdi mdi-close-circle tiny-margin-right uk-text-white"></span>
						<span class="text-small uk-text-white">
							Clear Selection
						</span>
					</div>
				</div>
				

				<div class="uk-width-auto uk-flex uk-flex-middle">
					<button class="uk-button uk-button-primary" :disabled="!branches || branches.length < 2 || !to || !from" @click="loadModal = true">
						Compare Selected Branches
					</button>
				</div>
			</div>
		</div>		
		<section>
			<div class="uk-width-1-1">
				<div v-if="$fetchState.pending" class="uk-padding-small uk-flex uk-flex-center uk-flex-middle uk-flex-column">
					<loaders-spinner></loaders-spinner>
				</div>

				<div v-else>

					<div v-if="loadFail && loadError"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s  rounded uk-margin-auto uk-margin-top uk-margin-bottom">
						<acl-parse-error :errorData="loadError">
							<button class="uk-button uk-button-primary" slot="further-action" @click="$fetch()">
								Retry
							</button>
						</acl-parse-error>
					</div>
					<div v-else>
						<template v-if="$store.getters['branches/branches'] && $store.getters['branches/branches'].length > 0">
							<div class="uk-width-1-1 uk-flex uk-flex-column">
								<div class="tiny-padding" v-for="(branch, key) in $store.getters['branches/branches']" :key="branch.uuid" :class="key < ($store.getters['branches/branches'].length - 1) ? 'border-bottom' : ''">

									<div class="uk-flex uk-flex-middle grid-gutter uk-padding-remove-bottom click" @click.prevent="handleChangeEvent(branch.uuid)">
										<div class="uk-light tiny-margin-right tiny-margin-top uk-width-auto uk-margin-right">
											<!-- <input :value="branch.uuid" @change.prevent="handleChangeEvent" type="checkbox" class="uk-checkbox  uk-border-rounded  bordered square-25" v-model="branches"> -->
											<div class="square-25 uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle" :class="branches.includes(branch.uuid) ? 'uk-background-primary' : 'bordered'">
												<span class="mdi mdi-check uk-text-white" v-if="branches.includes(branch.uuid)"></span>
											</div>
										</div>
										<div class="uk-flex uk-flex-column uk-width-expand">
											<p class="uk-margin-remove uk-text-bold">
												{{branch.name}} 
											</p>

											<span class="text-small">
												{{branch.manager && branch.manager.name !== undefined ? `Managed by ${branch.manager.name}` : 'No Manager Assigned'}}
											</span>
										</div>
									</div>
								</div>

							</div>
						</template>


						<div class="uk-width-1-1 uk-padding uk-padding-remove-top uk-margin-small-top" v-else>

							<div class="uk-width-2xlarge@m background rounded uk-padding uk-margin-auto">
								<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
										<span class="mdi mdi-store lni-extra-large uk-margin-bottom"></span>
										<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
											No branches found
										</h4>

										<p class="uk-text-center uk-margin-remove-top">
											Sales report will be displayed here when available
										</p>

										<button class="uk-button uk-button-primary" @click="$fetch">
											Reset All Filters
										</button>


									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</section>


		<vue-final-modal v-model="loadModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" @before-open="getData()" v-if="(branches && branches.length > 0) && to && from">
			<div class="uk-card rounded bordered background raised-deep uk-margin-auto uk-margin-auto-vertical uk-width-1-1 uk-inline  uk-width-1-1 uk-width-medium">
				<div class="uk-padding uk-flex uk-flex-column uk-flex-middle">
					<template v-if="loading">
						<loaders-spinner></loaders-spinner>
						<p class="uk-text-center uk-margin-small-top">
							Setting things up... please wait
						</p>
					</template>

					<template v-else>
						<error-parser v-if="failed && errData !== undefined" :errorData="errData">
							<div  slot="further-action" class="uk-flex">
								<button class="uk-button uk-button-small uk-button-danger tiny-margin-right" @click="loadModal = false">
									Close
								</button>
								<button class="uk-button uk-button-small uk-button-primary" @click="getData()">
									Retry
								</button>
							</div>
						</error-parser>
					</template>
				</div>
			</div>
		</vue-final-modal>



		<vue-final-modal :key="showModal" v-model="showModal" classes="uk-width-1-1" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" attach=".app">
			<div class="uk-width-1-1 uk-margin-top">
				<div class="uk-width-1-1 background bordered uk-border-rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-5-6@xl uk-margin-auto " style="max-width:99vw;">
					<div class="tiny-padding border-bottom uk-flex uk-flex-between">
						<h5 class="uk-margin-remove">
							Branch Comparison Report
						</h5>

						<button class="uk-button uk-button-danger uk-button-small" @click="showModal = false">
							Close
						</button>
					</div>
					<div class="modal-content uk-overflow-auto uk-width-1-1">
						<div class="uk-width-1-1 uk-flex" :class="`uk-child-width-1-${stats.length+1}`">
							<div class="uk-width-expand border-right">
								<div class="grid-padding border-bottom">
									<h5 class="uk-margin-remove">
										Branch Name
									</h5>

								</div>

								<div class="grid-padding uk-flex uk-flex-middle uk-flex-between">
									<h6 class="uk-margin-remove">
										Totals
									</h6>
									<div class="chip label uk-border-rounded click bordered" :class="showTotals ? 'uk-background-danger' : 'uk-background-success'" @click="showTotals = !showTotals">
										<span class="text-small uk-text-white">
											{{showTotals ? 'Hide' : 'Show'}} Totals
										</span>
									</div>
								</div>


								<div class="uk-background-success-op" v-if="showTotals">
									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
											Cost of Items Sold
										</p>
									</div>
									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
											Quantity Sold (Units)
										</p>
									</div>
									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
											Gross Value of Sales
										</p>
									</div>
									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
											Total Discount Given
										</p>
									</div>
									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
											Total Taxes
										</p>
									</div>

									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
											Net Value of Sales
										</p>
									</div>

									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
											Total Sales Profit
										</p>
									</div>

									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
											Sales Profit Margin
										</p>
									</div>
								</div>

								<div v-if="periods && periods.length > 0">
									<template v-for="(period, key) in periods">
										<div :key="period" class="uk-width-1-1">
											<div class="grid-padding uk-text-bold">
												{{$moment(period).format('DD MMMM, YYYY')}}
											</div>

											<template v-if="!hiddenPeriods.includes(period)">
												<div class="grid-padding border-bottom">
													<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
														Cost of Items Sold
													</p>
												</div>
												<div class="grid-padding border-bottom">
													<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
														Quantity Sold (Units)
													</p>
												</div>
												<div class="grid-padding border-bottom">
													<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
														Gross Value of Sales
													</p>
												</div>
												<div class="grid-padding border-bottom">
													<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
														Total Discount Given
													</p>
												</div>
												<div class="grid-padding border-bottom">
													<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
														Total Taxes
													</p>
												</div>

												<div class="grid-padding border-bottom">
													<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
														Net Value of Sales
													</p>
												</div>

												<div class="grid-padding border-bottom">
													<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
														Total Sales Profit
													</p>
												</div>

												<div class="grid-padding">
													<p class="uk-margin-remove-vertical uk-margin-left uk-text-left">
														Sales Profit Margin
													</p>
												</div>
											</template>
										</div>
									</template>
								</div>

							</div>
							<div v-for="(item, key) in stats" :key="key" :class="key < stats.length -1 ? 'border-right' : ''">
								<div class="grid-padding border-bottom">
									<h5 class="uk-margin-remove uk-text-truncate">
										{{item.branch_name}}
									</h5>
								</div>

								<div class="grid-padding uk-flex">
									<h6 class="uk-margin-remove">
										<!-- Totals -->
										&nbsp;
									</h6>

									<div class="chip label bordered" style="border-color: transparent !important">
										<span>
											&nbsp;
										</span>
									</div>
								</div>
								

								<div class="uk-background-success-op" v-if="showTotals">
									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove uk-text-right">
											{{item.total_cost_price | currency(`${emporium.currency} `)}}
										</p>
									</div>
									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove uk-text-right">
											{{item.quantity_sold | pluralize('Unit')}}
										</p>
									</div>
									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove uk-text-right">
											{{item.total_selling_price | currency(`${emporium.currency} `)}}
										</p>
									</div>
									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove uk-text-right">
											{{item.total_discount_given | currency(`${emporium.currency} `)}}
										</p>
									</div>
									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove uk-text-right">
											{{item.total_tax_amount | currency(`${emporium.currency} `)}}
										</p>
									</div>

									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove uk-text-right">
											{{item.revenue | currency(`${emporium.currency} `)}}
										</p>
									</div>

									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove uk-text-right" :class="item.profit < 0 ? 'uk-text-danger' : 'uk-text-success'">
											{{item.profit | currency(`${emporium.currency} `)}}
										</p>
									</div>

									<div class="grid-padding border-bottom">
										<p class="uk-margin-remove uk-text-right" :class="item.profit_margin < 0 ? 'uk-text-danger' : 'uk-text-success'">
											{{ item.profit_margin / 100 | percent }}
										</p>
									</div>
								</div>

								<template v-if="periods && periods.length > 0">
									<div v-for="(item_period, key) in item.periods" :key="`item.branch.uuid-periods${key}`">
										<div class="uk-width-1-1">
									<!-- 	<div class="tiny-padding uk-flex border-bottom" :class="key > periods.length ? 'border-top' : ''">
											<div class="chip uk-border-rounded bordered click" @click="togglePeriodVisibility(item_period.date)">
												{{$moment(item_period.date).format('DD MMMM, YYYY')}} - Click To {{ hiddenPeriods.includes(item_period.date) ? 'Show' : 'Hide' }} Period
											</div>
										</div> -->

										<div class="grid-padding uk-text-right uk-text-bold">
											{{$moment(item_period.date).format('DD MMMM, YYYY')}}
										</div>

										<template v-if="!hiddenPeriods.includes(item_period.date)">
											<div class="grid-padding border-bottom">
												<p class="uk-margin-remove uk-text-right">
													{{item_period.total_cost_price | currency(`${emporium.currency} `)}}
												</p>
											</div>
											<div class="grid-padding border-bottom">
												<p class="uk-margin-remove uk-text-right">
													{{item_period.quantity_sold | pluralize('Unit')}}
												</p>
											</div>
											<div class="grid-padding border-bottom">
												<p class="uk-margin-remove uk-text-right">
													{{item_period.total_selling_price | currency(`${emporium.currency} `)}}
												</p>
											</div>
											<div class="grid-padding border-bottom">
												<p class="uk-margin-remove uk-text-right">
													{{item_period.total_discount_given | currency(`${emporium.currency} `)}}
												</p>
											</div>
											<div class="grid-padding border-bottom">
												<p class="uk-margin-remove uk-text-right">
													{{item_period.total_tax_amount | currency(`${emporium.currency} `)}}
												</p>
											</div>

											<div class="grid-padding border-bottom">
												<p class="uk-margin-remove uk-text-right">
													{{item_period.revenue | currency(`${emporium.currency} `)}}
												</p>
											</div>

											<div class="grid-padding border-bottom">
												<p class="uk-margin-remove uk-text-right" :class="item_period.profit < 0 ? 'uk-text-danger' : 'uk-text-success'">
													{{item_period.profit | currency(`${emporium.currency} `)}}
												</p>
											</div>

											<div class="grid-padding border-bottom">
												<p class="uk-margin-remove uk-text-right" :class="item_period.profit_margin < 0 ? 'uk-text-danger' : 'uk-text-success'">
													{{ item_period.profit_margin / 100 | percent }}
												</p>
											</div>
										</template>
									</div>
								</div>
							</template>
						</div>
					</div>
					
				</div>
<!-- 
				<div class="uk-width-1-1 uk-flex uk-flex-center border-top tiny-padding">
					<button class="uk-button uk-button-primary">
						Export Data
					</button>
				</div> -->
			</div>
		</div>
	</vue-final-modal>
</div>
</template>
<script>
import {branches} from "@/mixins/reports/compare" 
export default{
	fetchOnServer : false,
	head(){
		return {
			title : `${this.$appName} | ${this.emporium.name} - Compare Branches`
		}
	},

	data(){
		return {
			loadFail : undefined,
			loadError : undefined,
			showTotals : true,
			hiddenPeriods : []
		}
	},

	computed : {
		periods(){
			let keys = []
			if (Object.keys(this.stats).length > 0 ) {
				this.stats[0].periods.forEach(period => {
					keys.push(period.date)
				})
			}

			return keys
		}
	},


	async fetch(){
		this.loadFail = undefined
		this.loadError = undefined
		let branches  = 	await this.$store.dispatch('branches/getBranches')
		await Promise.all([branches])
		.catch( err =>{
			this.loadFail = true
			this.loadError = err
		})
	},

	mixins : [branches],
	async mounted(){
		this.$on('data-loaded', ()=>{
			this.loadModal = false
			this.showModal = true
		})
	},

	methods : {
		togglePeriodVisibility(period){
			if (!this.hiddenPeriods.includes(period)) {
				this.hiddenPeriods.push(period)
				return
			}

			this.hiddenPeriods = this.hiddenPeriods.filter(i => {return period !== i })
		},

		handleChangeEvent(value){
			this.$message.destroy()
			if (!this.branches.includes(value)) {
				if (this.branches.length < 4) {
					this.branches.push(value)
					return
				}
				this.$message.error("You can only compare up to 4 branches at a time.", 3)
				return
			}

			this.branches = this.branches.filter(i => {return value !== i })
		}
	}
};
</script>
