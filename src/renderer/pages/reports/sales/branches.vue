<template>
	<div class="background">
		<div class="tiny-padding border-bottom uk-flex uk-flex-between">
			<div class="uk-width-expand uk-flex uk-flex-middle">

				<div class="square-30 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="clearFilters(); getData()">
					<span class="mdi uk-text-white" :class="loading ? 'mdi-loading spin' : 'mdi-reload'"></span>
				</div>
				
				<h4 class="uk-margin-remove">Branch Product Sales Report</h4>
			</div>

		</div>


		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-flex uk-flex-bottom uk-flex-wrap">
				
				<div class="uk-width-auto uk-margin-small-right uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom">Date Range</span>
					<partials-date-picker @date-set="applyDate"></partials-date-picker>
				</div>
				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
					<span class="text-small tiny-margin-bottom">Sort By Criteria</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="order_by">
						<option :value="option.value" v-for="option in criteria" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
					<span class="text-small tiny-margin-bottom">Sort Direction</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="direction">
						<option :value="opt.value" v-for="opt in directions" :key="opt.value">
							{{opt.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-right">
					<span class="text-small tiny-margin-bottom">Branches</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="branch">
						<option value="" selected>All Branches</option>
						<option :value="br.name" v-for="br in $store.getters['branches/branches']" :key="br.uuid">
							{{br.name}}
						</option>
					</select>
				</div>

			</div>
		</div>


		<section class="uk-width-1-1 uk-flex uk-flex-column horizontal-scroll">

			<headers-reports-branch-sales class="tiny-padding border-bottom"></headers-reports-branch-sales>
			

			<div class="uk-width-1-1">
				<div v-if="loading" class="uk-padding-small uk-flex uk-flex-center uk-flex-middle uk-flex-column">
					<loaders-spinner></loaders-spinner>
				</div>

				<div v-else>

					<div v-if="failed && errData"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s  rounded uk-margin-auto uk-margin-top uk-margin-bottom">
						<acl-parse-error :errorData="errData">
							<button class="uk-button uk-button-primary" slot="further-action" @click="getData">
								Retry
							</button>
						</acl-parse-error>
					</div>
					<div v-else>
						<template v-if="stats && stats.length > 0">
							<div class="uk-width-1-1 uk-flex uk-flex-column">
								<branch-sales-report class="tiny-padding"  v-for="(item,i) in stats" :key="i" :item="item" :class="i < (stats.length - 1) ? 'border-bottom' : ''">
								</branch-sales-report>

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
											No stats found
										</h4>

										<p class="uk-text-center uk-margin-remove-top">
											Sales report will be displayed here when available
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
</div>
</template>
<script>
import {branches} from "@/mixins/reports/sales" 
export default{
	head(){
		return {
			title : `${this.$appName} | ${this.emporium.name} - Sales Report`
		}
	},
	async fetch(){
		let branches  = 	await this.$store.dispatch('branches/getBranches')
		await Promise.all([branches])
		.catch( err =>{
			this.failed = true
			this.errData = err
		})
	},

	mixins : [branches],
	async created(){
		await this.getData()
	}
};
</script>
