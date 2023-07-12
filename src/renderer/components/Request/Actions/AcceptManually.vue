<template>
	<div>
		<div class="tiny-padding uk-flex uk-flex-column click"  @click="showModal = true">
			<span class="uk-text-bold uk-h4 tiny-margin-bottom">
				Manually Accept Request
			</span>
			<span class="uk-text-small">
				Manually select purchases for the transfer that will be created form this request.
			</span>
		</div>


		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="resetData" @before-open="getTransferDetails">
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
							<button class="uk-button uk-button-small uk-button-primary" slot="further-action" @click="getTransferDetails">
								Retry
							</button>
						</error-parser>
						<template v-else>
							<div class="uk-flex uk-flex-middle tiny-padding border-bottom">

								<div class="square-30 uk-button-view click uk-margin-small-right uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle" @click="showModal = false">
									<span class="mdi mdi-chevron-left lni-large"></span>
								</div>

								<div class="uk-margin-auto-right">
									<small>Manual Mode <template></template></small>
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

										<div style="width: 100px">Quantity</div>
									</div>

									<div v-for="(product, productIndex) in transferData.products" :key="productIndex" class="uk-flex uk-flex-column tiny-padding" :class="productIndex < transferData.products.length - 1 ? 'border-bottom uk-margin-small-bottom' : ''">

										<div class="uk-width-1-1 uk-flex uk-flex-wrap">

											<div class="square-30 uk-margin-small-right tiny-margin-top uk-background-danger uk-border-rounded click uk-flex uk-flex-column uk-flex-center uk-flex-middle" @click="removeProduct(productIndex)">
												<span class="mdi mdi-minus uk-text-white lni-large"></span>
											</div>

											<div class="uk-width-expand tiny-padding uk-padding-remove-top">

												<div class="uk-width-1-1 uk-flex">
													<div class="uk-width-expand">
														<h6 class="uk-text-break uk-text-capitalize tiny-margin-bottom uk-margin-remove-top">
															{{product.name}}
														</h6>
														<p class="text-small uk-text-truncate uk-margin-remove">
															{{product.variation_name | capitalize }} &bull; {{product.code}}
														</p>


														<p class="text-small uk-text-capitalize uk-text-truncate uk-margin-remove">
															{{ product.boundary | pluralize('Unit') }} Requested 

															<template v-if="product.available_batches && product.available_batches.length > 0">
																&bull; {{ getTotalQuantity(productIndex) | pluralize('Unit') }} to be dispatched 
															</template>
														</p>

														<p class="text-small uk-margin-remove uk-text-danger" v-if="(product.available_batches && product.available_batches.length < 1)">
															You do not have any stock for this product at the moment. You can remove it from the request.
														</p>

														<p class="text-small uk-text-danger uk-margin-remove" v-else-if="(errors && errors[`products.${productIndex}.items`]) && visibleIndex !== productIndex">
															There are some errors with your selection. Expand product to see more details 
														</p>
													</div>

													<div class="square-30 uk-button-view uk-margin-small-left uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle click" @click="visibleIndex === productIndex ? visibleIndex = undefined : visibleIndex = productIndex" v-if="product.available_batches && product.available_batches.length > 0">
														<span class="mdi lni-large" :class="visibleIndex === productIndex ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
													</div>
												</div>



												<div v-show="visibleIndex === productIndex">
													<div class="tags-input  uk-margin-auto-left tiny-padding uk-padding-remove-horizontal uk-width-1-1">
														<a-select mode="multiple" v-model="product.batches" class="uk-width-1-1" placeholder="Select batches for this transfer" size="large" notFoundContent="No purchases available for selection" show-arrow option-label-prop="title" :max-tag-count="0" :maxTagPlaceholder="`${product.batches.length} purchases selected`" @focus="$store.dispatch('validation/clearErrors')">
															<template v-for="(batch, batchIndex) in product.available_batches">
																<a-select-option :key="`batch-{$batchIndex}`" v-if="!product.batches.includes(batch.uuid)" :value="batch.uuid" :title="$moment(batch.created_at).format('DD MMMM, YYYY')"> 
																	Purchased on {{$moment(batch.created_at).format('DD MMM, YYYY')}}

																	<template v-if="batch && batch.expires_at !== undefined">
																		<br> Expires on {{$moment(batch.expires_at).format('DD MMMM, YYYY')}}
																	</template>
																	<br> {{batch.boundary | number('0,0') | pluralize('Unit') }} Available 

																	<template v-if="batch.supplier && batch.supplier.name !== undefined">
																		<br> {{batch.supplier.name}}
																	</template>
																	<hr class="tiny-margin-top tiny-margin-bottom">

																</a-select-option>
															</template>

														</a-select>


														<div class="uk-flex uk-flex-column">

															<div class="ukw-width-1-1 uk-flex uk-animation-slide-bottom-small uk-animation-fast">
																<div class="border-right"></div>
																<div class="uk-width-expand uk-margin-small-left">

																	<p class="text-small uk-text-danger uk-margin-remove" v-if="(errors && errors[`products.${productIndex}.items`])  && product.batches.length < 1">
																		You are required to select batches for this product
																	</p>

																	<div class="uk-width-1-1 uk-flex tiny-padding uk-padding-remove-horizontal" v-for="(instance, instanceIndex) in product.available_batches.filter(item => {return product.batches.includes(item.uuid)})" :key="instance.uuid">


																		<div class="uk-width-auto uk-margin-small-right tiny-margin-top">
																			<div class="label uk-background-danger uk-text-white tiny-margin-bottom click" @click="product.batches = product.batches.filter(iterant => {return iterant !== instance.uuid })">
																				<small>Remove</small>
																			</div>
																		</div>
																		<div class="uk-width-expand uk-margin-small-right uk-flex uk-flex-column">
																			<span v-if="instance.batch_no !== undefined">
																				{{instance.batch_no}}
																			</span>
																			<span v-if="instance.created_at !== undefined">
																				Received on {{$moment(instance.created_at).format('DD MMM, YYYY')}}
																			</span>
																			<span class="uk-text-warning" v-if="instance.purchase && instance.purchase.expires_at !== undefined">
																				Expires on {{$moment(instance.expires_at).format('DD MMM, YYYY')}}
																			</span>
																			<span v-if="instance && instance.boundary !== undefined">
																				{{ instance.boundary | number('0,0') | pluralize('Unit') }} Available
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

																		<div style="width: 80px">
																			<a-input-number :step="1" :min="0" :max="instance.boundary"  v-model="instance.quantity" @focus="$store.dispatch('validation/clearErrors')"></a-input-number>
																		</div>
																	</div>

																</div>
															</div>
														</div> 


													</div>

													<p class="text-small uk-margin-remove uk-text-warning" v-if="getTotalQuantity(productIndex) > product.boundary">
														<span class="uk-text-bold uk-text-warning">Friendly Warning!</span> You have entered a value larger than what was requested for this product.
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div class="uk-padding-small border-top uk-flex uk-flex-center">
								<button class="uk-button uk-button uk-button-success uk-text-white" :disabled="processing" @click="acceptManually()">
									<partials-loader v-if="processing"></partials-loader>
									<template v-else>
										Accept Request 
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
	mixins : [base, bindProps , accept],

	data(){
		return {
			visibleIndex : undefined
		}
	}
};
</script>
