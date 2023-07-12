<template>
	<div>
		<button class="uk-button uk-button-primary uk-button-small" @click="showModal = true">
			<span class="tiny-margin-right mdi mdi-plus-circle uk-text-white"></span>
			New Product Tag
		</button>


		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="tagForm.name = ''">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s uk-overflow-auto modal-content">


					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Add A New Product Tag
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
							Close
						</a>
					</div>
					<div class="uk-padding-small">
						<div class="uk-width-1-1 uk-flex uk-flex-wrap">
							<div class="uk-width-1-1 grid-gutter">
								<input type="text" class="uk-input uk-form-large" placeholder="Tag Name" v-model="tagForm.name" @focus="$store.dispatch('validation/clearErrors')">
								<span v-if="errors && errors.name" class="uk-text-small uk-text-danger">{{errors.name[0]}}</span>
							</div>
						</div>

						
					</div>

					<div class="uk-width-1-1 tiny-padding uk-flex uk-flex-center border-top">
						<button class="uk-button uk-button-primary" @click="createTag" :disabled="!tagForm.name || loading">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>Save Tag</template>
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
			tagForm : {
				name : '',
			},
		}
	},

	methods : {

		async createTag(){
			this.loading = true

			await this.$axios.$post(`/tags`, this.tagForm)
			.then(()=>{
				this.showModal = false
				this.$emit('needs-to-refresh')
				this.$message.success(`New product tag added to your catalog.`, 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to add new product tag to your catalog. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},

		
	}
};
</script>
