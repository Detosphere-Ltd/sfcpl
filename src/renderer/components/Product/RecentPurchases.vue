<template>
	<div>


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
				<div v-if="latestPurchases && latestPurchases.length > 0">

					<div class="tiny-padding border-bottom">
						<h4 class="uk-margin-remove">Recent Purchases</h4>
					</div>

					<div class="uk-width-1-1 border-bottom tiny-padding">
						<headers-purchases></headers-purchases>
					</div>
					<template  v-for="(purchase,i) in latestPurchases">
						<purchase-card :key="i" v-if="!purchase.belongs_to_invoice" :class="i < (purchases.length - 1) ? 'border-bottom' : ''"  @needs-to-refresh="getProductPurchases" :purchase="purchase">
						</purchase-card>
						<purchase-invoice-item-card :key="i" v-else :class="i < (purchases.length - 1) ? 'border-bottom' : ''"  @needs-to-refresh="getProductPurchases" :purchase="purchase">
						</purchase-invoice-item-card>
					</template>

					<div class="uk-padding-small uk-flex uk-flex-center" v-if="purchases.length > latestPurchases.length">
						<nuxt-link :to="{name: 'inventory-product-purchases', params:{product : product.uuid}}" class="uk-button uk-button-primary">
							Browse Purchase Records For This Product
						</nuxt-link>
					</div>
				</div>

				<div class="uk-padding-small" v-else>
					<h4>
						No Purchases found
					</h4>
					<p>
						We could not find any purchase records for this product. Purchases you record for this product will show up here
					</p>

					<div class="uk-flex" v-if="can('record-purchases')">
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
