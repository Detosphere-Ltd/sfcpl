<template>
	<div>
		<div class="click" @click="loadModal = true">
			<slot name="action-button">
				<div class="chip uk-button-primary click uk-border-rounded">
					<span class="text-small uk-text-white">
						View Details
					</span>
				</div>
			</slot>
		</div>

		<vue-final-modal v-model="loadModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" @before-open="getSaleDetails">
			<div class="uk-card rounded bordered background raised-deep uk-margin-auto uk-margin-auto-vertical uk-width-1-1 uk-inline  uk-width-1-1 uk-width-medium">
				<div class="uk-padding-small uk-flex uk-flex-column uk-flex-middle">
					<template v-if="loading">
						<loaders-spinner></loaders-spinner>
						<p class="uk-text-center uk-margin-small-top">
							Loading sale details....
						</p>
					</template>

					<template v-else>
						<error-parser v-if="failed && errData !== undefined" :errorData="errData">
							<div  slot="further-action" class="uk-flex">
								<button class="uk-button uk-button-small uk-button-danger tiny-margin-right" @click="loadModal = false">
									Close
								</button>
								<button class="uk-button uk-button-small uk-button-primary" @click="getSaleDetails">
									Retry
								</button>
							</div>
						</error-parser>
					</template>
				</div>
			</div>
		</vue-final-modal>


		<vue-final-modal v-model="receiptModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" v-if="completedSale && completedSale.hasOwnProperty('sale_items')">
			<div class="uk-card rounded bordered background raised-deep uk-margin-auto uk-margin-auto-vertical uk-width-auto">
				<div class="receipt uk-inline" v-if="viewing === 'DETAILS'">
					<div class="container">
						<div class="store-details">
							<h5>
								{{emporium.name}}
							</h5>
							<p class="branch">
								{{completedSale.branch.name | branchize }}
							</p>
							<p class="contact">
								{{emporium.phone ? `${emporium.phone} /` : '' }} {{emporium.email ? `${emporium.email} /` : '' }} 
							</p>
						</div>
						<div class="final-details">
							<div class="det">
								<span>
									Invoice No &nbsp; : &nbsp;
								</span>
								<span>
									{{completedSale.invoice_no}}
								</span>
							</div>
							<div class="det">
								<span>
									Served By &nbsp; : &nbsp;
								</span>
								<span>
									{{completedSale.created_by.name}}
								</span>
							</div>
							<div class="det">
								<span>
									Date &nbsp; : &nbsp;
								</span>
								<span>
									{{$moment(completedSale.created_at).format('DD MMMM, YYYY')}} {{$moment(completedSale.created_at).format('hh:mm A')}}
								</span>
							</div>
						</div>

						<div class="sale-items" >
							<table>
								<tr class="row table-border-bottom heading">
									<th class="column item">Items</th>
									<th class="column qty">Qty</th>
									<th class="column amount">Sub Total</th>
								</tr>
								<tr class="row" v-for="(item, index) in completedSale.sale_items" :key="index" :class="index < completedSale.sale_items.length - 1 ? 'table-border-bottom' : ''">
									<td class="column item">
										<span>
											{{item.stock.product_variation.product.name}}
										</span>
										<small>{{item.unit_selling_price | currency(`${emporium.currency} `)}} / Unit</small>
									</td>
									<td class="column qty">
										<span>{{item.quantity | pluralize('Unit')}}</span>
									</td>
									<td class="column amount">
										<span>
											{{item.gross_amount | currency(`${emporium.currency} `)}}
										</span>
									</td>
								</tr>
							</table>
						</div>
						<div class="final-details">
							<div class="wrapper">
								<div class="det">
									<span>
										Items Total &nbsp; : &nbsp;
									</span>
									<span>
										{{completedSale.gross_amount | currency(`${emporium.currency} `)}}
									</span>
								</div>

								<div class="det">
									<span>
										Items Discount &nbsp; : &nbsp;
									</span>

									<span>
										{{completedSale.sale_items_discount_amount | currency(`${emporium.currency} `)}}
									</span>
								</div>

								<div class="det">
									<span>
										Sale Discount &nbsp; : &nbsp;
									</span>

									<span>
										{{completedSale.discount_amount | currency(`${emporium.currency} `)}}
									</span>
								</div>

								<template v-if="completedSale.levies && completedSale.levies.length > 0">
									<div class="det" v-for="levy in completedSale.levies" :key="levy.uuid">
										<span>
											{{levy.name}} &nbsp; : &nbsp;
										</span>

										<span>
											{{levy.amount | currency(`${emporium.currency} `)}}
										</span>
									</div>
								</template>


							</div>
						</div>

						<div class="final-details">
							<div class="wrapper">
								<div class="det">
									<span>
										Amount Tendered :
									</span>

									<span>
										{{completedSale.amount_tendered | currency(`${emporium.currency} `)}}
									</span>
								</div>

								<div class="det">
									<span>
										Change Given :
									</span>

									<span>
										{{completedSale.change | currency(`${emporium.currency} `)}}
									</span>
								</div>
							</div>
						</div>



						<div class="final-details">
							<div class="wrapper">

								<div class="det">
									<span>
										Total
									</span>

									<span class="price">
										{{completedSale.amount_payable | currency(`${emporium.currency} `)}}
									</span>
								</div>
							</div>
						</div>

						<div class="final-details">
							<div class="uk-width-1-1 uk-flex uk-flex-column">
								<span class="text-small tiny-margin-bottom">
									Customer
								</span>
								<nuxt-link :to="{name:'customers-customer', params:{customer:completedSale.customer.uuid}}" v-if="can('view-customers')" class="uk-text-bold underlined highlight-text tiny-margin-bottom">
									{{completedSale.customer.name}}
								</nuxt-link>
								<h6 v-else>
									{{completedSale.customer.name}}
								</h6>
							</div>
						</div>
					</div>


				</div>

				<div class="tiny-padding modal-content uk-overflow-auto uk-width-large" v-else>
					
					<div v-if="completedSale.payments && completedSale.payments.length > 0">
						<div v-for="(payment, key) in completedSale.payments" class="uk-width-1-1 uk-flex grid-padding uk-padding-remove-horizontal" :key="key" :class="key < completedSale.payments.length - 1 ? 'border-bottom uk-margin-small-bottom' : ''">
							<div class="square-25 uk-border-rounded bordered uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right">
								<span class="text-small uk-text-bold">{{key+1}}</span>
							</div>

							<div class="uk-width-expand">
								<div class="uk-width-1-1 uk-flex uk-flex-column">
									<div class="uk-width-1-1 uk-flex uk-flex-between">
										<h5 class="uk-text-bold uk-margin-remove uk-width-expand">
											{{payment.amount | currency(`${emporium.currency} `)}}
										</h5>

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

								</div>
							</div>
						</div>
					</div>

					<div class="uk-flex uk-flex-column uk-flex-middle" v-else>
						<div class="square-60 uk-border-circle uk-background-danger-op uk-margin-small-bottom uk-flex uk-flex-middle uk-flex-center uk-flex-column">
							<span class="mdi mdi-cash-remove lni-mid-large"></span>
						</div>
						<h5 class="uk-text-center">
							No Payment Record
						</h5>
						<p class="uk-text-center uk-margin-remove">
							This sale has no payment record. <br> There is an outstanding amount of <span class="uk-text-bold">{{completedSale.amount_outstanding | currency(`${emporium.currency}`)}}</span> for this sale.
						</p>
					</div>
				</div>

				<div class="uk-padding-small border-top uk-flex uk-flex-center">
					<button class="uk-button uk-button-primary tiny-margin-right" @click="viewing === 'DETAILS' ? viewing = 'PAYMENTS' : viewing = 'DETAILS'">
						{{ viewing === 'DETAILS' ? 'View Payment Details' : 'View Sale Items' }}
					</button>
					<button class="uk-button uk-button-danger" @click="receiptModal = false">
						Close
					</button>
				</div>
			</div>
		</vue-final-modal>

	</div>
</template>
<script>
import {bindProps} from "@/mixins/sales/singleton"
export default {
	mixins : [bindProps],
}
</script>