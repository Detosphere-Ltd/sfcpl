<template>
	<div>
		<div class="uk-padding-small uk-padding-remove-horizontal uk-flex uk-flex-wrap">
			<div class="uk-width-1-1 tiny-padding uk-padding-remove-vertical uk-flex uk-flex-column">
				<div class="uk-flex uk-flex-middle">
					<a-tooltip placement="rightTop" trigger="click" :title="`This purchase Item was genereated from an invoice with ${purchase.purchase_invoice.invoice_no ? 'Invoice Number'  : 'Invoice Code'} ${purchase.purchase_invoice.invoice_no ? purchase.purchase_invoice.invoice_no  : purchase.purchase_invoice.code}`">
						<span class="uk-flex uk-flex-middle click">
							<a class="square-15 uk-flex uk-flex-column uk-flex-middle uk-flex-center tiny-margin-right uk-border-rounded">
								<span class="mdi mdi-receipt text-small"></span>
							</a>
							<span class="text-small">
								{{ purchase.purchase_invoice.invoice_no ? "Invoice Number"  : "Invoice Code" }} -  
								{{purchase.purchase_invoice.invoice_no ? purchase.purchase_invoice.invoice_no  : purchase.purchase_invoice.code }}
							</span>
						</span>
					</a-tooltip>
				</div>

				<nuxt-link class="uk-margin-right highlight-text underlined uk-h5 uk-margin-remove-vertical uk-width-auto" :to="{name: 'inventory-product-purchases', params : {product: purchase.product_variation.product.uuid} }" v-if="can('view-purchases')">
					{{purchase.product_variation.product.name}} &bull;&bull;&bull; {{purchase.product_variation.variation.name | capitalize}} &bull;&bull;&bull; {{purchase.product_variation.code}}
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
						<purchase-actions-view-invoice class="tiny-margin-right"  v-if="can('view-purchases')" :invoice="purchase.purchase_invoice" @needs-to-refresh="$emit('needs-to-refresh')"></purchase-actions-view-invoice>
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


				<div class="grid-gutter uk-flex uk-flex-center uk-width-x-small tiny-margin-right">
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
					<div class="uk-flex">
						<product-purchase-actions-repay :purchase="purchase" @done="$emit('needs-to-refresh')" v-if="can('record-purchase-payment') && !purchase.is_reversed && purchase.amount_outstanding">
							<div class="chip uk-button-primary tiny-margin-right uk-border-rounded click" slot="action-button">
								<span class="text-small uk-text-white">
									Pay
								</span>
							</div>
						</product-purchase-actions-repay>


						<product-purchase-actions-reverse :purchase="purchase" @done="$emit('needs-to-refresh')" v-if="can('reverse-purchases') && purchase.is_reversible">
							<div class="chip uk-button-danger uk-border-rounded click" slot="action-button">
								<span class="text-small uk-text-white">
									Reverse
								</span>
							</div>
						</product-purchase-actions-reverse>

						<div class="chip uk-background-danger-op uk-border-rounded click uk-text-truncate" v-if="purchase.is_reversed" @click="reasonModal = true">
							<span class="text-small uk-text-truncate">Reversal Reason</span>
						</div>
					</div>
				</div>

			</div>
<!-- 
			<span class="tiny-padding uk-padding-remove-vertical text-small">
				From {{ purchase.purchase_invoice.invoice_no ? "Invoice Number"  : "Invoice Code" }} -  
				{{purchase.purchase_invoice.invoice_no ? purchase.purchase_invoice.invoice_no  : purchase.purchase_invoice.code }}
			</span> -->

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
