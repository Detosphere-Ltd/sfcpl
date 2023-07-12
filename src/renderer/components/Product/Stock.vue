<template>
	<div class="uk-width-1-1">

		<div class="uk-width-1-1 uk-flex uk-flex-middle" @contextmenu.prevent="$uikit.drop($refs.options).show()">
			<div class="grid-gutter tiny-margin-right  uk-flex uk-flex-column">
				<div class="uk-light">
					<input type="checkbox" class="uk-checkbox square-20 uk-border-rounded bordered" v-model="select">
				</div>
				
			</div>


			<div class="grid-gutter uk-padding-remove-vertical product-identity uk-flex">
				<p class="uk-text-break uk-h6 uk-margin-remove uk-text-capitalize">
					<nuxt-link v-if="can('view-products')" class="uk-text-primary underlined" :to="{name: 'inventory-product', params : {product : product.product.uuid}}">
						{{ product.product.name }}
					</nuxt-link>

					<template v-else>
						<span class="uk-flex uk-flex-column">
							<span>
								{{ product.product.name }}
							</span>
						</span>
					</template>
				</p>
				
			</div>


			<div class="grid-gutter uk-width-small uk-flex">
				<span class="text-small uk-text-truncate uk-text-capitalize">
					{{product.variation.name}}
				</span>
			</div>

			<div class="grid-gutter uk-width-small uk-flex uk-flex-column">
				<span class="text-small uk-text-truncate uk-text-capitalize">
					{{product.code}}
				</span>
			</div>




			<div class="grid-gutter uk-width-small uk-flex">
				<stock-health :product="product" v-if="product.product.expires"></stock-health>
				<span v-else>
					- - - -
				</span>
			</div>

			<div class="grid-gutter uk-width-small uk-flex">
				<div class="chip label uk-border-rounded" :class="product.stock_alert">
					<span class="text-small uk-text-capitalize">
						{{product.stock_alert}}
					</span>
				</div>
			</div>


			<div class="grid-gutter uk-width-small">
				<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
					{{  product.warehouse_quantity | number('0,0') | pluralize('Unit')}}
				</p>
			</div>


			<div class="grid-gutter uk-width-small">
				<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
					{{  product.quantity_in_transition | number('0,0') | pluralize('Unit')}}
				</p>
			</div>


			<div class="grid-gutter uk-width-small">
				<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
					{{product.unit_selling_price | currency(`${emporium.currency} `)}}
				</p>
			</div>

			<div class="grid-gutter  uk-width-small uk-visible@xl">
				<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
					{{$moment(product.last_purchase.created_at).format('DD MMMM, YYYY')}}
				</p>
			</div>


			<div class="grid-gutter uk-width-x-small uk-margin-auto-left" v-if="any(['update-product-variation', 'record-stock-adjustments', 'view-stock'])">

				<div class="square-30 uk-border-rounded background bordered click uk-flex uk-flex-column uk-flex-center uk-flex-middle">
					<span class="mdi lni-large mdi-dots-horizontal"></span>
				</div>

				<div uk-drop="mode: click; delay-hide : 0; delay-show : 0; offset: 0; pos: bottom-right; flip : false" ref="options">
					<div class="background rounded bordered uk-width-medium stripped-bottom">

						<template v-if="can('view-products')">
							<nuxt-link v-slot="{navigate}" custom :to="{name: 'inventory-product', params : {product : product.product.uuid}}">
								<div class="uk-flex click tiny-padding success-on-hover" @click="navigate">

									<div class="uk-flex uk-flex-column uk-width-expand">
										<span class="uk-text-truncate uk-text-bold">View Product</span>
										<span class="text-small uk-text-truncate">
											View the details of this product
										</span>
									</div>
									<div class="square-30 rounded uk-button-view center uk-margin-small-left uk-margin-auto-vertical">
										<span class="mdi mdi-arrow-right uk-text-large"></span>
									</div>
								</div>
							</nuxt-link>
						</template>


						<template v-if="can('view-products')">
							<nuxt-link v-slot="{navigate}" custom :to="{name: 'inventory-product-pricing-history', params : {product : product.product.uuid}}">
								<div class="uk-flex click tiny-padding success-on-hover" @click="navigate">



									<div class="uk-flex uk-flex-column uk-width-expand">
										<span class="uk-text-truncate uk-text-bold">View Price History</span>
										<span class="text-small uk-text-truncate">
											View the price history for this product
										</span>
									</div>

									<div class="square-30 rounded uk-button-view center uk-margin-small-left uk-margin-auto-vertical">
										<span class="mdi mdi-trending-up uk-text-large"></span>
									</div>

								</div>
							</nuxt-link>
						</template>


						<product-actions-set-price :product="product" @price-changed="$emit('needs-to-refresh')"  @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()" v-if="can('update-product-variation')">
							<template #action-button>
								<div class="uk-flex click tiny-padding ">
									<div class="square-30 rounded bordered center uk-margin-small-right">
										<span class="mdi mdi-pencil"></span>
									</div>
									<div class="uk-flex uk-flex-column uk-width-expand">
										<span class="uk-text-truncate uk-text-bold">Update Selling Price</span>
										<span class="text-small uk-text-truncate">
											Update the unit selling price for this product
										</span>
									</div>
								</div>
							</template>
						</product-actions-set-price>

						<stock-availability class="tiny-margin-left" :product="product" @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()" v-if="can('view-stock')">
							<template #action-button>
								<div class="uk-flex click tiny-padding ">
									<div class="square-30 rounded uk-button-view center uk-margin-small-right">
										<span class="mdi mdi-magnify uk-text-large"></span>
									</div>
									<div class="uk-flex uk-flex-column uk-width-expand">
										<span class="uk-text-truncate uk-text-bold">Availability Check</span>
										<span class="text-small uk-text-truncate">
											Check across your store for the availability of this product
										</span>
									</div>
								</div>
							</template>
						</stock-availability>

						<stock-actions-record-adjustment class="tiny-margin-left" :product="product" @done="$emit('needs-to-refresh')" @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()" v-if="can('record-stock-adjustments')">
							<template #action-button>
								<div class="uk-flex click tiny-padding ">
									<div class="square-30 rounded uk-button-view center uk-margin-small-right">
										<span class="mdi mdi-wrap uk-text-large"></span>
									</div>
									<div class="uk-flex uk-flex-column uk-width-expand">
										<span class="uk-text-truncate uk-text-bold">Stock Adjustment</span>
										<span class="text-small uk-text-truncate">
											Record a stock adjustment for this product 
										</span>
									</div>
								</div>
							</template>
						</stock-actions-record-adjustment>
					</div>
				</div>
			</div>



		</div>

	</div>
</template>
<script>
import {bindProps} from  "@/mixins/stock/singleton"
import {child} from "@/mixins/product/controls"
export default{
	mixins : [bindProps,child],
};
</script>
