<template>
	<div>
		<div class="click" @click="showModal = true">
			<slot name="action-button">
				<button class="uk-button uk-button-primary uk-button-small">
					New Variation
				</button>
			</slot>
		</div>


		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="variantForm.name = ''" attach=".app">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium-large@s">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Add A New Product Variation
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

							<div class="uk-width-1-1 grid-gutter uk-flex uk-flex-column">
								<span class="text-small tiny-margin-bottom">
									Code - (Leave blank to auto-generate)
								</span>
								<input type="text" class="uk-input uk-form-large" placeholder="Variation Code" v-model="variantForm.code" @focus="$store.dispatch('validation/clearErrors')">
								<span v-if="errors && errors.code" class="uk-text-small uk-text-danger">{{errors.code[0]}}</span>
							</div>
						</div>

					</div>



					<div class="uk-width-1-1 tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-primary" @click="createVariation" :disabled="!variantForm.name || loading">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>Add Variation</template>
						</button>
					</div>


				</div>
			</div>
		</vue-final-modal>

	</div>
</template>
<script>
import {mapGetters} from "vuex"
export default{
	data(){
		return {
			showModal : false,
			loading : false,
			variantForm : {
				name : '',
				code : ''
			},
		}
	},

	methods : {

		async createVariation(){
			this.loading = true
			await this.$axios.$post(`/variations`, this.variantForm)
			.then(()=>{
				this.showModal = false
				this.variantForm = {
					name : '',
					code : ''
				}
				this.$emit('needs-to-refresh')
				this.$message.success(`New product variation type added to your catalog.`, 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to add new product variation type to your catalog. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},

		
	}
};
</script>
