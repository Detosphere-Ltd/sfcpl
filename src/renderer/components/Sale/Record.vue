<!-- <template>
	<div>
		<div class="uk-width-1-1 uk-flex uk-flex-middle">

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
						{{$moment(sale.sold_at).format('DD MMM, YYYY')}}
					</p>
				</div>
			</div>
			<div class="grid-gutter">
				<div class="uk-width-small uk-flex uk-flex-middle">
					<sale-view-items :sale="sale"></sale-view-items>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
						{{sale.gross_amount | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">

						{{ (sale.sale_items_discount_amount + sale.discount_amount ) | currency(`${emporium.currency} `) }}
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

			<div class="grid-gutter tiny-margin-right">
				<div class="uk-width-small uk-flex uk-flex-middle">
					<sale-view-items :sale="sale" class="tiny-margin-right" view="PAYMENTS">
						<span class="mdi mdi-information uk-text-primary lni-large" slot="action-button"></span>
					</sale-view-items>
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
						{{sale.amount_paid | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>
			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
						{{sale.amount_outstanding | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>
			

			



			<div class="grid-gutter uk-visible@xl">
				<div class="uk-width-small uk-flex">
					<p class="uk-text-truncate uk-margin-remove-vertical label uk-border-rounded uk-margin-auto-right" :class="sale.is_reversed ? 'label-danger' : 'label-success'">
						<small>
							{{sale.is_reversed ? 'Retracted' : 'Active'}}
						</small>
					</p>
				</div>
			</div>


			<div class="grid-gutter" v-if="can('reverse-sales')">
				<div class="uk-width-small uk-flex uk-flex-middle">
					<sale-actions-reverse :sale="sale" @done="$emit('needs-to-refresh')" ></sale-actions-reverse>
				</div>
			</div>


			<div class="grid-gutter uk-visible@xl" v-if="showCustomer && sale.customer">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
						<nuxt-link v-if="can('view-customers')" :to="{name: 'customers-customer', params:{customer : sale.customer.uuid}}" class="uk-text-truncate">
							<span class="highlight-text underlined">
								{{sale.customer.name}}
							</span>
						</nuxt-link>
						<template v-else>
							{{sale.customer.name}}
						</template>
					</p>
				</div>
			</div>


			<div class="grid-gutter uk-visible@xl"  v-if="showBranch && sale.branch">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
						{{sale.branch.name | branchize}}
					</p>
				</div>
			</div>
		</div>

	</div>
</template> -->

<template>
	<div>
		<div class="uk-width-1-1 uk-flex uk-flex-middle">

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
						{{$moment(sale.sold_at).format('DD MMM, YYYY')}}
					</p>
				</div>
			</div>
			<div class="grid-gutter">
				<div class="uk-width-small uk-flex uk-flex-middle">
					{{ sale.total_quantity | pluralize('Unit', {includeNumber : true }) }}
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
						{{sale.gross_amount | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">

						{{ sale.total_discount_amount | currency(`${emporium.currency} `) }}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
						{{sale.total_tax_amount | currency(`${emporium.currency} `)}}
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

			<div class="grid-gutter tiny-margin-right">
				<div class="uk-width-small uk-flex uk-flex-middle">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small" :class="sale.amount_paid === sale.amount_payable ? 'uk-text-success uk-text-bold' : ''">
						{{sale.amount_paid | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>
			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small" :class="sale.amount_outstanding > 0 ? 'uk-text-warning uk-text-bold' : ''">
						{{sale.amount_outstanding | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>
			

			



			<div class="grid-gutter">
				<div class="uk-width-small uk-flex">
					<p class="uk-text-truncate uk-margin-remove-vertical label uk-border-rounded uk-margin-auto-right" :class="sale.is_reversed ? 'label-danger' : 'label-success'">
						<small>
							{{sale.is_reversed ? 'Reversed' : 'Active'}}
						</small>
					</p>
				</div>
			</div>


			<div class="grid-gutter" v-if="showCustomer && sale.customer">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
						<nuxt-link v-if="can('view-customers')" :to="{name: 'customers-customer', params:{customer : sale.customer.uuid}}" class="uk-text-truncate">
							<span class="highlight-text underlined">
								{{sale.customer.name}}
							</span>
						</nuxt-link>
						<template v-else>
							{{sale.customer.name}}
						</template>
					</p>
				</div>
			</div>


			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
						{{sale.branch.name}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="square-30 bordered background click rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle">
					<span class="mdi mdi-dots-horizontal uk-text-large"></span>
				</div>

				<div uk-drop="mode: click; delay-hide: 0; delay-show : 0; pos: bottom-right; offset: 0">
					
					<div class="background bordered rounded stripped-bottom">

						<sale-view-items :sale="sale">
							<template #action-button>
								<div class="uk-flex click tiny-padding success-on-hover">
									
									<div class="uk-flex uk-flex-column uk-width-expand">
										<span class="uk-text-truncate uk-text-bold">View Sale</span>
										<span class="text-small uk-text-truncate">
											View the details of this sale
										</span>
									</div>
									<div class="square-30 rounded uk-button-view center uk-margin-small-left uk-margin-auto-vertical">
										<span class="mdi mdi-arrow-right uk-text-large"></span>
									</div>
								</div>
							</template>
						</sale-view-items>

						<sale-view-items :sale="sale" class="tiny-margin-right" view="PAYMENTS">
							<template #action-button>
								<div class="uk-flex click tiny-padding success-on-hover">
									
									<div class="uk-flex uk-flex-column uk-width-expand">
										<span class="uk-text-truncate uk-text-bold">View Payments</span>
										<span class="text-small uk-text-truncate">
											View payment details of this sale
										</span>
									</div>
									<div class="square-30 rounded uk-button-view center uk-margin-small-left uk-margin-auto-vertical">
										<span class="mdi mdi-arrow-right uk-text-large"></span>
									</div>
								</div>
							</template>
						</sale-view-items>


						<sale-actions-reverse :sale="sale" @done="$emit('needs-to-refresh')" v-if="sale.is_reversed">
							<template #action-button>
								<div class="uk-flex uk-flex-middle click tiny-padding success-on-hover">
									<div class="square-30 rounded center uk-margin-small-right">
										<span class="mdi uk-text-large mdi-information uk-text-primary"></span>
									</div>
									<div class="uk-flex uk-flex-column uk-width-expand">
										<span class="uk-text-truncate uk-text-bold">
											See Reversal Reason
										</span>
										<span class="text-small uk-text-truncate">
											
											See why this sale was reversed
										</span>
									</div>
								</div>
							</template>
						</sale-actions-reverse>
					</div>
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
		},
		showBranch : {
			type : Boolean,
		default : true
		}
	}
}
</script>
