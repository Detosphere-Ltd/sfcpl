<template>
	<div>
		<div class="background uk-margin-medium-bottom">

			<div class="uk-padding-small border-bottom">
				<h5 class="uk-margin-remove">Purchases History - {{product.name}}</h5>
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

					<div class="uk-width-auto  uk-flex uk-flex-column" v-if="product.expires">
						<span class="text-small tiny-margin-bottom uk-text-truncate">Purchase Health</span>
						<select class="uk-select uk-text-small uk-text-capitalize" v-model="expired">
							<option :value="option.value" v-for="(option,key) in expiry" :key="`expiry${key}`">
								{{option.text}}
							</option>
						</select>
					</div>
				</div>
			</div>

			<div class="uk-width-1-1 border-bottom tiny-padding uk-padding-remove-horizontal uk-padding-remove-top">
				<headers-purchases class="tiny-padding uk-padding-remove-bottom"></headers-purchases>
			</div>
			<div v-if="loading" class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center">
				<loaders-spinner></loaders-spinner>
			</div>

			<div v-else>
				<div v-if="failed"  class="uk-width-1-1 uk-flex uk-flex-column uk-padding">
					<acl-parse-error :errorData="errData">
						<button class="uk-button uk-button-primary" slot="further-action" @click="getProductPurchases">
							Retry
						</button>
					</acl-parse-error>
				</div>
				<div v-else>
					<div v-if="purchases && purchases.length > 0">
						<template  v-for="(purchase,i) in purchases">
							<purchase-card :key="i" v-if="!purchase.belongs_to_invoice" :class="i < (purchases.length - 1) ? 'border-bottom' : ''"  @needs-to-refresh="getProductPurchases" :purchase="purchase">
							</purchase-card>
							<purchase-invoice-item-card :key="i" v-else :class="i < (purchases.length - 1) ? 'border-bottom' : ''"  @needs-to-refresh="getProductPurchases" :purchase="purchase">
							</purchase-invoice-item-card>
						</template>
						<div class="border-top tiny-padding uk-flex uk-flex-center" v-if="pagination && pagination.total_pages > pagination.current_page">
							<button class="uk-button uk-button-primary uk-button-small" :disabled="fetching" @click="loadExtraData" :class="{loading : fetching}">
								Load More Records
							</button>
						</div>
					</div>

					<div class="uk-padding-large uk-flex uk-flex-column uk-flex-middle" v-else>
						<h4>
							No Purchases found
						</h4>
						<p>
							We could not find any purchase records for this product. Purchases you record for this product will show up here
						</p>

						<div class="uk-flex" v-if="can('record-purchases')">
							<button class="uk-button uk-button-primary tiny-margin-right" @click="clearFilters(); getProductPurchases()">
								Reload
							</button>
							<product-actions-record-purchase :product="product" @done="getProductPurchases">
								<button class="uk-button uk-button-primary" slot="action-button">
									Record A New Purchase
								</button>
							</product-actions-record-purchase>
						</div>
					</div>


				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/product/singleton"
import purchases from "@/mixins/product/purchases"
export default{
	mixins : [bindProps, purchases],
	async created(){
		await this.getProductPurchases()
	}
};
</script>
