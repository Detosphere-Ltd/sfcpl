<template>
	<div class="tiny-padding">
		<div class="uk-width-1-1 uk-flex uk-flex-top">

			<div class="grid-gutter tiny-margin-right  uk-flex uk-flex-column">
				<div class="uk-light">
					<input type="checkbox" class="uk-checkbox square-20 uk-border-rounded bordered" v-model="select">
				</div>	
			</div>


			<div class="grid-gutter uk-width-medium">
				<p class="uk-text-wrap uk-margin-remove ">
					<nuxt-link :to="{name: 'inventory-product', params : {product : product.uuid}}">
						<span class="underlined uk-text-primary"  :title="product.name">
							{{product.name }}
						</span>
					</nuxt-link>
				</p>
			</div>

			<div class="grid-gutter uk-width-small">
				<div class="uk-width-1-1">
					<span>
						{{product.code }}
					</span>
				</div>
			</div>

			<div class="grid-gutter uk-width-small uk-margin-auto-vertical">
				<div class="uk-flex">
					<p class="uk-text-truncate uk-margin-remove-vertical uk-border-rounded" :class="product.total_variations ? 'click uk-text-primary underlined' : 'u'" @click="product.total_variations ? showModal = true : ''">
						{{product.total_variations ? 'View ' : ''}}{{product.total_variations | pluralize('Variation')}}
					</p>
				</div>
			</div> 

			<div class="grid-gutter uk-width-small uk-margin-auto-vertical">
				<p class="uk-text-truncate uk-margin-remove">
					{{product.branch_quantity ? product.branch_quantity : 0 | number('0,0') | pluralize('Unit')}}
				</p>
			</div>
			<div class="grid-gutter uk-width-small uk-margin-auto-vertical">
				<p class="uk-text-truncate uk-margin-remove">
					{{product.warehouse_quantity ? product.warehouse_quantity : 0 | number('0,0') | pluralize('Unit')}}
				</p>
			</div>
			<div class="grid-gutter uk-width-small uk-margin-auto-vertical">
				<p class="uk-text-truncate uk-margin-remove">
					{{product.store_quantity ? product.store_quantity : 0 | number('0,0') | pluralize('Unit')}}
				</p>
			</div>
			<div class="grid-gutter uk-visible@l uk-width-small uk-margin-auto-vertical">
				<div class="uk-width-1-1 uk-flex">
					<span class="label uk-margin-auto-right" :class="product.active ? 'label-success' : 'label-danger'">
						<span>
							{{product.active ? "Active" : "Deactivated" }}
						</span>
					</span>
				</div>
			</div>

			<div class="grid-gutter uk-width-small uk-margin-auto-vertical">
				<p class="uk-text-truncate uk-margin-remove">
					{{$moment(product.created_at).format('DD MMM, YYYY')}}
				</p>
			</div>

			<div class="grid-gutter uk-width-small uk-margin-auto-vertical">
				<p class="uk-text-truncate uk-margin-remove">
					{{ product.created_by && product.created_by.name ? product.created_by.name : 'System Admin'  }}
				</p>
			</div>


			<div class="grid-gutter action-box uk-margin-auto-vertical">
				<div class="uk-flex uk-flex-left uk-flex-middle">
					<div class="square-30 uk-border-rounded background bordered click uk-flex uk-flex-column uk-flex-center uk-flex-middle">
						<span class="mdi lni-large mdi-dots-horizontal"></span>
					</div>

					<div uk-drop="mode: click; delay-hide : 0; delay-show : 0; offset: 0; pos: bottom-right" ref="options">
						<div class="background rounded bordered uk-width-medium stripped-bottom">

							<template v-if="can('view-products')">
								<nuxt-link v-slot="{navigate}" custom :to="{name: 'inventory-product', params : {product : product.uuid}}">
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
								<nuxt-link v-slot="{navigate}" custom :to="{name: 'inventory-product-pricing-history', params : {product : product.uuid}}">
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


							<product-actions-edit :product="product" @done="$emit('needs-to-refresh')"  @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()" v-if="can('update-products')">
								<template #action-button>
									<div class="uk-flex click tiny-padding ">
										<div class="square-30 rounded bordered center uk-margin-small-right">
											<span class="mdi mdi-pencil"></span>
										</div>
										<div class="uk-flex uk-flex-column uk-width-expand">
											<span class="uk-text-truncate uk-text-bold">Update Product</span>
											<span class="text-small uk-text-truncate">
												Update basic information about this product
											</span>
										</div>
									</div>
								</template>
							</product-actions-edit>


							<product-actions-manage-levies :product="product" @done="$emit('needs-to-refresh')"  @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()" v-if="can('update-products')">
								<template #action-button>
									<div class="uk-flex click tiny-padding ">
										<div class="square-30 rounded uk-button-view center uk-margin-small-right">
											<span class="mdi mdi-scale-balance uk-text-large"></span>
										</div>
										<div class="uk-flex uk-flex-column uk-width-expand">
											<span class="uk-text-truncate uk-text-bold">Manage Levies</span>
											<span class="text-small uk-text-truncate">
												Manage Taxes / Levies for this product
											</span>
										</div>
									</div>
								</template>
							</product-actions-manage-levies>

							<product-actions-stock-alert-settings :product="product" @done="$emit('needs-to-refresh')"  @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()" v-if="can('update-products')">
								<template #action-button>
									<div class="uk-flex click tiny-padding ">
										<div class="square-30 rounded uk-button-view center uk-margin-small-right">
											<span class="mdi mdi-alert"></span>
										</div>
										<div class="uk-flex uk-flex-column uk-width-expand">
											<span class="uk-text-truncate uk-text-bold">Stock Alert Settings</span>
											<span class="text-small uk-text-truncate">
												Manage stock alert settings for this product
											</span>
										</div>
									</div>
								</template>
							</product-actions-stock-alert-settings>


							<product-actions-record-purchase :product="product" @done="$emit('needs-to-refresh')"  @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()" v-if="can('record-purchases')">
								<template #action-button>
									<div class="uk-flex click tiny-padding ">
										<div class="square-30 rounded uk-button-view center uk-margin-small-right">
											<span class="mdi mdi-receipt uk-text-large"></span>
										</div>
										<div class="uk-flex uk-flex-column uk-width-expand">
											<span class="uk-text-truncate uk-text-bold">Record Purchase</span>
											<span class="text-small uk-text-truncate">
												Record a new purchase for this product
											</span>
										</div>
									</div>
								</template>
							</product-actions-record-purchase>


							<product-actions-customize-purchase :product="product" @done="$emit('needs-to-refresh')"  @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()" v-if="can('update-products')">
								<template #action-button>
									<div class="uk-flex click tiny-padding ">
										<div class="square-30 rounded uk-button-view center uk-margin-small-right">
											<span class="mdi mdi-card-bulleted-outline uk-text-large"></span>
										</div>
										<div class="uk-flex uk-flex-column uk-width-expand">
											<span class="uk-text-truncate uk-text-bold">Add Custom Purchase Fields</span>
											<span class="text-small uk-text-truncate">
												Configure custom purchase fields for this product
											</span>
										</div>
									</div>
								</template>
							</product-actions-customize-purchase>



					<!-- 	<stock-availability class="tiny-margin-left" :product="product" @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()" v-if="can('view-stock')">
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
						</stock-availability> -->

					<!-- 	<stock-actions-record-adjustment class="tiny-margin-left" :product="product" @done="$emit('needs-to-refresh')" @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()" v-if="can('record-stock-adjustments')">
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
						</stock-actions-record-adjustment> -->
					</div>
				</div>
			</div>
		</div>

	</div>






	<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary">
		<div class="uk-width-1-1 uk-margin-large-top">
			<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-2xlarge@s  uk-inline">
				<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
					<h5 class="uk-margin-remove uk-text-bold uk-text-truncate">
						{{product.name  | capitalize }} - {{product.code}}
					</h5>
					<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
						Close
					</a>
				</div>

				<div class="tiny-padding uk-overflow-auto modal-content">
					<div class="uk-width-1-1 uk-flex uk-flex-middle">

						<div class="grid-gutter uk-width-expand">
							<div>
								<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
									Vartiaion
								</h6>
							</div>
						</div>


						<div class="grid-gutter uk-width-small">
							<div>
								<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small uk-text-center">
									QTY
								</h6>
							</div>
						</div>



						<div class="grid-gutter uk-width-small">
							<div>
								<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
									Availability
								</h6>
							</div>
						</div>

					</div>


					<div class="uk-width-1-1 uk-flex uk-flex-column grid-padding uk-padding-remove-horizontal" v-for="(variant, key) in product.variations" :key="variant.uuid" :class="key < (product.variations.length - 1) ?  'border-bottom' : '' ">

						<div class="uk-flex uk-flex-middle uk-width-1-1">
							<div class="grid-gutter uk-width-expand">
								<div>
									<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
										{{ variant.variation.name | variationize }} &bull; {{variant.code}}
									</p>
								</div>
							</div>


							<div class="grid-gutter uk-width-small">
								<div>
									<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small uk-text-center">
										{{  variant.store_quantity | number('0,0')}} {{variant.store_quantity | pluralize('Unit')  }}
									</p>
								</div>
							</div>


							<div class="grid-gutter uk-width-small">
								<div class="uk-flex">
									<div class="chip uk-background-success-op rounded click" @click="showMe !== variant.uuid  ? showMe = variant.uuid : showMe = ''">
										<span class="text-small">
											See Availability
										</span>

										<span class="mdi" :class="showMe && showMe === variant.uuid ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
									</div>
								</div>
							</div>
						</div>
						<div class="uk-width-1-1" v-if="showMe && showMe === variant.uuid">
							<div v-if="chosenVariant && chosenVariant.total_available_branches">
								<div class="uk-padding-small uk-margin-small-top uk-padding-remove-horizontal border-top">
									<h5 class="uk-text-small">
										{{product.name  | capitalize}} {{chosenVariant.code}} is available in the following branches.
									</h5>

									<div class="uk-flex uk-flex-column">
										<div class="tiny-padding bordered background uk-border-rounded uk-flex uk-flex-between" v-for="(branch, indexx) in chosenVariant.available_branches" :key="(indexx + 7)*9">
											<div class="uk-width-1-2">
												<span class="text-small uk-text-capitalize uk-text-truncate">
													{{branch.name | branchize}}
												</span>
											</div>

											<div class="uk-width-1-2">
												<p class="text-small uk-text-capitalize uk-text-truncate uk-text-right uk-margin-remove">
													{{branch.quantity | pluralize("Unit")}} Available
												</p>
											</div>
										</div>
									</div>

								</div>
							</div>
							<div class="uk-padding-small background uk-flex uk-flex-column uk-flex-middle uk-margin-top border-top" v-else>
								<span class="mdi mdi-package lni-mid-large uk-margin-bottom"></span>
								<p class="uk-margin-remove uk-text-center">
									This variation of {{product.name  | capitalize}} is not available in any of your store's branches.
								</p>
							</div>


						</div>

					</div>
				</div>
			</div>
		</div>
	</vue-final-modal>



</div>
</template>
<script>
import {child} from "@/mixins/product/controls"
import {bindProps} from "@/mixins/product/singleton"
export default{
	mixins : [child, bindProps],
	data(){
		return {
			showModal : false,
			showMe : ''
		}
	},

	computed : {
		chosenVariant(){
			if (this.showMe) {
				return this.product.variations.filter(item => {return item.uuid === this.showMe})[0]
			}

			return null
		}
	}
};
</script>
