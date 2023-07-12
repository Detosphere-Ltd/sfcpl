<template>
	<div>
		<div @click="$uikit.modal($refs.modal).show()" class="click">
			<slot name="action-button">
				<button  class="uk-button uk-button-primary  uk-flex-middle uk-flex uk-button-small">
					<span class="uk-margin-small-right mdi mdi-plus-circle uk-text-white"></span>
					Update Product
				</button>
			</slot>
		</div>

		<div class="uk-width-1-1 uk-padding-remove"  uk-modal="esc-close: false; bg-close: false; sel-close: .product-update-modal; delay-hide: 0; delay-show: 0; stack: true" ref="modal" @beforeshow="$emit('opening'); getDetails()"  @beforehide="$emit('closing')">
			<div :class="colorMode" class="uk-modal-dialog transparent uk-padding-remove uk-width-large@s uk-margin-large-top uk-animation-slide-top-small uk-animation-fast uk-width-1-1 uk-border-rounded">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s uk-inline">

					<div class="uk-position-cover uk-position-z-index" v-if="loading">
						<div class="uk-height-1-1 uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered rounded">
							<loaders-spinner class="uk-margin-bottom"></loaders-spinner>
							<span>Updating product details...</span>
						</div>
					</div>

					<div class="uk-position-cover uk-position-z-index" v-if="fetching">
						<div class="uk-height-1-1 uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered rounded">
							<loaders-spinner></loaders-spinner>
						</div>
					</div>

					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Manage Product Taxes / Levies
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded product-update-modal">
							Close
						</a>
					</div>


					<div class="tiny-padding uk-overflow-auto modal-content" style="min-height: 150px">
						<div class="grid-gutter uk-flex uk-flex-column" v-if="$store.getters['levies/product_levies'] && $store.getters['levies/product_levies'].length > 0">
							<span class="text-small uk-margin-small-bottom uk-text-bold">
								Select Applicable Product Specific Levies (Taxes)
							</span>

							<div class="uk-width-1-1 uk-flex uk-flex-column stripped-bottom bordered rounded">
								<div class="uk-width-1-1 uk-flex" v-for="levy in $store.getters['levies/product_levies']" :key="levy.uuid">
									<div class="uk-light uk-width-auto center uk-margin-small-right border-right tiny-padding">
										<input type="checkbox" class="uk-checkbox square-20 bordered rounded" :value="levy.uuid" v-model="levies">
									</div>
									<div class="uk-width-expand tiny-padding center">
										<div class="uk-width-1-1 uk-flex uk-flex-column">
											<p class="uk-margin-remove">
												{{levy.name}}
											</p>
										</div>
									</div>

									<div class="uk-width-x-small border-left tiny-padding center">
										<span>
											{{levy.percent / 100 | percent}}
										</span>
									</div>

								</div>
							</div>
						</div>
						
					</div>

					<div class="uk-width-1-1 tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-primary" @click="updateLevies" :disabled="loading">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>Update Product Levies</template>
						</button>
					</div>
				</div>

			</div>
		</div>

	</div>
</template>
<script>
import {bindProps, patch} from "@/mixins/product/singleton"
export default{
	mixins : [bindProps, patch],
	mounted(){
		this.$on('done', ()=>{
			this.$uikit.modal(this.$refs.modal).hide()
		})
	}
};
</script>
