<template>
	<div class="background">
		<div class="tiny-padding border-bottom uk-flex uk-flex-between">
			<div class="uk-width-expand uk-flex uk-flex-middle">

				<div class="square-30 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="clearFilters(); getData()">
					<span class="mdi uk-text-white" :class="loading ? 'mdi-loading spin' : 'mdi-reload'"></span>
				</div>
				
				<h4 class="uk-margin-remove">Product Sales Report</h4>
			</div>

			<div class="uk-width-auto uk-flex uk-flex-middle">
				<div class="uk-width-medium@m uk-inline">
					<input type="text" class="uk-input" placeholder="Enter Product name / code to search" v-model="searchTerm">
					<div class="uk-flex uk-flex-middle uk-width-auto uk-position-z-index uk-position-center-right" v-if="searchTerm || searching">
						<a class="square-20 background uk-border-circle bordered uk-flex uk-flex-column uk-flex-center uk-flex-middle click uk-margin-small-right" v-if="searchTerm && !searching" @click="getData(); searchTerm = ''">
							<span class="mdi mdi-close"></span>
						</a>
					</div>
				</div>
				<button class="uk-button uk-button-small uk-button-primary uk-margin-small-left" :disabled="!searchTerm || searching || searchTerm.length < 3"  @click.prevent="debouncedSearch" :class="{loading : searching}">
					Search
				</button>
			</div>
		</div>


		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-flex uk-flex-bottom uk-flex-wrap">
				

				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
					<span class="text-small tiny-margin-bottom">Filter Stock By Criteria</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="order_by">
						<option :value="option.value" v-for="option in criteria" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
					<span class="text-small tiny-margin-bottom">Direction</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="direction">
						<option :value="opt.value" v-for="opt in directions" :key="opt.value">
							{{opt.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
					<span class="text-small tiny-margin-bottom">Avilability</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="instock">
						<option :value="av.value" v-for="av in stockLevels" :key="av.value">
							{{av.text}}
						</option>
					</select>
				</div>


				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
					<span class="text-small tiny-margin-bottom">Report Type</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="reportType">
						<option :value="rtp.value" v-for="rtp in reportTypes" :key="rtp.value">
							{{rtp.text}}
						</option>
					</select>
				</div>

				
				<div class="uk-margin-auto-left uk-margin-small-bottom">
					<div class="uk-flex uk-flex-middle uk-width-auto">
						<div class="chip click uk-border-rounded" :class="view === 'table' ? 'uk-background-success uk-text-white' : ''" @click="view = 'table'">
							<span>Table View</span>
						</div>
						<div class="chip click uk-border-rounded" :class="view === 'card' ? 'uk-background-success uk-text-white' : ''" @click="view = 'card'">
							Card View
						</div>
					</div>
				</div>

			</div>
		</div>


		<template v-if="view === 'table'">
			<headers-reports-general-stock class="tiny-padding border-bottom" v-if="!reportType"></headers-reports-general-stock>
			<headers-reports-stock class="tiny-padding border-bottom" v-else></headers-reports-stock>
		</template>
		
		<section>
			


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
								{{stats[0]}}
								<!-- <stock-report-card :display="view" :report-type="reportType" class="tiny-padding"  v-for="(item,i) in stats" :key="i" :item="item" :class="i < (stats.length - 1) ? 'border-bottom' : ''">
								</stock-report-card> -->

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
import {store} from "@/mixins/reports/sales" 
export default{
	head(){
		return {
			title : `${this.$appName} | ${this.emporium.name} - Sales Report`
		}
	},
	async fetch(){
		let branches  = 	await this.$store.dispatch('branches/getBranches')
		let categories  = 	await this.$store.dispatch('tags/getData')
		await Promise.all([branches , categories])
		.catch( err =>{
			this.failed = true
			this.errData = err
		})
	},
	data(){
		return {
			view : 'table'
		}
	},
	mixins : [store],
	async created(){
		await this.getData()
	}
};
</script>
