<template>
	<div>
		<template v-if="display === 'card'">
			<div class="uk-flex uk-flex-middle">
				<div class="uk-width-medium uk-width-1-1">
					<div class="uk-margin-small-bottom uk-flex uk-flex-column">
						<nuxt-link :to="{name: 'inventory-product', params : {product : item.product_uuid}}" class="uk-flex uk-flex-column" v-if="can('view-products')">
							<h5 class="uk-margin-remove uk-text-primary underlined">
								{{item.product_name}} &bull; <small>{{item.variation_name | capitalize}}</small>
							</h5>

						</nuxt-link>

						<template v-else>
							<h5 class="uk-margin-remove">
								{{item.product_name}} &bull; <small>{{item.variation_name | capitalize}}</small>
							</h5>
						</template>
					</div>
				</div>



				<div class="uk-width-expand">
					<div class="uk-flex" v-if="reportType === 'overall'">
						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Total Qty. Available 
							</span>
							<span class="text-small uk-text-bold"> {{item.store_stock_quantity | number('0,0') | pluralize('Unit')}}</span>
						</div>

						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Total Cost of Stock
							</span>
							<span class="text-small uk-text-bold"> {{item.store_stock_cost_price | currency(`${emporium.currency} `) }}</span>
						</div>

						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Total Stock Value at Current Prices 
							</span>
							<span class="text-small uk-text-bold"> {{item.store_stock_selling_price | currency(`${emporium.currency} `) }}</span>
						</div>

						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Total Estimated Profit
							</span>
							<span class="text-small uk-text-bold" :class="item.store_stock_profit < 0 ? 'uk-text-danger' : 'uk-text-success'"> {{item.store_stock_profit | currency(`${emporium.currency} `) }}</span>
						</div>

						<div class="uk-margin-small-right tiny-margin-bottom chip uk-width-small uk-flex-column">
							<span class="text-small tiny-margin-bottom">
								Total Estimated Profit Margin
							</span>
							<span class="text-small uk-text-bold" :class="item.store_stock_profit_margin < 0 ? 'uk-text-danger' : 'uk-text-success'"> 
								{{item.store_stock_profit_margin / 100 | percent }}
							</span>
						</div>
					</div>

					<div class="uk-flex" v-else-if="reportType === 'warehouse'">
						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Qty. Available At Warehouse 
							</span>
							<span class="text-small uk-text-bold"> {{item.warehouse_stock | number('0,0') | pluralize('Unit')}}</span>
						</div>

						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Cost of Warehouse Stock
							</span>
							<span class="text-small uk-text-bold"> {{item.warehouse_stock_cost_price | currency(`${emporium.currency} `) }}</span>
						</div>

						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Warehouse Value at Current Prices 
							</span>
							<span class="text-small uk-text-bold"> {{item.warehouse_stock_selling_price | currency(`${emporium.currency} `) }}</span>
						</div>

						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Estimated Profit
							</span>
							<span class="text-small uk-text-bold" :class="item.warehouse_stock_profit < 0 ? 'uk-text-danger' : 'uk-text-success'"> {{item.warehouse_stock_profit | currency(`${emporium.currency} `) }}</span>
						</div>

						<div class=" tiny-margin-bottom chip uk-flex-column uk-width-small">
							<span class="text-small tiny-margin-bottom">
								Estimated Profit Margin
							</span>
							<span class="text-small uk-text-bold" :class="item.warehouse_stock_profit_margin < 0 ? 'uk-text-danger' : 'uk-text-success'"> 
								{{item.warehouse_stock_profit_margin / 100 | percent }}
							</span>
						</div>
					</div>

					<div class="uk-flex" v-else-if="reportType === 'branches'">
						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Qty. Available Across Branches 
							</span>
							<span class="text-small uk-text-bold"> {{item.branch_stock | number('0,0') | pluralize('Unit')}}</span>
						</div>

						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Cost of Branch Stock 
							</span>
							<span class="text-small uk-text-bold"> {{item.branch_stock_cost_price | currency(`${emporium.currency} `) }}</span>
						</div>

						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Stock Value at Current Prices 
							</span>
							<span class="text-small uk-text-bold"> {{item.branch_stock_selling_price | currency(`${emporium.currency} `) }}</span>
						</div>

						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Estimated Profit
							</span>
							<span class="text-small uk-text-bold" :class="item.branch_stock_profit < 0 ? 'uk-text-danger' : 'uk-text-success' "> 
								{{item.branch_stock_profit | currency(`${emporium.currency} `) }}
							</span>
						</div>

						<div class="tiny-margin-bottom chip uk-flex-column uk-width-small">
							<span class="text-small tiny-margin-bottom">
								Estimated Profit Margin
							</span>
							<span class="text-small uk-text-bold" :class="item.branch_stock_profit_margin < 0 ? 'uk-text-danger' : 'uk-text-success' "> 
								{{item.branch_stock_profit_margin / 100 | percent }}
							</span>
						</div>
					</div>

					<div class="uk-flex uk-flex-middle" v-else>
						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Current Selling Price
							</span>
							<span class="text-small uk-text-bold"> {{item.unit_selling_price | currency(`${emporium.currency} `) }} / Unit</span>
						</div>

						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Taxes 
							</span>
							<span class="text-small uk-text-bold"> {{item.total_tax_amount | currency(`${emporium.currency} `) }} / Unit</span>
						</div>

						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Recorded Qty. <br>(Incl. Reversed) 
							</span>
							<span class="text-small uk-text-bold"> {{item.quantity_recorded | number('0,0') | pluralize('Unit')}}</span>
						</div>

						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Sellable Qty. <br>(Excl. Reversed) 
							</span>
							<span class="text-small uk-text-bold"> {{item.quantity_purchased | number('0,0') | pluralize('Unit')}}</span>
						</div>

						<div class="chip uk-width-small uk-flex-column border-right uk-width-small uk-margin-small-right uk-height-1-1">
							<span class="text-small tiny-margin-bottom">
								Reversed Qty. 
							</span>
							<span class="text-small uk-text-bold"> {{item.quantity_reversed | number('0,0') | pluralize('Unit')}}</span>
						</div>

						<div class="tiny-margin-bottom chip uk-flex-column uk-width-small">
							<span class="text-small tiny-margin-bottom">
								Qty. In Transition 
							</span>
							<span class="text-small uk-text-bold"> {{item.quantity_in_transition | number('0,0') | pluralize('Unit')}}</span>
						</div>
					</div>
				</div>
			</div>
		</template>

		<template v-else>

			<template v-if="reportType === 'overall'">
				<div class="uk-width-1-1 uk-flex uk-flex-middle">

					<div class="uk-width-medium uk-width-1-1 uk-margin-right">
						<div class="uk-margin-small-bottom uk-flex uk-flex-column">
							<nuxt-link :to="{name: 'inventory-product', params : {product : item.product_uuid}}" class="uk-flex uk-flex-column" v-if="can('view-products')">
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
					</div>

					<div class="uk-width-small grid-gutter">
						<span>
							{{item.variation_name | capitalize}}
						</span>
					</div>


					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.store_stock_quantity | number('0,0') | pluralize('Unit')}}
							</p>
						</div>
					</div>
					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.store_stock_cost_price | currency(`${emporium.currency} `) }}
							</p>
						</div>
					</div>
					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.store_stock_selling_price | currency(`${emporium.currency} `) }}
							</p>
						</div>
					</div>

					

					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small" :class="item.store_stock_profit < 0 ? 'uk-text-danger' : 'uk-text-success'">
								{{item.store_stock_profit | currency(`${emporium.currency} `) }}
							</p>
						</div>
					</div>

					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small" :class="item.store_stock_profit_margin < 0 ? 'uk-text-danger' : 'uk-text-success'">
								{{item.store_stock_profit_margin / 100 | percent }}
							</p>
						</div>
					</div>
				</div>
			</template>



			<template v-else-if="reportType === 'branches'">
				<div class="uk-width-1-1 uk-flex uk-flex-middle">

					<div class="uk-width-medium uk-width-1-1 uk-margin-right">
						<div class="uk-margin-small-bottom uk-flex uk-flex-column">
							<nuxt-link :to="{name: 'inventory-product', params : {product : item.product_uuid}}" class="uk-flex uk-flex-column" v-if="can('view-products')">
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
					</div>


					<div class="uk-width-small grid-gutter">
						<span>
							{{item.variation_name | capitalize}}
						</span>
					</div>


					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.branch_stock | number('0,0') | pluralize('Unit')}}
							</p>
						</div>
					</div>
					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.branch_stock_cost_price | currency(`${emporium.currency} `) }}
							</p>
						</div>
					</div>
					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.branch_stock_selling_price | currency(`${emporium.currency} `) }}
							</p>
						</div>
					</div>

					

					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small" :class="item.branch_stock_profit < 0 ? 'uk-text-danger' : 'uk-text-success'">
								{{item.branch_stock_profit | currency(`${emporium.currency} `) }}
							</p>
						</div>
					</div>

					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small" :class="item.branch_stock_profit_margin < 0 ? 'uk-text-danger' : 'uk-text-success'">
								{{item.branch_stock_profit_margin / 100 | percent }}
							</p>
						</div>
					</div>
				</div>
			</template>

			<template v-else-if="reportType === 'warehouse'">
				<div class="uk-width-1-1 uk-flex uk-flex-middle">

					<div class="uk-width-medium uk-width-1-1 uk-margin-right">
						<div class="uk-margin-small-bottom uk-flex uk-flex-column">
							<nuxt-link :to="{name: 'inventory-product', params : {product : item.product_uuid}}" class="uk-flex uk-flex-column" v-if="can('view-products')">
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
					</div>


					<div class="uk-width-small grid-gutter">
						<span>
							{{item.variation_name | capitalize}}
						</span>
					</div>

					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.warehouse_stock | number('0,0') | pluralize('Unit')}}
							</p>
						</div>
					</div>
					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.warehouse_stock_cost_price | currency(`${emporium.currency} `) }}
							</p>
						</div>
					</div>
					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.warehouse_stock_selling_price | currency(`${emporium.currency} `) }}
							</p>
						</div>
					</div>

					

					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small" :class="item.warehouse_stock_profit < 0 ? 'uk-text-danger' : 'uk-text-success'">
								{{item.warehouse_stock_profit | currency(`${emporium.currency} `) }}
							</p>
						</div>
					</div>

					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small" :class="item.warehouse_stock_profit_margin < 0 ? 'uk-text-danger' : 'uk-text-success'">
								{{item.warehouse_stock_profit_margin / 100 | percent }}
							</p>
						</div>
					</div>
				</div>
			</template>

			<template v-else>
				<div class="uk-width-1-1 uk-flex uk-flex-middle">

					<div class="uk-width-medium uk-width-1-1 uk-margin-right">
						<div class="uk-margin-small-bottom uk-flex uk-flex-middle">
							<nuxt-link :to="{name: 'inventory-product', params : {product : item.product_uuid}}" class="uk-flex uk-flex-middle" v-if="can('view-products')">
								<h5 class="uk-margin-remove-vertical underlined uk-text-primary">
									{{item.product_name}}
								</h5>
							</nuxt-link>

							<template v-else>
								<h5 class="uk-margin-remove-vertical">
									{{item.product_name}}
								</h5>
							</template>
						</div>
					</div>


					<div class="uk-width-small grid-gutter">
						<span>
							{{item.variation_name | capitalize}}
						</span>
					</div>


					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.unit_selling_price | currency(`${emporium.currency} `) }}
							</p>
						</div>
					</div>
					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.total_tax_amount | currency(`${emporium.currency} `) }}
							</p>
						</div>
					</div>

					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.quantity_recorded | number('0,0') | pluralize('Unit')}}
							</p>
						</div>
					</div>

					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.quantity_reversed | number('0,0') | pluralize('Unit')}}
							</p>
						</div>
					</div>

					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.quantity_purchased | number('0,0') | pluralize('Unit')}}
							</p>
						</div>
					</div>


					<div class="grid-gutter">
						<div class="uk-width-small">
							<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
								{{item.quantity_in_transition | number('0,0') | pluralize('Unit')}}
							</p>
						</div>
					</div>
				</div>
			</template>
		</template>
	</div>
</template>
<script>
export default {
	props : {
		item : {
			type : Object,
			required : true
		},

		reportType : {
			type : String,
			required : true,
		default : ''
		},

		display : {
			type : String,
			required : true,
		default : 'table'
		}
	},

	data(){
		return {
			generalVisibility : false,
			overallVisibility : false,
			branchVisibility : false,
			warehouseVisibility : false
		}
	}
}
</script>
