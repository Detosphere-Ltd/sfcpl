<template>
	<div>
		<div class="square-30 uk-background-success-op click uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle"  @click="showModal = true">
			<span class="mdi mdi-pencil"></span>
		</div>
		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="unitForm.name = ''">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s">


					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Edit Purchase Unit
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
							Close
						</a>
					</div>
					<div class="uk-padding-small uk-overflow-auto modal-content">
						<div class="uk-width-1-1 uk-flex uk-flex-wrap">
							<div class="uk-width-1-1 grid-gutter uk-flex uk-flex-column">
								<span class="tiny-margin-bottom text-small">
									Unit Name
								</span>
								<input type="text" class="uk-input uk-form-large" placeholder="Unit Name" v-model="unitForm.name" @focus="$store.dispatch('validation/clearErrors')">
								<span v-if="errors && errors.name" class="uk-text-small uk-text-danger">{{errors.name[0]}}</span>
							</div>
						</div>

						<div class="uk-width-1-1 uk-flex uk-flex-wrap">
							<div class="uk-width-1-1 grid-gutter uk-flex uk-flex-column">
								<span class="tiny-margin-bottom text-small">
									Description (Optional)
								</span>
								<textarea rows="5" class="uk-textarea" placeholder="Describe this purchase unit" v-model="unitForm.description" @focus="$store.dispatch('validation/clearErrors')"></textarea>
								<span v-if="errors && errors.description" class="uk-text-small uk-text-danger">{{errors.description[0]}}</span>
							</div>
						</div>
						
					</div>

					<div class="uk-width-1-1 tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-primary" @click="patch" :disabled="!unitForm.name || loading">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>Update Purchase Unit</template>
						</button>
					</div>


				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps, modify} from "@/mixins/unit"
export default{
	mixins : [bindProps , modify],
	data(){
		return {
			showModal : false,
		}
	},
};
</script>
