<template>
	<div class="tiny-padding uk-padding-remove-top">
		<section class="uk-section uk-section-small uk-padding-remove-vertical uk-margin-small-top">
			<h4 class="uk-margin-small uk-margin-small-top">
				General Summary
			</h4>
			<div class="uk-width-1-1 uk-flex uk-flex-wrap">

				<div class="grid-gutter uk-padding-remove-left">
					<div class="background bordered uk-border-rounded uk-padding-small stat-card uk-flex uk-flex-column">
						<span class="text-small uk-margin-remove uk-text-capitalize">Product Varitaions</span>
						<span class="uk-text-small uk-text-bold">
							{{product.variations.length | pluralize('Varitaion')}}
						</span>
					</div>
				</div>

				
				<div class="grid-gutter uk-padding-remove-left">
					<div class="background bordered uk-border-rounded uk-padding-small stat-card uk-flex uk-flex-column">
						<span class="text-small uk-margin-remove uk-text-capitalize">Qty. In Branches</span>
						<span class="uk-text-small uk-text-bold">
							{{product.branch_quantity | pluralize('Unit')}}
						</span>
					</div>
				</div>

				<div class="grid-gutter uk-padding-remove-left">
					<div class="background bordered uk-border-rounded uk-padding-small stat-card uk-flex uk-flex-column">
						<span class="text-small uk-margin-remove uk-text-capitalize">Qty. In Transit</span>
						<span class="uk-text-small uk-text-bold">
							{{product.quantity_in_transition | pluralize('Unit')}}
						</span>
					</div>
				</div>

				<div class="grid-gutter uk-padding-remove-left">
					<div class="background bordered uk-border-rounded uk-padding-small stat-card uk-flex uk-flex-column">
						<span class="text-small uk-margin-remove uk-text-capitalize">Qty. At Warehouse</span>
						<span class="uk-text-small uk-text-bold">
							{{product.warehouse_quantity | pluralize('Unit')}}
						</span>
					</div>
				</div>

				<div class="grid-gutter uk-padding-remove-left">
					<div class="background bordered uk-border-rounded uk-padding-small stat-card uk-flex uk-flex-column">
						<span class="text-small uk-margin-remove uk-text-capitalize">Total Available Quantity</span>
						<span class="uk-text-small uk-text-bold">
							{{product.store_quantity | pluralize('Unit')}}
						</span>
					</div>
				</div>
			</div>
		</section>


		<section class="uk-section uk-section-small uk-padding-remove-vertical uk-margin-small-top">	

			<template v-if="product.variations && product.variations.length > 0">
				<div class="bordered uk-border-rounded">
					<div class="tiny-padding border-bottom">
						<h4 class="uk-margin-remove">
							Product Variations for {{product.name}}
						</h4>
					</div>
					<div class="border-bottom"></div>
					<headers-product-variations class="tiny-padding border-bottom"></headers-product-variations>

					<div class="uk-width-1-1 uk-grid-collapse uk-child-width-1-1" uk-grid>
						<div class="grid-padding uk-padding-remove-left" v-for="(variant, i) in product.variations" :key="variant.uuid">
							<product-variant-display :variant="variant" class="tiny-padding" :class="i < product.variations.length -1 ? 'border-bottom' : ''"></product-variant-display>
						</div>
					</div>
				</div>
			</template>

			<template v-else>
				<div class="uk-width-1-1 bordered background uk-border-rounded uk-padding">
					<h4>
						No variation records
					</h4>
					<p>
						There are no variation records for this product. Variations you select when recording purchases will show up here.
					</p>

					<div class="uk-flex">
						<product-actions-record-purchase :product="product" @done="$nuxt.refresh()">
							<button class="uk-button uk-button-primary" slot="action-button">
								Record A New Purchase
							</button>
						</product-actions-record-purchase>
					</div>

				</div>
			</template>


		</section>


		<section class="uk-section uk-section-small" v-if="can('view-purchases')">
			<product-recent-purchases class="bordered background uk-border-rounded" :product="product" @needs-to-refresh="$nuxt.refresh()">
			</product-recent-purchases>
		</section>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/product/singleton"
export default{
	mixins : [bindProps]
};
</script>
