<template>
	<div class="background">
		<div class="tiny-padding border-bottom ">
			<div class="uk-width-expand uk-flex uk-flex-middle">

				<div class="square-30 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="clearFilters(); loadSales()">
					<span class="mdi uk-text-white" :class="loading ? 'mdi-loading spin' : 'mdi-reload'"></span>
				</div>
				
				<h4 class="uk-margin-remove">Individual Sale Items</h4>

			</div>
		</div>

		<nav class="uk-flex border-bottom">

			<nuxt-link :to="{name: 'sales'}" class="tab uk-width-auto highlight-text" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove">
				Sales Transactions
			</nuxt-link>

			<nuxt-link :to="{name: 'sales-items'}" class="tab uk-width-auto highlight-text" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove">
				Individual Sale Items
			</nuxt-link>

		</nav>

		<stats-sales-summary :stats="stats"></stats-sales-summary>

		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-flex uk-flex-bottom uk-flex-wrap">
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
						<option value="" selected >All Types</option>
						<option :value="option.value" v-for="option in sources" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>


				<div class="uk-width-auto uk-margin-left uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom">Date Range (Date Sold)</span>
					<partials-date-picker @date-set="applyDate"></partials-date-picker>
				</div>

				<div class="uk-width-small  uk-flex uk-flex-column uk-margin-left">
					<span class="text-small tiny-margin-bottom">Branch</span>

					<select class="uk-select uk-text-small uk-text-capitalize" v-model="saleBranch">
						<option value="" selected >All Branches</option>
						<option :value="branch.uuid" v-for="branch in $store.getters['branches/branches']" :key="branch.uuid">
							{{branch.name}}
						</option>
					</select>
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


				

				<div class="uk-width-auto uk-margin-auto-left uk-flex grid-padding uk-padding-remove-bottom">
					<stats-sales-actions-export-sale-items class="uk-margin-small-right" :data="sales" :params="queryParameters" v-if="can('view-sales-statistics')">
					</stats-sales-actions-export-sale-items>
					
					<div class="chip click bordered uk-border-rounded" @click="showLedger = !showLedger">
						{{showLedger ? 'Hide' : 'Show'}} Records
					</div>
				</div>
			</div>
		</div>

		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-flex uk-flex-bottom uk-flex-wrap">
				<div class="uk-width-medium  uk-flex uk-flex-column tags-input">
					<span class="text-small tiny-margin-bottom">Product Tags/ Categories</span>

					<a-select mode="multiple" v-model="tags" :max-tag-count="1" allow-clear not-found-content show-search filter-option option-filter-prop="name" show-arrow  size="large">
						<template slot="clearIcon">
							<span class="mdi mdi-close uk-text-danger background uk-background-danger uk-margin-remove"></span>
						</template>
						<a-select-option selected disabled class="uk-text-truncate" key="Product Tag" name="All Product Tags/Categories" value="">
							Select Product Tags / Categories
						</a-select-option>
						<a-select-option class="uk-text-break uk-text-capitalize" v-for="item in $store.getters['tags/tags']" :key="item.name" :name="item.name" :value="item.name">
							{{item.name}}
						</a-select-option>
					</a-select>
				</div>


				<div class="uk-width-medium  uk-flex uk-flex-column tags-input uk-margin-left">
					<span class="text-small tiny-margin-bottom">Product Variations</span>

					<a-select  v-model="variation" :max-tag-count="1" allow-clear not-found-content show-search filter-option option-filter-prop="name" show-arrow  size="large">
						<template slot="clearIcon">
							<span class="mdi mdi-close uk-text-danger background uk-background-danger uk-margin-remove"></span>
						</template>
						<a-select-option selected disabled class="uk-text-truncate" key="Product Variation" name="All Product Variations" value="">
							Select Product Variation
						</a-select-option>
						<a-select-option class="uk-text-break uk-text-capitalize" v-for="variant in $store.getters['variations/variations']" :key="variant.uuid" :name="variant.name" :value="variant.uuid">
							{{variant.name}} {{variant.code}}
						</a-select-option>
					</a-select>
				</div>

				<div class="uk-width-auto uk-margin-auto-left uk-flex uk-flex-middle">
					<div class="uk-width-medium@m uk-inline">
						<input type="text" class="uk-input" placeholder="Search by Product Name or Code" v-model="searchTerm">
						<div class="uk-flex uk-flex-middle uk-width-auto uk-position-z-index uk-position-center-right" v-if="searchTerm || searching">
							<a class="square-20 background uk-border-circle bordered uk-flex uk-flex-column uk-flex-center uk-flex-middle click uk-margin-small-right" v-if="searchTerm && !searching" @click="loadSales(); clearFilters()">
								<span class="mdi mdi-close"></span>
							</a>
						</div>
					</div>
					<button class="uk-button uk-button-small uk-button-primary uk-margin-small-left" :disabled="!searchTerm || searching || searchTerm.length < 3"  @click.prevent="searchData()" :class="{loading : searching}">
						Search
					</button>
				</div>
			</div>

		</div>

		
		<section class="ledger uk-width-1-1 horizontal-scroll uk-flex uk-flex-column" v-show="showLedger">
			
			<div class="tiny-padding border-bottom">
				<headers-sale-items></headers-sale-items>
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
						<template v-if="sales && sales.length > 0">
							<div class="uk-width-1-1 uk-flex uk-flex-column">
								<sale-item class="tiny-padding"  v-for="(sale,i) in sales" :key="sale.uuid" :sale="sale" :class="i < (sales.length - 1) ? 'border-bottom' : ''" @needs-to-refresh="loadSales">
								</sale-item>
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

										<button class="uk-button uk-button-primary" @click="clearFilters(); loadSales()">
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
import sale_items from "@/mixins/sales/items" 
export default{
	head(){
		return {
			title : `${this.$appName} | ${this.emporium.name} - Sales Records`
		}
	},
	async fetch(){
		let branches  = 	await this.$store.dispatch('branches/getBranches')
		let categories  = 	await this.$store.dispatch('tags/getData')
		let variations  = 	await this.$store.dispatch('variations/getData')
		await Promise.all([branches, branches, variations])
		.catch( err =>{
			this.failed = true
			this.errData = err
		})
	},
	data(){
		return {
			showLedger : true
		}
	},
	mixins : [sale_items],
	async created(){
		await this.loadSales()
	}
};
</script>
