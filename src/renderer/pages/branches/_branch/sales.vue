<template>
	<div>
		<div class="tiny-padding border-bottom ">
			<div class="uk-width-expand uk-flex uk-flex-middle">

				<div class="square-30 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="clearFilters(); loadSales()">
					<span class="mdi uk-text-white" :class="loading ? 'mdi-loading spin' : 'mdi-reload'"></span>
				</div>
				
				<h4 class="uk-margin-remove">Sales Records for {{branch.name | branchize }}</h4>
			</div>
		</div>


		<stats-sales-summary :stats="stats"></stats-sales-summary>

		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-flex uk-flex-bottom">
				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-right">
					<span class="text-small tiny-margin-bottom">Filter By Status</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="state">
						<option value="" selected >All Sales</option>
						<option :value="option.value" v-for="option in states" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-auto  uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom">Sale Types</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="source">
						<option value="" selected >All Sale Sources</option>
						<option :value="option.value" v-for="option in sources" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-auto uk-margin-left uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom">Date Range</span>
					<partials-date-picker @date-set="applyDate"></partials-date-picker>
				</div>

				<div class="uk-width-small  uk-flex uk-flex-column uk-margin-left">
					<span class="text-small tiny-margin-bottom"> Payment Status</span>

					<select class="uk-select uk-text-small uk-text-capitalize" v-model="outstanding">
						<option value="" selected >All Sales</option>
						<option :value="opt.value" v-for="(opt, key) in [{value : 'true', text : 'Credit Sales'} , {value : 'false', text : 'Fully Paid Sales'}]" :key="`opt${key}`">
							{{opt.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-small  uk-flex uk-flex-column uk-margin-left tags-input">
					<span class="text-small tiny-margin-bottom">Payment Modes</span>

					<a-select mode="multiple" v-model="payment_modes" :max-tag-count="1" allow-clear not-found-content show-search filter-option option-filter-prop="name" show-arrow  size="large">
						<template slot="clearIcon">
							<span class="mdi mdi-close uk-text-danger background uk-background-danger uk-margin-remove"></span>
						</template>
						<a-select-option selected disabled class="uk-text-truncate" key="Payment Mode" name="All Payment Modes" value="">
							Select Payment Mode(s)
						</a-select-option>
						<a-select-option class="uk-text-truncate" v-for="item in $store.getters['paymentModes']" :key="item.value" :name="item.text" :value="item.text">
							{{item.text}}
						</a-select-option>
					</a-select>
				</div>

				<div class="uk-width-auto uk-margin-auto-left uk-flex grid-padding uk-padding-remove-bottom">
					<stats-sales-actions-export class="uk-margin-small-right" :data="allSales" :params="queryParameters" v-if="can('view-sales-statistics')">
					</stats-sales-actions-export>
					
					<div class="chip click bordered uk-border-rounded" @click="showLedger = !showLedger">
						{{showLedger ? 'Hide' : 'Show'}} Records
					</div>
				</div>
			</div>
		</div>



		<section class="ledger" v-show="showLedger">
			<div class="tiny-padding border-bottom">
				<headers-sales></headers-sales>
			</div>




			<div class="uk-width-1-1">
				<div v-if="loading" class="uk-padding-small uk-flex uk-flex-center uk-flex-middle uk-flex-column">
					<loaders-spinner></loaders-spinner>
				</div>

				<div v-else>

					<div v-if="failed && errData"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s  rounded uk-margin-auto uk-margin-top uk-margin-bottom">
						<acl-parse-error :errorData="errData">
							<button class="uk-button uk-button-primary" slot="further-action" @click="loadSales">
								Retry
							</button>
						</acl-parse-error>
					</div>
					<div v-else>
						<template v-if="allSales && allSales.length > 0">
							<div class="uk-width-1-1 uk-flex uk-flex-column">
								<sale-record class="tiny-padding"  v-for="(sale,i) in allSales" :key="sale.uuid" :sale="sale" :class="i < (allSales.length - 1) ? 'border-bottom' : ''" @needs-to-refresh="loadSales" :show-branch="false">
								</sale-record>

								<div class="border-top tiny-padding uk-flex uk-flex-center" v-if="pagination && pagination.total_pages > pagination.current_page">
									<button class="uk-button uk-button-primary uk-button-small" :disabled="fetching" @click="loadExtraData" :class="{loading : fetching}">
										Load More Records
									</button>
								</div>

							</div>
						</template>


						<div class="uk-width-1-1 uk-padding uk-padding-remove-top uk-margin-small-top" v-else>

							<div class="uk-width-2xlarge@m background rounded uk-padding uk-margin-auto">
								<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
										<span class="mdi mdi-package lni-extra-large uk-margin-bottom"></span>
										<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
											No sales records found
										</h4>
										<template v-if="state || from || to">
											<p class="uk-text-center uk-margin-remove-top" >
												There are no sale records that match your filters. 
											</p>
										</template>


										<p class="uk-text-center uk-margin-remove-top" v-else>
											Sales activity will be displayed here when available.
										</p>
										<button class="uk-button uk-button-primary" @click="clearFilters">
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
	</div>
</template>
<script>
import {bindProps , branchSales} from "@/mixins/branches/singleton"
export default{
	data(){
		return {
			showLedger : true
		}
	},
	mixins : [bindProps , branchSales],
	head(){
		return {
			title : `${this.branch.name} Sales Log | ${this.$appName}`
		}
	},
	async created(){
		await this.loadSales()
	}

};
</script>
