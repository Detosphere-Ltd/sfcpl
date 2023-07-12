<template>
	<div>
		<div class="uk-padding-small uk-padding-remove-horizontal uk-flex uk-flex-wrap">
			<div class="uk-width-1-1 tiny-padding uk-padding-remove-vertical uk-flex uk-flex-middle">
				
				<nuxt-link class="uk-margin-right highlight-text underlined uk-h6 uk-margin-remove-vertical" :to="{name: 'inventory-product-purchases', params : {product: purchase.product_variation.product.uuid} }" v-if="can('view-purchases')">
					{{purchase.product_variation.product.name}} {{purchase.product_variation.variation.name}} {{purchase.product_variation.code}}
				</nuxt-link>

				<h6 class="uk-margin-remove-vertical" v-else>
					{{purchase.product_variation.product.name}}
				</h6>

				
			</div>

			<div class="uk-width-1-1 uk-flex uk-flex-middle tiny-padding uk-padding-remove-bottom">
				<div class="grid-gutter uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{purchase.quantity | number('0,0')}} 	{{purchase.quantity | pluralize("Unit") }}
					</p>
				</div>
				<div class="grid-gutter uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{purchase.cost_price | currency(`${emporium.currency} `)}}
					</p>
				</div>
				<div class="grid-gutter uk-width-small">
					<div class="uk-width-1-1 uk-flex uk-flex-middle">
						<div class="tiny-margin-right click" @click="loadModal = true" v-if="can('view-purchases')">
							<span class="mdi mdi-information uk-text-primary lni-large"></span>
						</div>
						<p class="uk-text-truncate uk-margin-remove-vertical uk-text-capitalize text-small uk-width-expand">
							{{purchase.amount_paid | currency(`${emporium.currency} `)}}
						</p>

						
					</div>
				</div>
				<div class="grid-gutter uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small" :class="{ 'uk-text-danger uk-text-bold' : purchase.amount_outstanding}">
						{{purchase.amount_outstanding | currency(`${emporium.currency} `)}}
					</p>
				</div>

				<div class="grid-gutter uk-width-small uk-visible@xl">
					<p class="uk-text-truncate uk-margin-remove" v-if="purchase.supplier && purchase.supplier.name !== undefined">
						<nuxt-link :to="{name: 'suppliers-supplier', params : {supplier: purchase.supplier.uuid}}" class="highlight-text underlined">
							{{purchase.supplier.name | truncate(15)}}
						</nuxt-link>
					</p>

					<p v-else class="uk-margin-remove">
						N/A
					</p>
				</div>

				<div class="grid-gutter uk-width-small uk-visible@xl">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{purchase.discount_received | currency(`${emporium.currency} `)}}
					</p>
				</div>


				<div class="grid-gutter uk-width-x-small uk-flex uk-flex-center tiny-margin-right">
					<span class="label" :class="purchase.is_reversed ? 'label-danger' : 'label-success'">
						<span>
							{{purchase.is_reversed ? 'Reversed' : 'Valid'}}
						</span>
					</span>
				</div>




				<div class="grid-gutter uk-width-x-small tiny-margin-right uk-flex uk-flex-center">
					<purchase-health :purchase="purchase" v-if="purchase.expires_at"></purchase-health>
					<template v-else>
						- - -
					</template>
				</div>



				<div class="grid-gutter uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{$moment(purchase.created_at).format('DD MMM, YYYY')}}
					</p>
				</div>

				<div class="grid-gutter uk-visible@xl uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{ purchase.created_by && purchase.created_by.name ? purchase.created_by.name : 'System Admin'  }}
					</p>
				</div>

				<div class="grid-gutter uk-width-small uk-margin-auto-left">
					<div class="uk-flex uk-flex-right uk-flex-middle">
						
						<template v-if="!purchase.is_reversed">
							<product-purchase-actions-reverse :purchase="purchase" @done="$emit('needs-to-refresh')" v-if="can('reverse-purchases')">
								<div class="chip uk-button-danger uk-border-rounded click" slot="action-button">
									<span class="text-small uk-text-white">
										Reverse
									</span>
								</div>
							</product-purchase-actions-reverse>

							<product-purchase-actions-repay :purchase="purchase" @done="$emit('needs-to-refresh')" v-if="can('record-purchase-payment') && purchase.amount_outstanding">
								<div class="chip uk-button-primary tiny-margin-left uk-border-rounded click" slot="action-button">
									<span class="text-small uk-text-white">
										Pay
									</span>
								</div>
							</product-purchase-actions-repay>

							<!-- <div class="square-30 tiny-margin-left  uk-button-view uk-border-rounded"></div> -->
						</template>

						<template v-else>
							<div class="chip uk-background-danger-op uk-border-rounded click uk-text-truncate" @click="reasonModal = true">
								<span class="text-small uk-text-truncate">Reversal Reason</span>
							</div>
						</template>
					</div>
				</div>

			</div>

		</div>


		<vue-final-modal v-model="reasonModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium@s uk-overflow-auto modal-content">

					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom uk-width-1-1">
						<h5 class="uk-margin-remove uk-text-bold">
							Reversal Info
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="reasonModal = false" >
							Close
						</a>

					</div>

					<div class="uk-padding-small">
						<p>
							This purchase was reversed by {{purchase.reversed_by.name}} on {{$moment(purchase.reversed_at).format("DD MMM, YYYY ")}} at {{$moment(purchase.reversed_at).format("hh:mm a")}}.
						</p>
						<h6 class="text-small">
							Reason Provided Was
						</h6>
						<p>
							{{purchase.reversal_reason}}
						</p>
					</div>

				</div>
			</div>
		</vue-final-modal>

		<vue-final-modal v-model="loadModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" @before-open="getPurchaseDetails">
			<div class="uk-card rounded bordered background raised-deep uk-margin-auto uk-width-1-1 uk-inline  uk-width-1-1 uk-width-medium">
				<div class="uk-padding uk-flex uk-flex-column uk-flex-middle">
					<template v-if="fetching">
						<loaders-spinner></loaders-spinner>
						<p class="uk-text-center uk-margin-small-top">
							Loading purchase details....
						</p>
					</template>

					<template v-else>
						<error-parser v-if="failed && errData !== undefined" :errorData="errData">
							<div slot="further-action">
								<button class="uk-button uk-button-small uk-button-danger" @click="loadModal = false" >
									Close
								</button>
								<button class="uk-button uk-button-small uk-button-primary" @click="getPurchaseDetails">
									Retry
								</button>
							</div>
						</error-parser>
					</template>
				</div>
			</div>
		</vue-final-modal>

		<vue-final-modal v-model="detailsModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" v-if="purchaseDetails">
			<div class="uk-card rounded bordered background raised-deep uk-margin-auto uk-margin-auto-vertical uk-width-large">
				<div class="tiny-padding uk-flex uk-flex-middle border-bottom">
					<partials-avatar class="tiny-margin-right" v-if="purchaseDetails.created_by && purchaseDetails.created_by.avatar" :media="purchaseDetails.created_by.avatar" size="25"></partials-avatar>
					<span>
						Purchase Recorded By {{purchaseDetails.created_by.name}} 
					</span>
				</div>
				<div class="uk-width-1-1 uk-flex border-bottom">
					<div class="uk-width-1-3@m grid-padding uk-text-center click" :class="showing === 'DETAILS' ? 'tabActive' : ''" @click="showing = 'DETAILS'">
						Purchase Details
					</div>
					<div class="uk-width-1-3@m grid-padding uk-text-center click" :class="showing === 'PAYMENTS' ? 'tabActive' : ''" @click="showing = 'PAYMENTS'">
						Payment Info
					</div>

					<div class="uk-width-1-3@m grid-padding uk-text-center click" :class="showing === 'ATTRIBUTES' ? 'tabActive' : ''" @click="showing = 'ATTRIBUTES'">
						Custom Attributes
					</div>
				</div>
				<div class="uk-width-1-1 modal-content uk-overflow-auto">


					<div class="tiny-padding" v-if="showing === 'DETAILS'" :key="showing">


						<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
							<div class="uk-width-expand" uk-leader>Product</div>
							<div>{{purchaseDetails.product_variation.product.name}} ({{purchaseDetails.product_variation.product.code}})</div>
						</div>

						<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
							<div class="uk-width-expand" uk-leader>Variation</div>
							<div>{{purchaseDetails.product_variation.variation.name}}({{purchaseDetails.product_variation.variation.code}})</div>
						</div>

						<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
							<div class="uk-width-expand" uk-leader>Quantity Purchased</div>
							<div>{{purchaseDetails.quantity | pluralize('Unit')}}</div>
						</div>

						<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
							<div class="uk-width-expand" uk-leader>Date</div>
							<div>{{$moment(purchaseDetails.created_at).format('DD MMM, YYYY')}} at {{$moment(purchaseDetails.created_at).format('hh:mm A')}}</div>
						</div>

						<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
							<div class="uk-width-expand" uk-leader>Cost Price</div>
							<div>{{purchaseDetails.cost_price | currency(`${emporium.currency} `)}}</div>
						</div>


						<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
							<div class="uk-width-expand" uk-leader>Amount Paid</div>
							<div>{{purchaseDetails.amount_paid | currency(`${emporium.currency} `)}}</div>
						</div>

						<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
							<div class="uk-width-expand" uk-leader>Discount Received</div>
							<div>{{purchaseDetails.discount_received | currency(`${emporium.currency} `)}}</div>
						</div>

						<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
							<div class="uk-width-expand" uk-leader>Debt</div>
							<div>{{purchaseDetails.amount_outstanding | currency(`${emporium.currency} `)}}</div>
						</div>
						<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
							<div class="uk-width-expand" uk-leader>Supplier</div>
							<div>{{purchaseDetails.supplier && purchaseDetails.supplier.name  ? purchaseDetails.supplier.name : 'Unknown'}}</div>
						</div>

						<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
							<div class="uk-width-expand" uk-leader>Status</div>
							<div :class="{'uk-text-danger' : purchaseDetails.is_reversed}">{{purchaseDetails.is_reversed ?  'Reversed' : 'Valid'}} Purchase</div>
						</div>


						<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
							<div class="uk-width-expand" uk-leader>Purchase Unit</div>
							<div>{{purchaseDetails.unit_type && purchaseDetails.unit_type.name ? purchaseDetails.unit_type.name : 'N/A' }}</div>
							
						</div>
					</div>

					<div class="tiny-padding uk-width-1-1" v-else-if="showing === 'PAYMENTS'">
						

						<div class="uk-flex uk-flex-column uk-width-1-1" v-if="purchaseDetails.payments.length > 0">
							<div v-for="(payment, key) in purchaseDetails.payments" class="uk-width-1-1 uk-flex grid-padding uk-padding-remove-horizontal" :key="key" :class="key < purchaseDetails.payments.length - 1 ? 'border-bottom uk-margin-small-bottom' : ''">
								<div class="square-25 uk-border-rounded bordered uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right">
									<span class="text-small uk-text-bold">{{key+1}}</span>
								</div>

								<div class="uk-width-expand">
									<div class="uk-width-1-1 uk-flex uk-flex-column">
										<div class="uk-width-1-1 uk-flex uk-flex-between">
											<h5 class="uk-text-bold uk-margin-remove uk-width-expand">
												{{payment.amount | currency(`${emporium.currency} `)}}
											</h5>

											<product-purchase-actions-reverse-payment :purchase="purchase" :payment="payment" @done="detailsModal = false; loadModal = true; $emit('needs-to-refresh')" v-if="can('reverse-purchase-payment') && !payment.is_reversed">
												<div class="chip uk-button-danger tiny-margin-right uk-border-rounded click tiny-margin-right" slot="action-button">
													<span class="text-small uk-text-white">
														Reverse This Payment
													</span>
												</div>
											</product-purchase-actions-reverse-payment>



										</div>
										<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
											<div class="uk-width-expand" uk-leader>Payment Mode</div>
											<div class="uk-text-capitalize">{{ payment.payment_mode }}</div>
										</div>

										<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
											<div class="uk-width-expand" uk-leader>Reference</div>
											<div>{{ payment.reference_no ? payment.reference_no : 'N/A'}}</div>
										</div>

										<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
											<div class="uk-width-expand" uk-leader>Date</div>
											<div>{{$moment(payment.created_at).format('DD MMM, YYYY')}} at {{$moment(payment.created_at).format('hh:mm A')}}</div>
										</div>

										<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
											<div class="uk-width-expand" uk-leader>Recorded by.</div>
											<div>{{payment.created_by && payment.created_by.name  ? payment.created_by.name : 'Unknown'}}</div>
										</div>

										<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
											<div class="uk-width-expand" uk-leader>Payment Status</div>
											<div>
												<template v-if="payment.is_reversed">
													<product-purchase-actions-reverse-payment :purchase="purchase" :payment="payment">
														<div class="status uk-background-danger-op tiny-margin-right uk-border-rounded click tiny-margin-right" slot="action-button">
															<span class="text-small">
																Reversed. Click to See Reason
															</span>
														</div>
													</product-purchase-actions-reverse-payment>
												</template>
												<template v-else>
													<div class="status uk-background-success-op">
														<span class="text-small">Valid Payment</span>
													</div>
												</template>
											</div>
										</div>

										<!-- 


										-->

									</div>
								</div>
							</div>
						</div>

						<div class="uk-flex uk-flex-column uk-flex-middle"  v-else>

							<div class="square-60 uk-border-circle top-top uk-margin-small-bottom uk-flex uk-flex-middle uk-flex-center uk-flex-column">
								<span class="mdi mdi-cash-remove lni-mid-large"></span>
							</div>
							<h5 class="uk-text-center">
								No Records
							</h5>
							<p class="uk-text-center uk-margin-remove">
								No payment records found for this purchase.
							</p>
						</div>
					</div>

					<div class="tiny-padding" v-else>
						<div v-if="purchaseDetails.custom_attributes && Object.keys(purchaseDetails.custom_attributes).length > 0">
							<template v-for="(attribute, key, index) in purchaseDetails.custom_attributes">
								<div class="tiny-padding uk-flex uk-flex-column" :key="key" :class="index < Object.keys(purchaseDetails.custom_attributes).length - 1 ? 'border-bottom' : ''">
									<span class="text-small">
										{{attribute.name}}
									</span>

									<div v-if="attribute.match_quantity">
										<template v-if="attribute.value && attribute.value.length > 0">
											<div class="uk-flex uk-flex-column" v-for="(att_val, att_val_index) in attribute.value">
												<div class="uk-width-1-1 uk-flex uk-flex-top">
													<div class="uk-width-auto uk-margin-small-right">
														#{{att_val_index+1}}
													</div>
													<div class="uk-width-expand">
														<span>
															{{att_val}}
														</span>
													</div>
												</div>
											</div>
										</template>
										<div v-else class="tiny-padding uk-padding-remove-horizontal">
											No values submitted for {{attribute.name}}
										</div>
									</div>
									<span v-else>{{attribute.value}}</span>
								</div>
							</template>
						</div>

						<div class="uk-padding uk-flex uk-flex-column uk-flex-middle" v-else>
							<span class="mdi mdi-palette lni-extra-large uk-margin-small-bottom"></span>
							<p class="uk-text-center uk-margin-remove">
								There are no custom attributes for this purchase
							</p>
						</div>
					</div>

					
				</div>

				<div class="uk-padding-small border-top uk-flex uk-flex-center">

					<product-purchase-actions-repay :purchase="purchase" @done="detailsModal = false; loadModal = true; $emit('needs-to-refresh')" v-if="can('record-purchase-payment') && !purchase.is_reversed && purchase.amount_outstanding">
						<div class="uk-button uk-button-primary tiny-margin-right uk-border-rounded click tiny-margin-right" slot="action-button">
							<span class="text-small uk-text-white">
								Record New Payment
							</span>
						</div>
					</product-purchase-actions-repay>
					<button class="uk-button uk-button-danger" @click="detailsModal = false">
						Close
					</button>
				</div>
			</div>

		</vue-final-modal>

	</div>
</template>
<script>
import {bindProps} from "@/mixins/purchase"
export default{
	mixins : [bindProps],
	data(){
		return {
			reasonModal : false
		}
	}
};
</script>
