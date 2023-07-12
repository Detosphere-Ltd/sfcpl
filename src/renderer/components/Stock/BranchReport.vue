<template>
	<div class="uk-width-1-1 uk-flex uk-flex-middle">

		<div class="grid-gutter uk-width-medium uk-margin-right">
			<nuxt-link :to="{name: 'inventory-product', params : {product : item.product_uuid}}" v-if="can('view-products')">
				<h5 class="uk-margin-remove underlined uk-text-primary">
					{{item.product_name}}
				</h5>
			</nuxt-link>
			<template v-else>
				<h5 class="uk-margin-remove">
					{{item.product_name}}
				</h5>
			</template>
		</div>

		
		<div class="uk-width-small grid-gutter">
			<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
				{{item.variation_name | capitalize}}
			</p>

		</div>
		
		<div class="uk-width-small grid-gutter">
			<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
				{{item.quantity_available | number('0,0') | pluralize('Unit')}}
			</p>

		</div>
		
		<div class="uk-width-small grid-gutter">
			<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
				{{item.quantity_available_cost_price | currency(`${emporium.currency} `) }}
			</p>

		</div>
		<div class="grid-gutter uk-width-small">
			<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
				{{item.quantity_available_selling_price | currency(`${emporium.currency} `) }}
			</p>
		</div>



		<div class="grid-gutter uk-width-small">
			<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small" :class="item.quantity_available_profit < 0 ? 'uk-text-danger' : 'uk-text-success'">
				{{item.quantity_available_profit | currency(`${emporium.currency} `) }}
			</p>
		</div>

		
		<div class="uk-width-small grid-gutter">
			<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small" :class="item.quantity_available_profit_margin < 0 ? 'uk-text-danger' : 'uk-text-success'">
				{{item.quantity_available_profit_margin / 100 | percent }}
			</p>

		</div>

		<div class="grid-gutter uk-width-small">
			<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
				{{item.branch_name}}
			</p>
		</div>
	</div>
</template>
<script>
export default {
	props : {
		item : {
			type : Object,
			required : true
		}	
	},
}
</script>
