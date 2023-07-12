<template>
	<div>
		<div @click="$uikit.modal($refs.modal).show()" class="click">
			<slot name="action-button">
				<a class="uk-text-truncate uk-margin-remove-vertical chip uk-border-rounded uk-background-primary">
					<small class="text-small uk-text-truncate uk-text-white">
						Set Price
					</small>
				</a>
			</slot>
		</div>


		<div class="uk-width-1-1 uk-padding-remove"  uk-modal="esc-close: false; bg-close: false; sel-close: .stock-pricing-update-modal; delay-hide: 0; delay-show: 0; stack: true" ref="modal" @beforeshow="$emit('opening');"  @beforehide="$emit('closing')">
			<div :class="colorMode" class="uk-modal-dialog transparent uk-padding-remove uk-width-medium@s uk-margin-auto-vertical uk-animation-slide-top-small uk-animation-fast uk-width-1-1 uk-border-rounded">
				
				<div class="uk-width-1-1 background uk-inline uk-flex uk-flex-column uk-border-rounded no-radius-sm bordered no-border-sm">
					<div class="rounded background uk-position-cover uk-position-z-index center bordered uk-padding-small" v-if="loading">
						<loaders-spinner></loaders-spinner>
						<span class="uk-margin-small-top">
							Updating Price...
						</span>
					</div>

					<div class="tiny-padding border-bottom uk-flex uk-flex-middle">

						<div class="uk-width-expand">
							<div class="uk-flex uk-flex-column">
								<span class="uk-h5 uk-margin-remove uk-text-bold">
									Adjust Product Price
								</span>
							</div>
						</div>

						<div class="uk-button uk-button-danger uk-button-small stock-pricing-update-modal uk-text-white">
							Close
						</div>
					</div>

					<div class=" uk-overflow-auto modal-content">
						<div class="tiny-padding uk-flex uk-flex-column">
							<span class="uk-text-small uk-margin-small-bottom">Enter amount to use as new selling price. This change will take effect immediately across all branches.</span>
							<a-input-number :step="0.01" v-model="price" large></a-input-number>
							<span class="text-small tiny-margin-bottom uk-text-danger" v-if="errors && errors.unit_selling_price">{{errors.unit_selling_price[0]}}</span>
							
						</div>
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-primary uk-width-1-1 uk-button-large " :disabled="!price || loading" @click="adjustPricing">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>
								Update Price
							</template>
						</button>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {bindProps, pricing} from "@/mixins/product/singleton"
export default{
	mixins : [bindProps, pricing],

	mounted(){
		this.$on('done', ()=>{
			this.$uikit.modal(this.$refs.modal).hide()
		})
	}
};
</script>
