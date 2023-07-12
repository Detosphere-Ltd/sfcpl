<template>
	<div class="background uk-padding-large uk-padding-remove-horizontal uk-padding-remove-top">

		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-flex uk-flex-middle uk-flex-between">
				<div class="uk-width-expand uk-flex uk-flex-middle">
					<div class="square-30 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="clearFilters();getPurchases()">
						<span class="mdi uk-text-white" :class="loading ? 'mdi-loading spin' : 'mdi-reload'"></span>
					</div>
					<h4 class="uk-margin-remove">Purchase Records</h4>
				</div>

				<div class="uk-width-expand uk-flex uk-flex-right uk-flex-middle">
					<purchase-actions-record-invoice class="uk-margin-small-right" v-if="can('record-purchases')" @completed="getPurchases()"></purchase-actions-record-invoice>
				</div>
			</div>
		</div>

		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-flex uk-flex-top">

				<div class="uk-width-auto uk-margin-small-right uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom uk-text-truncate">Purchases By Date</span>
					<partials-date-picker @date-set="applyDate"></partials-date-picker>
				</div>

				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right uk-visible@xl">
					<span class="text-small tiny-margin-bottom uk-text-truncate">Purchase Status</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="state">
						<option value="" selected >All Purchases</option>
						<option :value="option.value" v-for="option in states" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-small  uk-flex uk-flex-column uk-margin-small-right tags-input">
					<span class="text-small tiny-margin-bottom uk-text-truncate">Supplier</span>
					
					<a-select mode="default" v-model="supplier"  not-found-content="No supplier found" show-search filter-option option-filter-prop="name" show-arrow size="large">
						<a-select-option selected class="uk-text-truncate" name="All Suppliers" value="">
							All Suppliers
						</a-select-option>
						<a-select-option class="uk-text-truncate" v-for="supplier in $store.getters['suppliers/suppliers']" :key="supplier.uuid" :name="supplier.name" :value="supplier.uuid">
							{{supplier.name}}
						</a-select-option>
					</a-select>
				</div>

				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
					<span class="text-small tiny-margin-bottom uk-text-truncate">Purchase Source</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="belongs_to_invoice">
						<option :value="option.value" v-for="option in sources" :key="`inv-${option.value}`">
							{{option.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-auto uk-text-truncate  uk-flex uk-flex-column tags-input uk-margin-small-right">
					<span class="text-small tiny-margin-bottom uk-text-truncate">Purchases By Unit Type</span>
					<a-select mode="multiple" v-model="unit_types" :max-tag-count="1" allow-clear not-found-content show-search filter-option option-filter-prop="name" show-arrow size="large">
						<template slot="clearIcon">
							<span class="mdi mdi-close uk-text-danger background uk-background-danger uk-margin-remove"></span>
						</template>
						<a-select-option selected disabled class="uk-text-truncate" key="Unit Type" name="All Units" value="">
							Select Unit(s)
						</a-select-option>
						<a-select-option class="uk-text-truncate" v-for="item in $store.getters['units/units']" v-if="item.total_purchases > 0" :key="item.uuid" :name="item.name" :value="item.uuid">
							{{item.name}}
						</a-select-option>
					</a-select>
				</div>

				
				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
					<span class="text-small tiny-margin-bottom uk-text-truncate"> Payment Status</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="outstanding">
						<option value="" selected >Everything</option>
						<option :value="option.value" v-for="(option,key) in [{value : 'true', text:'Credit Purchases'}, {value : 'false', text:'Fully Paid Purchases'}]" :key="`payment${key}`">
							{{option.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-auto  uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom uk-text-truncate">Purchase Health</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="expired">
						<option :value="option.value" v-for="(option,key) in expiry" :key="`expiry${key}`">
							{{option.text}}
						</option>
					</select>
				</div>
			</div>
		</div>


		<div class="tiny-padding border-bottom">
			<headers-purchases></headers-purchases>
		</div>


		<div class="uk-width-1-1">
			<div v-if="loading" class="uk-padding-small uk-flex uk-flex-center uk-flex-middle uk-flex-column">
				<loaders-spinner></loaders-spinner>
			</div>

			<div v-else>

				<div v-if="failed && errData"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s bordered rounded uk-margin-auto uk-margin-top">
					<acl-parse-error :errorData="errData">
						<button class="uk-button uk-button-primary" slot="further-action" @click="getPurchases">
							Retry
						</button>
					</acl-parse-error>
				</div>
				<div v-else>
					<template v-if="purchases && purchases.length > 0">
						<template  v-for="(purchase,i) in purchases">
							<purchase-card :key="i" v-if="!purchase.belongs_to_invoice" :class="i < (purchases.length - 1) ? 'border-bottom' : ''"  @needs-to-refresh="getPurchases" :purchase="purchase">
							</purchase-card>
							<purchase-invoice-item-card :key="i" v-else :class="i < (purchases.length - 1) ? 'border-bottom' : ''"  @needs-to-refresh="getPurchases" :purchase="purchase">
							</purchase-invoice-item-card>
						</template>

						<div class="border-top tiny-padding uk-flex uk-flex-center" v-if="pagination && pagination.total_pages > pagination.current_page">
							<button class="uk-button uk-button-primary uk-button-small" :disabled="fetching" @click="loadExtraData" :class="{loading : fetching}">
								Load More Records
							</button>
						</div>
					</template>


					<div class="uk-width-1-1 uk-padding uk-padding-remove-top uk-margin-small-top" v-else>

						<div class="uk-width-2xlarge@m background rounded uk-padding uk-margin-auto">
							<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
								<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-package lni-extra-large uk-margin-bottom"></span>
									<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
										No purchase records found
									</h4>
									<p class="uk-text-center uk-margin-remove-top">
										Your purchase history will be displayed here when available
									</p>

								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import purchases from "@/mixins/purchases" 
export default{
	async asyncData({query}){
		let outstanding = ''
		if (query && query.intent === 'pay') {
			outstanding = true
		}
		return {outstanding}
	},
	mixins : [purchases],
	async created(){
		await this.getPurchases()
	},
	head(){
		return{
			title : `${this.$appName} | ${this.emporium.name} - Purchase History`
		}
	},
};
</script>
