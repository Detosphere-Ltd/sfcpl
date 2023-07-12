<template>
	<div>
		<button class="uk-button uk-button-primary uk-button-small" @click="showModal = true">
			<span class="tiny-margin-right mdi mdi-plus-circle uk-text-white"></span>
			New Purchase Unit
		</button>


		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="unitForm.name = ''">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s">


					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Add A New Purchase Unit
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
							Close
						</a>
					</div>
					<div class="uk-padding-small  uk-overflow-auto modal-content">
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
						<button class="uk-button uk-button-primary" @click="createUnitType" :disabled="!unitForm.name || loading">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>Save Purchase Unit</template>
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
			unitForm : {
				name : '',
				description : ''
			},
		}
	},

	methods : {

		async createUnitType(){
			this.loading = true

			await this.$axios.$post(`/unit-types`, this.unitForm)
			.then(()=>{
				this.showModal = false
				this.$emit('needs-to-refresh')
				this.$message.success(`New purchase unit created.`, 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to create new purchase unit. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},

		
	}
};
</script>
