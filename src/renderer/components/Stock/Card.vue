<template>
	<div>

		<div class="uk-width-1-1 uk-flex">
			<div class="grid-gutter tiny-margin-right uk-light">
				<input type="checkbox" class="uk-checkbox square-20 uk-border-rounded bordered" v-model="select">
			</div>

			<div class="grid-gutter uk-padding-remove-top product-identity uk-width-expand uk-flex uk-flex-column">
				<p class="uk-margin-remove uk-text-capitalize">
					{{ product.product_variation.product.name }}
				</p>
				
				<span class="text-small uk-text-capitalize">
					{{product.product_variation.variation.name }} - {{product.product_variation.code}}
				</span>
			</div>

			<div class="grid-gutter uk-width-auto uk-margin-auto-left uk-margin-right uk-margin-auto-vertical">
				<div class="uk-width-1-1 uk-flex uk-flex-middle">
					<stock-availability :product="product.product_variation"></stock-availability>
				</div>
			</div>

			<div class="grid-gutter uk-width-small uk-margin-auto-vertical">
				<div class="uk-width-1-1">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
						{{  product.quantity | number('0,0') | pluralize('Unit')}}
					</p>
				</div>
			</div>

			<div class="grid-gutter uk-width-x-small uk-flex">
				<stock-health :product="product" v-if="product.product_variation.product.expires"></stock-health>
				<div class="uk-margin-small-left" v-else>
					---
				</div>
			</div>


			<div class="grid-gutter uk-width-small uk-margin-auto-vertical">
				<div class="uk-flex">
					<div class="chip label uk-border-rounded" :class="product.stock_alert">
						<span class="text-small uk-text-capitalize">
							{{product.stock_alert}}
						</span>
					</div>
				</div>
			</div>

			

			<div class="grid-gutter uk-margin-right uk-width-small uk-margin-auto-vertical">
				<div class="uk-flex uk-flex-left">
					<p class="uk-text-truncate uk-margin-remove-vertical label uk-border-rounded" :class="product.in_stock ? 'click label-success' : 'label-danger'">
						<span class="text-small">
							{{product.in_stock ? 'Available' : 'Out Of Stock'}}
						</span>
					</p>
				</div>
			</div>
			<div class="grid-gutter  uk-width-small uk-margin-auto-vertical">
				<div class="uk-width-1-1">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
						{{$moment(product.updated_at).format('DD MMM, YYYY')}}
					</p>
				</div>
			</div>

		</div>
	</div>
</template>
<script>
import {bindProps} from  "@/mixins/stock/singleton"
import {child} from "@/mixins/product/controls"
export default{
	mixins : [bindProps,child]
};
</script>
