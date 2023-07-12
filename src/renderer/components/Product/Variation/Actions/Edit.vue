<template>
	<div>
		<button class="uk-button uk-button-view uk-button-small uk-border-rounded" @click="showModal = true" :disabled="variant.name === 'Default' || variant.name === 'default'">
			Edit
		</button>
		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-large-top" :esc-to-close="true" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium-large@s">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Edit Variation
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
							Close
						</a>
					</div>
					<div class="uk-with-1-1 uk-overflow-auto modal-content tiny-padding">
						<div class="uk-width-1-1 uk-flex uk-flex-wrap">
							<div class="uk-width-1-1 grid-gutter uk-flex uk-flex-column">
								<span class="text-small tiny-margin-bottom">
									Variation Name
								</span>
								<input type="text" class="uk-input uk-form-large" placeholder="Variation Name" v-model="variantForm.name" @focus="$store.dispatch('validation/clearErrors')">
								<span v-if="errors && errors.name" class="uk-text-small uk-text-danger">{{errors.name[0]}}</span>
							</div>

						<!-- 	<div class="uk-width-1-1 grid-gutter uk-flex uk-flex-column">
								<span class="text-small tiny-margin-bottom">
									Variation Code
								</span>
								<input type="text" class="uk-input uk-form-large" placeholder="Variation Code" v-model="variantForm.code" @focus="$store.dispatch('validation/clearErrors')">
								<span v-if="errors && errors.code" class="uk-text-small uk-text-danger">{{errors.code[0]}}</span>
							</div> -->
						</div>

					</div>

					<div class="uk-width-1-1 tiny-padding border-top">
						<button class="uk-button uk-button-primary uk-border-rounded uk-button-small" :disabled="loading" @click.prevent="update">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>
								Update Variation
							</template>
						</button>
					</div>

				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps, modify} from "@/mixins/product/variant"
export default{
	mixins : [bindProps , modify],
	data(){
		return {
			showModal : false,
		}
	},
};
</script>
