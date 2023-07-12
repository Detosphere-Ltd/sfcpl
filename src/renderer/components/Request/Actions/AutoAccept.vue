<template>
	<div>
		<div class="tiny-padding uk-flex uk-flex-column click"  @click="showModal = true">
			<span class="uk-text-bold uk-h4 tiny-margin-bottom">
				Auto Accept Request
			</span>
			<span class="uk-text-small">
				Allow {{$appName}} to automatically select purchases for the transfer that will be created form this request using the FIFO (First-In-First-Out) approach.
			</span>
		</div>


		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="resetData" @before-open="getTransferDetails()">
			<div class="uk-width-1-1 uk-margin-top">
				<div class="rounded bordered background raised-deep uk-width-1-1 uk-inline uk-margin-auto uk-width-large@s">
					<template v-if="fetching">
						<div class="uk-padding uk-flex uk-flex-center uk-flex-middle uk-flex-column">
							<loaders-spinner></loaders-spinner>
							<p class="uk-margin-top">
								Loading request Details
							</p>
						</div>
					</template>
					<template v-else>

						<error-parser :errorData="errData" v-if="failed && errData" class="uk-padding">
							<template #further-action>
								<div>
									<button class="uk-button uk-button-danger" @click="showModal = false">
										Cancel
									</button>

									<button class="uk-button uk-button-primary" @click="getTransferDetails()">
										Retry
									</button>
								</div>
							</template>
						</error-parser>
						<template v-else>
							<div class="uk-flex uk-flex-middle tiny-padding border-bottom">

								<div class="square-30 uk-button-view click uk-margin-small-right uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle" @click="showModal = false">
									<span class="mdi mdi-chevron-left lni-mid-large"></span>
								</div>

								<div class="uk-margin-auto-right">
									<small>Automatic Transfer</small>
									<h5 class="uk-margin-remove uk-text-bold">
										Accept Request 
									</h5>
								</div>
								<button class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false; $emit('emptied')" :disabled="processing">
									Cancel
								</button>
							</div>
							<div>

								<div class="uk-padding-small">
									<p class="uk-margin-remove">
										Confirm the quantities to transfer for each requested product.
									</p>
								</div>

								<div class="uk-flex uk-flex-column border-top modal-content uk-overflow-auto">
									<div class="tiny-padding background tiny-margin-bottom uk-flex uk-flex-between uk-flex-middle border-bottom">
										<div class="uk-width-expand">Product</div>

										<div style="width: 80px">Quantity</div>
									</div>

									<div v-for="(product, productIndex) in transferData.products" :key="productIndex" class="uk-flex uk-flex-top uk-flex-wrap tiny-padding" :class="productIndex < transferData.products.length - 1 ? 'border-bottom uk-margin-small-bottom' : ''">

										<div class="square-30 uk-margin-small-right tiny-margin-top uk-background-danger uk-border-rounded click uk-flex uk-flex-column uk-flex-center uk-flex-middle" @click="removeProduct(productIndex)">
											<span class="mdi mdi-minus uk-text-white lni-large"></span>
										</div>

										<div class="uk-width-expand tiny-padding uk-padding-remove-top">
											<h6 class="uk-text-break uk-text-capitalize tiny-margin-bottom uk-margin-remove-top">
												{{product.name}}
											</h6>
											<p class="text-small uk-text-truncate uk-margin-remove">
												{{product.variation_name | capitalize}} &bull; {{product.code}}
											</p>


											<p class="text-small uk-text-capitalize uk-text-truncate uk-margin-remove">
												{{ product.boundary | pluralize('Unit') }} Requested &bull; {{ product.available | pluralize('Unit') }} Available
											</p>

											<p class="tiny-margin-top uk-margin-remove-bottom text-small uk-text-danger" v-if="errors && errors[`products.${productIndex}.variation`]">
												{{errors[`products.${productIndex}.variation`][0]}}
											</p>

											<p class="tiny-margin-top uk-margin-remove-bottom text-small uk-text-danger" v-if="errors && errors[`products.${productIndex}.quantity`]">
												{{errors[`products.${productIndex}.quantity`][0]}}
											</p>
										</div>

										<div class="tiny-margin-right tiny-margin-top" style="width: 80px">
											<a-input-number v-model="product.quantity" :step="1" :min="0" :max="product.boundary" @focus="$store.dispatch('validation/clearErrors')"></a-input-number>
										</div>
									</div>
								</div>
							</div>

							<div class="uk-padding-small border-top uk-flex uk-flex-center">
								<button class="uk-button uk-button uk-button-success uk-text-white" :disabled="processing" @click="autoAccept">
									<partials-loader v-if="processing"></partials-loader>
									<template v-else>
										Accept Request & Create Transfer
									</template>
								</button>
							</div>
						</template>

					</template>

				</div>
			</div>
		</vue-final-modal>
	</div>
</template>

<script>
import {base, bindProps , accept} from "@/mixins/requests/singleton"
export default{
	mixins : [base, bindProps , accept]
};
</script>
