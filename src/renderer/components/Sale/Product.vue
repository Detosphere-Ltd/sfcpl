<template>
	<div>
		<div class="uk-width-1-1 uk-flex uk-flex-middle">

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
						{{$moment(sale.sale.sold_at).format('DD MMM, YYYY')}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
						{{sale.quantity | pluralize('Unit')}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
						{{sale.unit_selling_price | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">

						{{ sale.discount_amount | currency(`${emporium.currency} `) }}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
						{{sale.vat_amount | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
						{{sale.amount_payable | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>

			<div class="grid-gutter uk-visible@xl">
				<div class="uk-width-small uk-flex">
					<p class="uk-text-truncate uk-margin-remove-vertical label uk-border-rounded uk-margin-auto-right" :class="sale.sale.is_reversed ? 'label-danger' : 'label-success'">
						<small>
							{{sale.sale.is_reversed ? 'Retracted' : 'Active'}}
						</small>
					</p>
				</div>
			</div>


			<div class="grid-gutter uk-visible@xl" v-if="showCustomer && sale.sale.customer">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
						<nuxt-link v-if="can('view-customers')" :to="{name: 'customers-customer', params:{customer : sale.sale.customer.uuid}}" class="uk-text-truncate">
							<span class="highlight-text underlined">
								{{sale.sale.customer.name}}
							</span>
						</nuxt-link>
						<template v-else>
							{{sale.sale.customer.name}}
						</template>
					</p>
				</div>
			</div>


			<div class="grid-gutter uk-visible@xl">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
						{{sale.sale.branch.name | branchize}}
					</p>
				</div>
			</div>

			<div>
				<sale-view-items :sale="sale.sale">
					<div slot="action-button" class="chip bordered background click uk-border-rounded uk-text-truncate">
						<span class="text-small uk-text-truncate">
							View Sale Details
						</span>
					</div>
				</sale-view-items>
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
