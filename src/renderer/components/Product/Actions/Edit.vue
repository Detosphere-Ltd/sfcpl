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

	<div class="uk-width-1-1 uk-padding-remove"  uk-modal="esc-close: false; bg-close: false; sel-close: .product-update-modal; delay-hide: 0; delay-show: 0; stack: true" ref="modal" @beforeshow="$emit('opening')"  @beforehide="$emit('closing')">
		<div :class="colorMode" class="uk-modal-dialog transparent uk-padding-remove uk-width-large@s uk-margin-large-top uk-animation-slide-top-small uk-animation-fast uk-width-1-1 uk-border-rounded">
			<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s uk-inline">

				<div class="uk-position-cover uk-position-z-index" v-if="loading">
					<div class="uk-height-1-1 uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered rounded">
						<loaders-spinner class="uk-margin-bottom"></loaders-spinner>
						<span>Updating product details...</span>
					</div>
				</div>

				<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
					<h5 class="uk-margin-remove uk-text-bold">
						Edit Product
					</h5>
					<a class="uk-button uk-button-small uk-button-danger uk-border-rounded product-update-modal">
						Close
					</a>
				</div>


				<div class="tiny-padding uk-overflow-auto modal-content">
					<div class="uk-width-1-1 uk-flex uk-flex-wrap">
						<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom">
							<span class="text-small tiny-margin-bottom form-label">
								Product Name
							</span>
							<input type="text" class="uk-input uk-form-large" placeholder="Product Name" v-model="productForm.name" @focus="$store.dispatch('validation/clearErrors')">
							<span v-if="errors && errors.name" class="uk-text-small uk-text-danger">{{errors.name[0]}}</span>
						</div>

						<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom">
							<span class="text-small tiny-margin-bottom form-label">
								Product Description
							</span>
							<textarea  rows="5" class="uk-textarea" placeholder="Product description" v-model="productForm.description" @focus="$store.dispatch('validation/clearErrors')"></textarea>
							<span v-if="errors && errors.description" class="uk-text-small uk-text-danger">{{errors.description[0]}}</span>
						</div>


						<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom">
							<span class="text-small tiny-margin-bottom form-label">
								Product Tags (Categories)
							</span>

							<div class="uk-flex uk-flex-column uk-width-1-1 tags-input background">
								<a-select mode="multiple" class="uk-width-1-1 uk-text-small" size="large" notFoundContent="" option-label-prop="name" :tokenSeparators="[',']" placeholder="Select tags related to this product" v-model="tags" @focus="$store.dispatch('validation/clearErrors')">
									<a-select-option v-for="tg in availableTags" :value="tg.name" :name="tg.name" :key="tg.name">
										<span class="text-small uk-text-capitalize">
											{{tg.name}}
										</span>
									</a-select-option>
								</a-select>
								<span v-if="errors && errors.tags" class="uk-text-small uk-text-danger">{{errors.tags[0]}}</span>
							</div>
						</div>


						<!--  -->

						<div class="grid-gutter">
							<div class="uk-width-1-1 tiny-padding bordered rounded">
								<div class="uk-flex uk-flex-middle uk-flex-between grid-padding uk-padding-remove-horizontal">

									<label class="uk-flex uk-flex-top grid-gutter uk-padding-remove-bottom click">
										<div class="uk-light uk-margin-small-right tiny-margin-top uk-width-auto">
											<input type="checkbox" class="uk-checkbox  uk-border-rounded  bordered square-20" v-model="productForm.expires" :disabled="loading">
										</div>
										<span class="uk-flex uk-flex-column uk-width-expand text-small">
											<span class="uk-text-bold">This product expires</span>
											<span>
												If selected, you'll be required to set an expiry date for every purchase you make for this product. 
											</span>
										</span>
									</label>
								</div>
							</div>
						</div>


					</div>
				</div>

				<div class="uk-width-1-1 tiny-padding border-top uk-flex uk-flex-center">
					<button class="uk-button uk-button-primary" @click="updateProduct" :disabled="!productForm.name || loading">
						<partials-loader v-if="loading"></partials-loader>
						<template v-else>Update Product Info</template>
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
