<template>
	<div class="uk-width-1-1 uk-inline">
		<!-- <a class="uk-border-circle square-30 bordered uk-flex uk-flex-column uk-flex-center uk-flex-middle" @click="showModal = true">
			<span class="mdi mdi-dots-horizontal lni-large"></span>
		</a> -->

		<div class="chip uk-flex-center uk-background-success click uk-border-rounded" @click="showModal = true">
			<small class="uk-text-white">
				Actions
			</small>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">

				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium uk-transform-origin-bottom-right">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold uk-text-truncate">
							Product Actions
						</h5>
						<a class="uk-button uk-button-small uk-button-danger rounded" @click="showModal = false">
							Close
						</a>
					</div>
					<div class="background rounded-bottom uk-flex uk-flex-column">

						<div v-if="can('update-products')" class="border-bottom">
							<product-actions-edit :product="product" @done="$emit('done')">
								<div class="grid-padding primary-on-hover uk-flex uk-flex-middle" slot="action-button">
									<div class="square-30 uk-button-view uk-border-circle uk-margin-small-right uk-flex uk-flex-column uk-flex-center uk-flex-middle">
										<span class="mdi mdi-pencil"></span>
									</div>
									<div class="uk-width-expand">
										<p class="uk-margin-remove">
											Edit Product Information
										</p>
									</div>
								</div>
							</product-actions-edit>
						</div>

						<div v-if="can('update-products')" class="border-bottom">
							<product-actions-stock-alert-settings :product="product" @done="$emit('done')">
								<div class="grid-padding primary-on-hover uk-flex uk-flex-middle" slot="action-button">
									<div class="square-30 uk-button-view uk-border-circle uk-margin-small-right uk-flex uk-flex-column uk-flex-center uk-flex-middle">
										<span class="mdi mdi-scale-balance"></span>
									</div>
									<div class="uk-width-expand">
										<p class="uk-margin-remove">
											Manage Stock Alert Settings
										</p>
									</div>
								</div>
							</product-actions-stock-alert-settings>
						</div>

						<div v-if="can('record-purchases')">
							<product-actions-record-purchase :product="product" @done="$emit('done')">
								<div class="grid-padding primary-on-hover uk-flex uk-flex-middle" slot="action-button">
									<div class="square-30 uk-border-circle uk-button-view uk-margin-small-right uk-flex uk-flex-column uk-flex-center uk-flex-middle">
										<span class="mdi mdi-plus"></span>
									</div>
									<div class="uk-width-expand">
										<p class="uk-margin-remove">
											Record A New Purchase
										</p>
									</div>
								</div>
							</product-actions-record-purchase>
						</div>
						


						<div class="border-top" v-if="can('change-product-active-status')">
							<product-actions-customize-purchase :product="product" @done="$emit('done')">
								<div class="grid-padding uk-flex uk-flex-middle rounded-bottom primary-on-hover" slot="action-button">
									<div class="square-30 uk-border-circle uk-margin-small-right uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-button-view">
										<span class="mdi mdi-cog"></span>
									</div>
									<div class="uk-width-expand">
										<p class="uk-margin-remove">
											Custom Purchase Fields
										</p>
									</div>
								</div>
							</product-actions-customize-purchase>
						</div>


						<div class="border-top" v-if="can('change-product-active-status')">
							<product-actions-toggle-status :product="product" @status-changed="$emit('done')">
								<div class="grid-padding uk-flex uk-flex-middle rounded-bottom" slot="action-button" :class="product.active ? 'danger-on-hover' : 'primary-on-hover'">
									<div class="square-30 uk-border-circle uk-margin-small-right uk-flex uk-flex-column uk-flex-center uk-flex-middle" :class="product.active ? 'uk-background-danger-op' : 'uk-background-primary-op'">
										<span class="mdi" :class="product.active ? 'mdi-cancel' : 'mdi-check'"></span>
									</div>
									<div class="uk-width-expand">
										<p class="uk-margin-remove">
											{{product.active ? "Deactivate" : "Activate"}} Product
										</p>
									</div>
								</div>
							</product-actions-toggle-status>
						</div>

						
					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/product/singleton"
export default{
	mixins : [bindProps],
	data(){
		return {
			showModal : false,
		}
	},
};
</script>
