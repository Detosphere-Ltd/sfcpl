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
							<p>
								Loading Transfer Details
							</p>
						</div>
					</template>
					<template v-else>

						<error-parser :errorData="errData" v-if="failed && errData" class="uk-padding">
							<template  #further-action>
								<div>
									<button class="uk-button uk-button-small uk-button-danger" @click="showModal = false" :disabled="processing">
										Cancel
									</button>

									<button class="uk-button uk-button-small uk-button-primary" @click="getTransferDetails()">
										Retry
									</button>
								</div>
							</template>
						</error-parser>

						<template v-else>
							<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
								<div>
									<small>
										Automatic Transfer <template v-if="transfer.from_transfer_request"> &bull; Generated from Stock Request</template>
									</small>
									<h5 class="uk-margin-remove uk-text-bold">
										Dispatch Transfer
									</h5>
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

											<div class="square-30 uk-background-danger uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-border-rounded click uk-margin-small-right tiny-margin-top" @click="removeProduct(productIndex)">
												<span class="mdi mdi-minus uk-text-white uk-text-large"></span>
											</div>

											<div class="uk-width-expand uk-margin-small-right uk-flex uk-flex-column">
												<h6 class="uk-text-break uk-text-capitalize tiny-margin-bottom uk-margin-remove-top">
													{{product.name}}
												</h6>
												<p class="text-small uk-text-truncate uk-margin-remove">
													{{product.variation_name | capitalize }} &bull; {{product.code }} 
												</p>

												<p class="text-small uk-text-truncate uk-margin-remove">
													{{ product.quantity | pluralize('Unit') }} to be transferred
												</p>

												<div class="uk-width-1-1 tiny-margin-top" v-if="errors && errors[`products.${productIndex}.variation`]">
													<span class="uk-text-danger">
														{{errors[`products.${productIndex}.variation`][0]}}
													</span>
												</div>


											</div>
											<div class="tiny-margin-top" style="width: 80px">
												<a-input-number :min="0" :step="1" :max="product.boundary" v-model="transferData.products[productIndex].quantity" @focus="$store.dispatch('validation/clearErrors')"></a-input-number>
											</div>

											<div class="square-30 uk-margin-small-left uk-flex uk-flex-column uk-flex-center uk-flex-middle click tiny-margin-top uk-border-rounded uk-button-view" @click="displayedIndex === productIndex ? displayedIndex = '' : displayedIndex = productIndex">
												<span class="mdi uk-text-large" :class="displayedIndex === productIndex ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
											</div>
											
										</div>


										<div class="uk-width-1-1" v-if="errors && errors[`products.${productIndex}.quantity`]">
											<span class="uk-text-danger">
												{{errors[`products.${productIndex}.quantity`][0]}}
											</span>
										</div>

										<div class="ukw-width-1-1 uk-flex uk-animation-slide-bottom-small uk-animation-fast" v-show="displayedIndex === productIndex">
											<div class="border-right"></div>
											<div class="uk-width-expand uk-margin-small-left tiny-padding uk-padding-remove-horizontal uk-padding-remove-bottom">
												<table class="uk-table uk-table-middle uk-table-justify uk-table-small uk-table-divider">
													<thead>
														<tr class="border-bottom">
															<th>
																<span class="text-small-spaced uk-text-uppercase">			
																	Purchase Date
																</span>
															</th>
															<th>
																<span class="text-small-spaced uk-text-uppercase">			
																	Expiry Date
																</span>
															</th>
															<th>
																<span class="text-small-spaced uk-text-uppercase">			
																	Transfer Qty.
																</span>
															</th>
															<th class="uk-table-expand">
																<span class="text-small-spaced uk-text-uppercase">			
																	Supplier
																</span>
															</th>
														</tr>
													</thead>
													<tbody>
														<tr v-for="(instance, instanceIndex) in product.purchases" :key="instance.uuid" :class="instanceIndex < product.purchases ? 'border-bottom' : ''">
															<td>
																<span class="text-small">
																	{{$moment(instance.model.created_at).format('D-MMM-YYYY')}}
																</span>
															</td>
															<td>
																<span class="text-small">
																	{{ instance.model.expires_at ? $moment(instance.model.expires_at).format('D-MMM-YYYY') : '- - -' }}
																</span>
															</td>
															<td>
																<span class="text-small">
																	{{instance.quantity_transferred | number('0,0') | pluralize('Unit')}}
																</span>
															</td>

															<td>
																<span class="text-small">
																	{{instance.model && instance.model.supplier.name !== undefined ? instance.model.supplier.name : 'Unknown Supplier' }}
																</span>
															</td>

														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div class="tiny-padding border-top uk-flex uk-flex-center">
								<button class="uk-button uk-button-primary" :disabled="processing" @click="dispatchAuto()">
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
