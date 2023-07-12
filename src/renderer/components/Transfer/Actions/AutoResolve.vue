<template>
	<div>
		<button class="uk-button uk-button-small uk-button-success uk-text-white" @click="showModal = true">
			Resolve Issue
		</button>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="resetData" @before-open="getTransferDetails">
			<div class="uk-width-1-1 uk-margin-top">

				<div v-if="fetching" class="uk-flex uk-flex-column uk-flex-middle uk-padding bordered background rounded uk-width-medium">
					<loaders-spinner></loaders-spinner>
					<p class="uk-margin-top">
						Loading Transfered Products
					</p>
				</div>

				<template  v-else>

					<div class="uk-padding bordered background rounded uk-width-medium" v-if="failed && errData">
						<error-parser :errorData="errData">
							<div slot="further-action">

								<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="processing">
									Cancel
								</a>
								<button class="uk-button uk-button-small uk-button-primary" @click="getTransferDetails" >
									Retry
								</button>
							</div>

						</error-parser>
					</div>

					<div class="uk-width-large background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast  uk-margin-auto" v-else>


						<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
							<div class="uk-flex uk-flex-column">
								
								<h5 class="uk-margin-remove uk-text-bold">
									Resolve Transfer
								</h5>
								<small class="uk-text-capitalize">
									{{transfer.type}} Transfer <template v-if="transfer.from_transfer_request"> &bull; Generated from Stock Request</template>
								</small>
							</div>
							<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="processing">
								Cancel
							</a>
						</div>

						<div class="modal-content uk-overflow-auto uk-width-1-1">
							
							<div class="tiny-padding border-bottom">
								<div class="uk-width-1-1 uk-flex uk-flex-column">
									<span class="label status raised_issue uk-margin-auto-right uk-margin-small-bottom issue">
										<span>
											Issue Raised
										</span>
									</span>
									<p class="tiny-margin-bottom">
										{{transfer.current_state.responsible.name}} reported an issue <br> On {{$moment(transfer.current_state.created_at).format('DD MMM, YYYY')}} at {{$moment(transfer.current_state.created_at).format('hh:mm a')}}
									</p>


									<div class="uk-margin-small-top tiny-padding uk-button-view uk-border-rounded">
										<span class="text-small">Comments</span>
										<p class="uk-margin-remove">
											{{transfer.current_state.custom_properties.comments}} 
										</p>
									</div>

									<p class="uk-margin-small-top">
										You are required to review this transfer to make sure the issue raised has been addressed. Hit "Resolve Transfer Issue" when you are done with your review.
									</p>

								</div>
							</div>


							<div class="uk-width-1-1 uk-flex uk-flex-column">

								<div class="uk-flex uk-flex-between tiny-padding border-bottom">
									<span class="uk-text-bold">
										Product
									</span>

									<span class="uk-text-bold uk-margin-small-right">
										Quantity
									</span>
								</div>
								<div class="uk-width-1-1 uk-flex uk-flex-middle tiny-padding" v-for="(product, productIndex) in transferData.products" :key="productIndex" :class="productIndex < transferData.products.length ? 'border-bottom' : ''">

									<div class="square-30 uk-border-rounded uk-background-danger uk-margin-small-right click uk-flex uk-flex-column uk-flex-center uk-flex-middle" @click="removeProduct(productIndex)">
										<span class="mdi mdi-minus uk-text-white"></span>
									</div>

									<div class="uk-width-expand">
										<h6 class="uk-text-capitalize uk-margin-remove-bottom uk-text-bold">
											{{product.name}}
										</h6>
										<span class="text-small uk-text-capitalize">
											{{product.boundary }} Available
										</span>
										<span class="text-small uk-text-capitalize">
											{{product.variation_name }} &bull; {{product.code}}
										</span>

										<span class="text-small uk-text-capitalize">
											{{product.variation_name }} &bull; {{product.code}}
										</span>
										<div class="uk-width-1-1" v-if="errors && errors[`products.${productIndex}.variation`]">
											<span class="uk-text-danger">
												{{errors[`products.${productIndex}.variation`][0]}}
											</span>
										</div>
									</div>
									<div class="uk-margin-small-left uk-flex uk-flex-column" style="width: 80px">
										<a-input-number :step="1" :max="product.boundary" v-model="transferData.products[productIndex].quantity" @focus="$store.dispatch('validation/clearErrors')">
										</a-input-number>

										<div class="uk-width-1-1" v-if="errors && errors[`products.${productIndex}.quantity`]">
											<span class="uk-text-danger">
												{{errors[`products.${productIndex}.quantity`][0]}}
											</span>
										</div>
									</div>


								</div> 
							</div>
						</div>



						<div class="tiny-padding uk-flex uk-flex-center border-top">

							<button class="uk-button uk-button-success uk-text-white" :disabled="processing" @click="autoResolve">
								<partials-loader v-if="processing"></partials-loader>
								<template v-else>
									Resolve Transfer Issue
								</template>
							</button>
						</div>


					</div>



				</template>

			</div>


		</vue-final-modal>
	</div>
</template>
<script>

import {bindProps , base} from "@/mixins/transfer/singleton"
import {resolve} from "@/mixins/transfer/actions"
export default{
	mixins : [bindProps , base, resolve],
};
</script>
