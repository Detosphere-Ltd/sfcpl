<template>
	<div>
		<div class="uk-width-1-1 uk-flex uk-flex-middle">

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
						{{$moment(sale.sold_at).format('DD MMM, YYYY')}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small uk-flex uk-flex-column">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize" :title="sale.stock.product_variation.product.name">
						{{sale.stock.product_variation.product.name}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small uk-flex uk-flex-column">
					<span class="text-small uk-text-truncate">
						{{sale.stock.product_variation.variation.name | capitalize}} 
					</span>
					<small class="uk-text-truncate">
						{{sale.stock.product_variation.code}}
					</small>
				</div>
			</div>

			
			
			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
						{{sale.quantity | number('0,0') | pluralize('Unit')}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
						{{sale.unit_selling_price | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
						{{sale.gross_amount | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">

						{{ (sale.discount_amount ) | currency(`${emporium.currency} `) }}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
						{{sale.tax_amount | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
						{{sale.amount_payable | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>




			<div class="grid-gutter">
				<div class="uk-width-small uk-flex">
					<p class="uk-text-truncate uk-margin-remove-vertical label uk-border-rounded uk-margin-auto-right" :class="sale.sale.is_reversed ? 'label-danger' : 'label-success'">
						<small>
							{{sale.sale.is_reversed ? 'Retracted' : 'Active'}}
						</small>
					</p>
				</div>
			</div>



			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
						{{sale.sale.branch.name}}
					</p>
				</div>
			</div>
			<div class="grid-gutter">
				<div class="uk-width-small uk-flex uk-flex-middle">
					<sale-view-items :sale="sale.sale"></sale-view-items>
				</div>
			</div>


		</div>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/sales/singleton"
export default {
	mixins : [bindProps],
	props : {
		showCustomer : {
			type : Boolean,
		default : true
		}
	}
}
</script>
