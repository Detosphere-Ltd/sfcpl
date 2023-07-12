<template>
	<div>
		<div class="uk-width-1-1 uk-flex uk-flex-column border-top">

			<div class="uk-width-1-1 uk-flex uk-flex-middle grid-padding uk-padding-remove-bottom">
				<purchase-attachment @uploaded="$emit('needs-to-refresh')" :invoice="invoice" class="uk-margin-small-right"></purchase-attachment>
				<purchase-actions-view-invoice :invoice="invoice" class="uk-margin-small-right"  @needs-to-refresh="$emit('needs-to-refresh')"></purchase-actions-view-invoice>
				<p class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small uk-text-bold">
					{{ invoice.invoice_no ? invoice.invoice_no : invoice.code }}
				</p>

				

			</div>

			<div class="uk-width-1-1 uk-flex uk-flex-middle grid-padding uk-padding-remove-top">
				<div class="grid-gutter uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{invoice.gross_amount | currency(`${emporium.currency} `)}}
					</p>
				</div>

				<div class="grid-gutter uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{invoice.discount_received | currency(`${emporium.currency} `)}}
					</p>
				</div>
				<div class="grid-gutter uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{invoice.amount_payable | currency(`${emporium.currency} `)}}
					</p>
				</div>


				<div class="grid-gutter uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{invoice.amount_paid | currency(`${emporium.currency} `)}}
					</p>
				</div>

				<div class="grid-gutter uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small" :class="{ 'uk-text-danger uk-text-bold' : invoice.amount_outstanding}">
						{{invoice.amount_outstanding | currency(`${emporium.currency} `)}}
					</p>
				</div>


				<div class="grid-gutter uk-width-small">
					<p class="uk-text-truncate uk-margin-remove" v-if="invoice.supplier && invoice.supplier.name !== undefined">
						<nuxt-link :to="{name: 'suppliers-supplier', params : {supplier: invoice.supplier.uuid}}" class="highlight-text underlined" v-if="can('view-suppliers')">
							{{invoice.supplier.name | truncate(15)}}
						</nuxt-link>
						<template v-else>
							{{invoice.supplier.name | truncate(15)}}
						</template>
					</p>

					<p v-else class="uk-margin-remove">
						N/A
					</p>
				</div>

				<div class="grid-gutter uk-visible@l uk-width-x-small tiny-margin-right uk-visible@xl uk-flex">
					<div class="uk-flex uk-flex-left" v-if="invoice.is_reversed">
						<span class="label label-danger">
							<small>Reversed</small>
						</span>
					</div>

					<span class="label label-success" v-else>
						<small>Valid</small>
					</span>
				</div>


				<div class="grid-gutter uk-visible@xl uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{$moment(invoice.created_at).format('DD MMM, YYYY')}}
					</p>
				</div>

				<div class="grid-gutter uk-visible@xl uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{ invoice.created_by && invoice.created_by.name ? invoice.created_by.name : 'System Admin'  }}
					</p>
				</div>

				<div class="grid-gutter uk-margin-auto-left">
					<div class="uk-flex uk-flex-right">
						<purchase-actions-record-invoice-payment :invoice="invoice" @done="$emit('needs-to-refresh')" v-if="can('record-purchase-payment') && !invoice.is_reversed && invoice.amount_outstanding">
							<div class="chip uk-button-primary tiny-margin-right uk-border-rounded click" slot="action-button">
								<span class="text-small uk-text-white">
									Pay
								</span>
							</div>
						</purchase-actions-record-invoice-payment>
						<purchase-actions-reverse-invoice :invoice="invoice" @done="$emit('needs-to-refresh')" v-if="can('reverse-purchases') && !invoice.is_reversed">
							<div class="chip uk-button-danger uk-border-rounded click" slot="action-button">
								<span class="text-small uk-text-white">
									Reverse
								</span>
							</div>
						</purchase-actions-reverse-invoice>

						<div class="chip uk-background-danger-op uk-border-rounded click uk-text-truncate" v-if="invoice.is_reversed" @click="reasonModal = true">
							<span class="text-small uk-text-truncate">Reversal Reason</span>
						</div>

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

					<div class="uk-padding-small uk-flex uk-flex-column">
						<p class="uk-margin-remove text-small">
							This purchase was reversed by
						</p>
						<p class="uk-margin-remove">
							{{invoice.reversed_by.name}} 
						</p>

						<p class="uk-margin-remove-top text-small">
							on {{$moment(invoice.reversed_at).format("DD MMM, YYYY ")}} at {{$moment(invoice.reversed_at).format("hh:mm a")}}.
						</p>
						<span class="text-small">
							Reason Provided Was
						</span>
						<p>
							{{invoice.reversal_reason}}
						</p>
					</div>

				</div>
			</div>
		</vue-final-modal>



	</div>
</template>
<script>
import {bindProps} from "@/mixins/purchase/invoice"
export default{
	mixins : [bindProps],
	data(){
		return {
			reasonModal : false
		}
	}
};
</script>
