<template>
	<div>
		<div @click="loadModal = true" class="click">
			<slot name="action-button">
				<span class="mdi mdi-information uk-text-primary lni-large"></span>
			</slot>
		</div>

		<vue-final-modal v-model="loadModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" @before-open="getInvoiceDetails">
			<div class="rounded bordered background raised-deep uk-margin-auto uk-width-1-1 uk-inline  uk-width-1-1 uk-width-medium">
				<div class="uk-padding uk-flex uk-flex-column uk-flex-middle">
					<template v-if="fetching">
						<loaders-spinner></loaders-spinner>
						<p class="uk-text-center uk-margin-small-top">
							Loading purchase invoice details....
						</p>
					</template>

					<template v-else>
						<error-parser v-if="failed && errData !== undefined" :errorData="errData">
							<div slot="further-action">
								<button class="uk-button uk-button-small uk-button-danger" @click="loadModal = false" >
									Close
								</button>
								<button class="uk-button uk-button-small uk-button-primary" @click="getInvoiceDetails">
									Retry
								</button>
							</div>
						</error-parser>
					</template>
				</div>
			</div>
		</vue-final-modal>

		<vue-final-modal v-model="detailsModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" v-if="invoiceDetails">
			<div class="rounded bordered background raised-deep uk-margin-auto uk-margin-auto-vertical uk-width-1-1" style="min-width: 700px">

				<div class="tiny-padding uk-flex uk-flex-middle border-bottom">
					<partials-avatar class="tiny-margin-right" v-if="invoiceDetails.created_by && invoiceDetails.created_by.avatar" :media="invoiceDetails.created_by.avatar" size="25"></partials-avatar>
					<span>
						Purchase Invoice Recorded By {{invoiceDetails.created_by.name}} 
					</span>
				</div>
				<div class="uk-width-1-1 uk-flex border-bottom">
					<div class="uk-width-1-2@m grid-padding uk-text-center click" :class="showing === 'DETAILS' ? 'tabActive' : ''" @click="showing = 'DETAILS'">
						Invoice Details
					</div>
					<div class="uk-width-1-2@m grid-padding uk-text-center click" :class="showing === 'PAYMENTS' ? 'tabActive' : ''" @click="showing = 'PAYMENTS'">
						Invoice Payment Details
					</div>
				</div>
				<div class="uk-width-1-1 uk-overflow-auto modal-content">
					


					<div class="tiny-padding" v-if="showing === 'DETAILS'" :key="showing">

						<div class="tiny-padding uk-padding-remove-bottom">
							<span class="text-small uk-text-uppercase">
								{{invoiceDetails.invoice_no ? 'Invoice Number' : 'Invoice Code'}}
							</span>
							<h4 class="tiny-margin-bottom">
								{{invoiceDetails.invoice_no ? invoiceDetails.invoice_no : invoiceDetails.code }}
							</h4>
						</div>



						<div class="uk-width-1-1 uk-child-width-1-2 uk-flex uk-grid-collapse uk-flex-wrap" uk-grid="masonry: true">
							<div class="grid-padding uk-padding-remove-right uk-padding-remove-bottom">
								<div class="tiny-padding bordered uk-border-rounded">
									<span>Invoice Items Summary</span>

									<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
										<div class="uk-width-expand" uk-leader>No. Of Products</div>
										<div>{{invoiceDetails.total_purchase_items | pluralize('Product')}}</div>
									</div>

									<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
										<div class="uk-width-expand" uk-leader>Total Qty</div>
										<div>{{invoiceDetails.total_quantity | pluralize('Unit')}}</div>
									</div>
								</div>
							</div>
							<div class="grid-padding">
								<div class="tiny-padding bordered uk-border-rounded">
									<span>Payment Summary</span>

									<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
										<div class="uk-width-expand" uk-leader>Gross Amount</div>
										<div>{{invoiceDetails.gross_amount | currency(`${emporium.currency} `)}}</div>
									</div>

									<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
										<div class="uk-width-expand" uk-leader>Discount</div>
										<div>{{invoiceDetails.discount_received | currency(`${emporium.currency} `)}}</div>
									</div>
									<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
										<div class="uk-width-expand" uk-leader>Amount Payable</div>
										<div>{{invoiceDetails.amount_payable | currency(`${emporium.currency} `)}}</div>
									</div>
									<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid>
										<div class="uk-width-expand" uk-leader>Amount Paid</div>
										<div>{{invoiceDetails.amount_paid | currency(`${emporium.currency} `)}}</div>
									</div>
									<div class="uk-grid-collapse tiny-padding uk-padding-remove-horizontal" uk-grid v-if="invoiceDetails.is_outstanding > 0">
										<div class="uk-width-expand" uk-leader>Debt.</div>
										<div>{{invoiceDetails.amount_outstanding | currency(`${emporium.currency} `)}}</div>
									</div>
									<div class="chip uk-flex-middle uk-border-rounded" :class="invoiceDetails.is_outstanding ? 'uk-background-danger-op' : 'uk-background-success-op'">
										<span class="mdi tiny-margin-right" :class="invoiceDetails.is_outstanding ? 'mdi-alert-outline' : 'mdi-check-circle'"></span>
										<span class="uk-text-capitalize text-small">
											{{ invoiceDetails.is_outstanding ? 'Invoice has outstanding payment' : 'Invoice is fully paid.' }}
										</span>
									</div>
								</div>
							</div>

							<div class="grid-padding uk-padding-remove-right" v-if="can('view-suppliers')">
								<div class="tiny-padding bordered uk-border-rounded">
									<span>Supplier Info.</span>

									<div class="tiny-margin-top">
										<h4 class="uk-margin-remove-bottom">
											{{invoiceDetails.supplier.name}}
										</h4>
										<span v-if="invoiceDetails.supplier.email">
											{{invoiceDetails.supplier.email}} &bull;
										</span>
										<span v-if="invoiceDetails.supplier.phone">
											{{invoiceDetails.supplier.phone}}
										</span>

										<div class="uk-flex uk-margin-small-top">
											<nuxt-link :to="{name: 'suppliers-supplier', params:{supplier:invoiceDetails.supplier.uuid}}" class="chip uk-button-primary uk-margin-auto-right uk-border-rounded">
												<span class="text-small uk-text-white uk-text-capitalize">
													View Purcahses from this Supplier
												</span>
											</nuxt-link>
										</div>
									</div>
								</div>
							</div>

						</div>

						<div class="border-top tiny-padding border-bottom uk-flex">
							<div class="uk-width-expand">
								<span class="uk-text-bold">
									Product
								</span>
							</div>
							<div class="uk-width-small uk-margin-small-left">
								<span class="uk-text-bold">
									Variation
								</span>
							</div>
							<div class="uk-width-small">
								<span class="uk-text-bold">
									QTY
								</span>
							</div>
							<div class="uk-width-small">
								<span class="uk-text-bold">
									Cost Price
								</span>
							</div>
							<div class="uk-width-small">
								<span class="uk-text-bold">
									Expiry Date
								</span>
							</div>
							<div class="uk-width-small">
								<span class="uk-text-bold">
									Selling Price
								</span>
							</div>
						</div>

						<div class="tiny-padding uk-flex" v-for="(product, key) in invoiceDetails.purchase_items" :key="key" :class="key < invoiceDetails.purchase_items.length - 1 ? 'border-bottom' : ''">
							<div class="uk-width-expand">
								<span class="text-small">
									{{product.product_variation.product.name}}
								</span>
							</div>
							<div class="uk-width-small uk-margin-small-left">
								<span class="">
									{{product.product_variation.variation.name}}
								</span>
							</div>
							<div class="uk-width-small">
								<span class="text-small">
									{{product.quantity | pluralize('Unit')}}
								</span>
							</div>
							<div class="uk-width-small">
								<span class="text-small">
									{{product.cost_price | currency(`${emporium.currency} `) }}
								</span>
							</div>
							<div class="uk-width-small">
								<span class="text-small">
									{{product.expires_at ? $moment(product.expires_at).format('DD MMM, YYYY') : 'N/A'}}
								</span>
							</div>
							<div class="uk-width-small">
								<span class="text-small">
									{{product.unit_selling_price | currency(`${emporium.currency} `) }}
								</span>
							</div>

						</div>

						<div v-if="invoiceDetails.note" class="tiny-padding">
							<div class="uk-padding-small bordered uk-border-rounded">
								<span>
									Additional Notes
								</span>

								<p class="uk-margin-remove">
									{{invoiceDetails.note}}
								</p>
							</div>
						</div>
					</div>

					<div class="tiny-padding uk-width-1-1" v-else>
						

						<div class="uk-flex uk-flex-column uk-width-1-1" v-if="invoiceDetails.payments.length > 0">
							<div v-for="(payment, key) in invoiceDetails.payments" class="uk-width-1-1 uk-flex grid-padding uk-padding-remove-horizontal" :key="key" :class="key < invoiceDetails.payments.length - 1 ? 'border-bottom uk-margin-small-bottom' : ''">
								<div class="square-25 uk-border-rounded bordered uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right">
									<span class="text-small uk-text-bold">{{key+1}}</span>
								</div>

								<div class="uk-width-expand">
									<div class="uk-width-1-1 uk-flex uk-flex-column">
										<div class="uk-width-1-1 uk-flex uk-flex-between">
											<h5 class="uk-text-bold uk-margin-remove uk-width-expand">
												{{payment.amount | currency(`${emporium.currency} `)}}
											</h5>

											<purchase-actions-reverse-invoice-payment :invoice="invoice" :payment="payment" @done="detailsModal = false; loadModal = true; $emit('needs-to-refresh')" v-if="can('reverse-purchase-payment') && !payment.is_reversed">
												<div class="chip uk-button-danger tiny-margin-right uk-border-rounded click tiny-margin-right" slot="action-button">
													<span class="text-small uk-text-white">
														Reverse This Payment
													</span>
												</div>
											</purchase-actions-reverse-invoice-payment>



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
													<purchase-actions-reverse-invoice-payment :invoice="invoice" :payment="payment">
														<div class="status uk-background-danger-op tiny-margin-right uk-border-rounded click tiny-margin-right" slot="action-button">
															<span class="text-small">
																Reversed. Click to See Reason
															</span>
														</div>
													</purchase-actions-reverse-invoice-payment>
												</template>
												<template v-else>
													<div class="status uk-background-success-op">
														<span class="text-small">Valid Payment</span>
													</div>
												</template>
											</div>
										</div>


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

					
				</div>

				<div class="uk-padding-small border-top uk-flex uk-flex-center">

					<purchase-actions-record-invoice-payment :invoice="invoice" @done="detailsModal = false; loadModal = true; $emit('needs-to-refresh')" v-if="can('record-purchase-payment') && !invoiceDetails.is_reversed && invoiceDetails.amount_outstanding > 0">
						<div class="uk-button uk-button-primary tiny-margin-right uk-border-rounded click tiny-margin-right" slot="action-button">
							<span class="text-small uk-text-white">
								Record New Payment
							</span>
						</div>
					</purchase-actions-record-invoice-payment>

					<button class="uk-button uk-button-danger" @click="detailsModal = false">
						Close
					</button>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps} from '@/mixins/purchase/invoice'
export default {
	mixins : [bindProps]
}
</script>
