<template>
	<div>
		<button class="uk-button uk-button-small uk-button-success uk-text-white" @click="showModal = true">
			Resolve Issue
		</button>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="resetData" @before-open="getTransferDetails">
			<div class="uk-width-1-1 uk-margin-large-top">

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
							<h5 class="uk-margin-remove uk-text-bold">
								Resolve Transfer
							</h5>
							<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="processing">
								Close
							</a>
						</div>

						<div class="tiny-padding border-bottom border-color">
							<div class="uk-width-1-1">
								<h5>
									Transfer {{transfer.total_units | pluralize('unit')}} of {{transfer.total_products | pluralize('product')}}  to Warehouse from 
									<span class="uk-text-capitalize">{{transfer.branch.name | branchize}}</span>  
								</h5>
								<div class="uk-flex uk-flex-wrap uk-flex-middle uk-margin-bottom">
									<span class="uk-label status raised_issue tiny-margin-right issue">
										<span class="text-small uk-text-white">
											Issue Raised
										</span>
									</span>

									<span>
										by {{transfer.current_state.responsible.name}}  on {{$moment(transfer.current_state.created_at).format('DD MMM, YYYY')}} at {{$moment(transfer.current_state.created_at).format('hh:mm a')}}
									</span>
								</div>

								<div class="bordered tiny-padding uk-border-rounded">
									<h6 class="uk-text-uppercase text-small">Comments</h6>
									<p class="uk-margin-remove-bottom">
										{{transfer.current_state.custom_properties.comments}} 
									</p>
								</div>

							</div>
						</div>


						<div class="uk-width-1-1 modal-content uk-overflow-auto">
							<div class="uk-width-1-1">
								<div class="uk-width-1-1">
									<div class="uk-width-1-1 uk-flex uk-flex-column">
										<div class="uk-width-1-1 uk-flex uk-flex-middle tiny-padding" v-for="(p,k) in transferData.products" :key="k" :class="k < transferData.products.length ? 'border-bottom' : ''">
											<div class="uk-width-4-5">
												<h6 class="uk-text-capitalize uk-margin-remove-bottom uk-text-bold">
													{{p.name}}
												</h6>
												<span class="text-small uk-text-capitalize">
													{{p.code}} &bull; {{p.variation_name | variationize}}
												</span>
												<div class="uk-width-1-1" v-if="errors && errors[`products.${k}.variation`]">
													<span class="uk-text-danger">
														{{errors[`products.${k}.variation`][0]}}
													</span>
												</div>
											</div>
											<div class="uk-width-expand uk-margin-small-left uk-flex uk-flex-column">
												<span class="text-small">
													Quantity
												</span>
												<a-input-number :step="1" :max="p.boundary" v-model="transferData.products[k].quantity" @focus="$store.dispatch('validation/clearErrors')">
												</a-input-number>

												<div class="uk-width-1-1" v-if="errors && errors[`products.${k}.quantity`]">
													<span class="uk-text-danger">
														{{errors[`products.${k}.quantity`][0]}}
													</span>
												</div>
											</div>

											
										</div> 
									</div>
								</div>
							</div>
						</div>

						<div class="tiny-padding uk-flex uk-flex-center">

							<button class="uk-button uk-button-small uk-button-success uk-text-white" :disabled="processing" @click="resolveTransfer">
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
