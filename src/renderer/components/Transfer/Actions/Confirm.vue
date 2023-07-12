<template>
	<div>
		
		<button class="uk-button uk-button-success uk-button-small uk-text-white" @click="showModal = true">
			Accept Transfer
		</button>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="resetData" @before-open="getTransferDetails">
			<div class="uk-width-1-1 uk-margin-top">
				<div class="rounded bordered background raised-deep uk-width-1-1 uk-inline uk-margin-auto uk-width-large@s">
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
						</error-parser>
						<template v-else>
							<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
								<div>
									<small class="uk-text-capitalize">{{transfer.type}} Transfer</small>
									<h5 class="uk-margin-remove uk-text-bold">
										Accept Transfer
									</h5>
									<small v-if="transfer.from_transfer_request">Generated from Stock Request</small>
								</div>
								<button class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="processing">
									Cancel
								</button>
							</div>
							<div class="uk-width-1-1 modal-content uk-overflow-auto">
								

								<div class="uk-padding-small">
									<h4 class="uk-margin-remove-top tiny-margin-bottom">
										You are about accept this transfer.
									</h4>
									<p class="uk-margin-remove">
										Ensure the quantities received match what was dispatched. Raise an issue if necessary. The Warehouse stock will be updated after you receive this transfer.
									</p>


									<div class="uk-flex uk-margin-small-top">
										<transfer-actions-details :transfer="transfer" :tab="'products'">
											<template #action-button>
												View Transfer Details
											</template>
										</transfer-actions-details>
									</div>
								</div>

								<div class="tiny-padding uk-padding-remove-horizontal uk-flex uk-flex-column border-top ">
									<div  class="uk-flex uk-flex-middle tiny-padding">
										<h6 class="uk-margin-remove uk-text-uppercase text-small">
											Transferred Products List
										</h6>
										
									</div>
									<div v-for="(product, productIndex) in transferData.products" :key="productIndex" class="uk-flex uk-flex-middle uk-flex-wrap" :class="productIndex < transferData.products.length - 1 ? 'border-bottom uk-margin-small-bottom' : ''">
										<div class="uk-width-1-1 tiny-padding uk-padding-remove-top uk-flex">
											<div class="square-30 uk-button-view uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle">
												{{productIndex+1}}
											</div>
											<div class="uk-width-expand uk-margin-small-left">
												<h6 class="uk-text-truncate uk-text-capitalize tiny-margin-bottom uk-margin-remove-top">
													{{product.name}}
												</h6>
												<p class="text-small uk-text-capitalize uk-text-truncate uk-margin-remove-top tiny-margin-bottom">			{{product.variation_name }} &bull; {{product.code}}
												</p>
												<p class="text-small uk-text-capitalize uk-text-truncate uk-margin-remove">	
													{{product.quantity | pluralize('Unit')}}  {{transfer.status === 'confirmed' ? 'Received' : 'Dispatched'}} 
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div class="tiny-padding border-top uk-flex uk-flex-center">
								<button class="uk-button uk-button-success uk-text-white" :disabled="processing" @click="confirmTransfer">
									<partials-loader v-if="processing"></partials-loader>
									<template v-else>
										Accept Transfer
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
import {base, bindProps} from "@/mixins/transfer/singleton"
import {confirm} from "@/mixins/transfer/actions"
export default{
	mixins : [base, bindProps , confirm],
};
</script>
