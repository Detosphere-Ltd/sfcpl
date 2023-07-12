<template>
	<div>
		<button class="uk-button uk-button-primary uk-button-small" @click="showModal = true">
			Dispatch Transfer
		</button>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="resetData" @before-open="getTransferDetails(); displayedIndex = 0">
			<div class="uk-width-1-1 uk-margin-medium-top">
				<div class="rounded bordered background raised-deep uk-width-1-1 uk-inline uk-margin-auto uk-width-xlarge@s">
					<template v-if="fetching">
						<div class="uk-padding uk-flex uk-flex-center uk-flex-middle uk-flex-column">
							<loaders-spinner></loaders-spinner>
							<p class="uk-margin-top">
								Loading Transfer Details
							</p>
						</div>
					</template>
					<template v-else>

						<error-parser :errorData="errData" v-if="failed && errData" class="uk-padding">
							<button class="uk-button uk-button-small uk-button-primary" slot="further-action" @click="getTransferDetails()">
								Retry
							</button>
						</error-parser>
						<template v-else>
							<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
								<div>
									<small>
										Manual Transfer
									</small>
									<h5 class="uk-margin-remove uk-text-bold">
										Dispatch Transfer
									</h5>
									<small v-if="transfer.from_transfer_request">Generated from Stock Request</small>
								</div>
								<button class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="processing">
									Cancel
								</button>
							</div>
							<div class="modal-content uk-overflow-auto">
								<div class="uk-padding-small">
									<h4 class="uk-margin-remove-top tiny-margin-bottom">
										You are about dispatch this transfer.
									</h4>
									<p class="uk-margin-remove">
										This stage is for you  to confirm the quantities you want to transfer for each selected product. Dispatch your the transfer when you are okay with your input.
									</p>
								</div>

								<template v-if="transferData.products && transferData.products.length > 0">

									<div class="uk-flex uk-flex-column border-top">
										<div  class="uk-flex uk-flex-middle tiny-padding border-bottom">
											<div class="uk-width-4-5 uk-margin-small-right">
												<h6 class="uk-margin-remove uk-text-capitalize text-small">
													Product
												</h6>
											</div>
											<div class="uk-width-expand">
												<h6 class="uk-margin-remove uk-text-capitalize text-small">
													Quantity
												</h6>
											</div>
										</div>
										<div v-for="(product, productIndex) in transferData.products" :key="productIndex" class="uk-flex uk-flex-column tiny-padding" :class="productIndex < transferData.products.length - 1 ? 'border-bottom uk-margin-small-bottom' : ''">

											<div class="uk-flex uk-flex-top uk-flex-wrap uk-width-1-1">
												<div class="uk-width-expand uk-margin-small-right uk-flex">


													<div class="square-30  uk-border-rounded uk-margin-small-right click uk-flex uk-flex-column uk-flex-center uk-flex-middle" @click="removeProduct(productIndex)" :class="transferData.products.length > 1 ? 'uk-background-danger uk-text-white' : 'uk-button-view'">
														<span class="mdi mdi-minus"></span>
													</div>

													<div class="uk-width-expand uk-flex click"  @click="displayedIndex === productIndex ? displayedIndex = '' : displayedIndex = productIndex">

														<div class="uk-width-expand uk-flex uk-flex-column">
															<h6 class="uk-text-truncate uk-text-capitalize tiny-margin-bottom uk-margin-remove-top">
																{{product.name}}
															</h6>
															<p class="text-small uk-text-capitalize uk-text-truncate uk-margin-remove">
																{{product.variation_name }} &bull; {{product.code }} 
															</p>

															<p class="text-small uk-text-truncate uk-margin-remove">
																{{ getTransferQunatity(productIndex) | pluralize('Unit') }} to be transferred
															</p>




															<div class="uk-width-1-1 tiny-margin-top" v-if="errors && errors[`products.${productIndex}.variation`]">
																<span class="uk-text-danger">
																	{{errors[`products.${productIndex}.variation`][0]}}
																</span>
															</div>


														</div>

														<div class="uk-width-auto uk-text-center tiny-margin-top">
															<div class="square-30 uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-button-view uk-border-circle">
																<span class="mdi uk-text-large" :class="displayedIndex === productIndex ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
															</div>

														</div>
													</div>


												</div>

												<div class="uk-width-1-1" v-if="errors && errors[`products.${productIndex}.quantity`]">
													<span class="uk-text-danger">
														{{errors[`products.${productIndex}.quantity`][0]}}
													</span>
												</div>
											</div>

											<div class="uk-margin-medium-left tiny-padding  uk-padding-remove-top uk-padding-remove-horizontal uk-flex uk-flex-column">

												<div class="ukw-width-1-1 uk-flex uk-animation-slide-bottom-small uk-animation-fast" v-show="displayedIndex === productIndex">
													<div class="border-right"></div>
													<div class="uk-width-expand uk-margin-small-left">

														<div class="uk-width-1-1 uk-flex tiny-padding uk-padding-remove-horizontal" v-for="(instance, instanceIndex) in product.purchases" :key="instance.uuid" :class="instanceIndex < product.purchases.length - 1 ? 'border-bottom' : ''">


															<div class="uk-width-auto uk-margin-small-right tiny-margin-top">
																<div class="label uk-background-danger uk-text-white tiny-margin-bottom click" @click="removeItem(productIndex, instanceIndex)" v-if="product.purchases.length > 1">
																	<small>Remove</small>
																</div>
															</div>
															<div class="uk-width-expand uk-margin-small-right uk-flex uk-flex-column">
																<span v-if="instance.model && instance.model.created_at !== undefined">
																	Purchase recorded on {{$moment(instance.model.created_at).format('DD MMM, YYYY')}}
																</span>
																<span class="uk-text-warning" v-if="instance.model && instance.model.expires_at">
																	Expires on {{$moment(instance.model.expires_at).format('DD MMM, YYYY')}}
																</span>
																<span v-if="instance.model && instance.model.quantity">
																	{{ instance.model.quantity | number('0,0') | pluralize('Unit') }} Available
																</span>

																<span v-if="instance.model && instance.model.supplier.name">
																	{{ instance.model.supplier.name }}
																</span>

																<div class="uk-width-1-1" v-if="errors && errors[`products.${productIndex}.items.${instanceIndex}.quantity`]">
																	<span class="uk-text-danger">
																		{{errors[`products.${productIndex}.items.${instanceIndex}.quantity`][0]}}
																	</span>
																</div>

																<div class="uk-width-1-1" v-if="errors && errors[`products.${productIndex}.items.${instanceIndex}.purchase`]">
																	<span class="uk-text-danger">
																		{{errors[`products.${productIndex}.items.${instanceIndex}.purchase`][0]}}
																	</span>
																</div>
															</div>

															<div style="width: 100px">
																<a-input-number :step="1" :min="0" :max="instance.model.quantity"  v-model="instance.quantity" @focus="$store.dispatch('validation/clearErrors')"></a-input-number>
															</div>
														</div>

													</div>
												</div>
											</div>
										</div>
									</div>
								</template>

								<template v-else>
									<div class="uk-padding uk-text-center bordered uk-border-rounded uk-width-5-6 uk-margin-bottom uk-margin-auto">
										No product available to dispatch. You may cancel this transfer and create a new one with products to be able to dispatch.
									</div>
								</template>
							</div>

							<div class="tiny-padding border-top uk-flex uk-flex-center">
								<button class="uk-button uk-button-primary" :disabled="processing || transferData.products.length < 1" @click="dispatchTransfer">
									<partials-loader v-if="processing"></partials-loader>
									<template v-else>
										Dispatch Transfer
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
import {base, bindProps } from "@/mixins/transfer/singleton"
import {dispatch} from "@/mixins/transfer/actions"
export default{
	mixins : [base, bindProps , dispatch],

	data(){
		return {
			displayedIndex : ''
		}
	}
};
</script>
