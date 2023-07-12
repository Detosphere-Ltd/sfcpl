<template>
	<div>
		<div class="square-25 click uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle"  @click="showModal = true">
			<span class="mdi mdi-pencil"></span>
		</div>
		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-large-top" :esc-to-close="true" overlay-class="uk-overlay-primary">
			<div class="uk-card rounded background bordered raised-deep uk-margin-auto uk-margin-auto-vertical uk-margin-remove-top uk-width-1-1 uk-inline uk-margin-auto uk-overflow-auto uk-width-medium@m uk-padding-remove">
				<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
					<h5 class="uk-margin-remove uk-text-bold">
						Edit Product Tags
					</h5>
					<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
						Close
					</a>
				</div>
				<div class="uk-padding-small">
					<form class="uk-width-1-1 uk-flex uk-flex-wrap uk-grid-collapse" uk-grid>
						<div class="uk-width-1-1@m ">
							<input type="text" class="uk-input" placeholder="Tag Name" v-model="tagForm.name" @focus="$store.dispatch('validation/clearErrors')">
							<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.name">
								{{errors.name[0]}}
							</span>
						</div>

						<div class="uk-width-1-1 uk-margin-small-top">
							<button class="uk-button uk-button-primary uk-border-rounded uk-button-small" :disabled="loading" @click.prevent="update">
								<partials-loader v-if="loading"></partials-loader>
								<template v-else>
									Update Tag
								</template>
							</button>
						</div>
					</form>

				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps, modify} from "@/mixins/productTag"
export default{
	mixins : [bindProps , modify],
	data(){
		return {
			showModal : false,
		}
	},
};
</script>
