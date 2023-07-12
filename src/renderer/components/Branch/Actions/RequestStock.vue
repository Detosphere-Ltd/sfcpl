<template>
	<div>
		<button class="uk-button uk-button-success uk-text-white uk-button-small" @click="selectProductsModal = true" :disabled="selection && selection.length < 1">
			Request Selected {{selection.length | pluralize('Product')}}
		</button>


		<vue-final-modal v-model="selectProductsModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" @before-open="setProductsData">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast  uk-flex uk-flex-column uk-width-1-1 un-inline uk-width-large@m">
					<div class="uk-position-cover uk-position-z-index background rounded uk-flex uk-flex-column uk-flex-middle uk-flex-center" v-if="submitting">
						<loaders-spinner class="uk-margin-bottom"></loaders-spinner>
						<span>Submittin stock request... Please wait</span>
					</div>
					<div class="tiny-padding border-bottom uk-flex uk-flex-between uk-flex-middle">
						<div class="uk-width-expand uk-margin-right">
							<h5 class="uk-margin-remove uk-text-bold">
								Stock Request
							</h5>
						</div>
						<div class="uk-width-auto">
							<button class="uk-button uk-button-small text-small uk-button-danger" @click="selectProductsModal = false; cancelPrompt = true">
								Cancel
							</button>
						</div>
					</div>

					<div class="uk-width-1-1 uk-overflow-auto modal-content">
						
						<template v-if="products && products.length > 0">

							<div class="uk-padding-small">
								<h4 class="uk-margin-remove-top tiny-margin-bottom">
									You are about to request stock from {{branch.name | branchize}}.
								</h4>
								<p class="uk-margin-remove">
									Confirm the quantities you want to transfer for each product and submit the request when you are okay with your choices.
								</p>
							</div>

							<div class="tiny-padding background tiny-margin-bottom uk-flex uk-flex-between uk-flex-middle border-bottom border-top">
								<div class="uk-width-expand">Product</div>

								<div style="width: 80px">Quantity</div>
							</div>
							<div class="tiny-padding background tiny-margin-bottom uk-flex uk-flex-between uk-flex-top" v-for="(product,productIndex) in products" :key="product.uuid" :class="productIndex < products.length-1 ? 'border-bottom' : ''">

								<div class="square-30  uk-border-rounded uk-margin-small-right click uk-flex uk-flex-column uk-flex-center uk-flex-middle" @click="removeProduct(product.variation)" :class="products.length > 1 ? 'uk-background-danger uk-text-white' : 'uk-button-view'">
									<span class="mdi mdi-minus"></span>
								</div>

								<div class="uk-width-expand">
									<h5 class="tiny-margin-bottom uk-text-break uk-text-bold">
										{{product.product_name}}
									</h5>
									<p class="text-small uk-text-truncate uk-margin-remove-bottom">
										{{product.variation_name | capitalize }} &bull; {{product.code}} 

									</p>
									<p class="text-small uk-text-truncate uk-margin-remove-bottom">
										{{product.boundary | pluralize("Unit")}} Available
									</p>
								</div>
								<div style="width: 80px">
									<a-input-number :step="1"  :max="product.boundary" :min="0" v-model.number="product.quantity"></a-input-number>
								</div>
							</div>
							
						</template>

						<template v-else>
							
							<div class="uk-padding uk-flex uk-flex-column uk-flex-middle">
								<span class="mdi mdi-package lni-mid-large"></span>
								<h5 class="uk-text-center uk-margin-small-top">No Product Selected</h5>
								<p class="uk-text-center">
									Select at least one product to submit a stock request. 
								</p>
							</div>
						</template>


						
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-middle uk-flex-center">
						<button class="uk-button uk-button-primary" :disabled="submitting || !filled || products.length < 1" @click.prevent="submitTransferRequest">
							Submit Stock Request
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>

		<vue-final-modal v-model="cancelPrompt" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium uk-flex uk-flex-column">

					<div class="uk-padding-small uk-flex uk-flex-column uk-flex-middle uk-flex-center">
						<h5 class="tiny-margin-bottom uk-text-bold uk-text-center">
							Cancel Transfer?
						</h5>
						<p class="uk-text-small uk-text-center">
							Are you sure you want to cancel this transfer and discard all progress? You will have to start over if you confirm this action.
						</p>


						<div>
							<button class="uk-button uk-button-small uk-background-pinkey uk-text-white" @click="cancelPrompt = false; selectProductsModal = true">
								Go Back
							</button>
							<button class="uk-button uk-button-small uk-button-danger" @click="cancelRequest()">
								Confirm Cancelation.
							</button>
						</div>
					</div>

				</div>
			</div>
		</vue-final-modal>



		<vue-final-modal v-model="successModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" @before-open="selectProductsModal = false">
			<div class="uk-width-1-1 uk-margin-auto-vertical">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large uk-flex uk-flex-column">

					<div class="uk-padding uk-flex uk-flex-column uk-flex-middle uk-flex-center">

						<div class="square-60 uk-border-rounded uk-margin-small-bottom uk-button-view uk-flex uk-flex-column uk-flex-center uk-flex-middle">
							<span class="mdi lni-mid-large mdi-checkbox-multiple-marked uk-text-white"></span>
						</div>

						<p class="uk-text-small uk-text-center">
							Your stock request has been submitted. Head over to the "Stock Requests" section to see the status of this and other stock requests. 
						</p>
						


						<div class="uk-width-1-1 uk-padding-small border-top uk-flex uk-flex-center uk-padding-remove-bottom">
							<button class="uk-button uk-button-danger uk-button tiny-margin-right" @click="cancelRequest()">
								Close
							</button>
							<nuxt-link :to="{name: 'inventory-requests'}" class="uk-button uk-button-primary uk-button">
								View Requests
							</nuxt-link>
						</div>
					</div>

				</div>
			</div>
		</vue-final-modal>

	</div>
</template>
<script>
import request from "@/mixins/requests/initialize"
export default{
	mixins : [request]
};
</script>
