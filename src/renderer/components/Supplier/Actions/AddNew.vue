<template>
	<div>
		<div @click="showModal = true">
			<slot name="action-button">
				<button class="uk-button uk-button-primary uk-button-small">
					<span class="tiny-margin-right mdi mdi-plus-circle uk-text-white"></span>
					New Supplier
				</button>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="reset" attach=".app">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s">

					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Register A New Supplier 
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
							Close
						</a>
					</div>
					<div class="tiny-padding  uk-overflow-auto modal-content">
						<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-child-width-1-1 uk-grid-collapse" uk-grid>

							<div class="grid-padding">
								<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Supplier name" v-model="supplierForm.name" @focus="$store.dispatch('validation/clearErrors')">
								<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.name">
									{{errors.name[0]}}
								</span>
							</div>

							<div class="grid-padding">
								<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Email Address" v-model="supplierForm.email" @focus="$store.dispatch('validation/clearErrors')">
								<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.email">
									{{errors.email[0]}}
								</span>
							</div>

							<div class="grid-padding">
								<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Phone Number" v-model="supplierForm.phone" @focus="$store.dispatch('validation/clearErrors')">
								<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.phone">
									{{errors.phone[0]}}
								</span>
							</div>

							<div class="grid-padding">
								<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Country" v-model="supplierForm.country" @focus="$store.dispatch('validation/clearErrors')">
								<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.country">
									{{errors.country[0]}}
								</span>
							</div>	

							<div class="grid-padding">
								<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="City" v-model="supplierForm.city" @focus="$store.dispatch('validation/clearErrors')">
								<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.city">
									{{errors.city[0]}}
								</span>
							</div>
						</div>
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<div class="grid-padding">
							<slot></slot>
							<button class="uk-button uk-button-primary tiny-margin-left" :disabled="loading || !supplierForm.name || (!supplierForm.phone && !supplierForm.email)" @click.prevent="addSupplier">
								<partials-loader v-if="loading"></partials-loader>
								<template v-else>Record Supplier</template>
							</button>
						</div>
					</div>
				</div>

			</div>
		</vue-final-modal>

	</div>
</template>
<script>
import {create} from "@/mixins/suppliers"
export default{
	mixins : [create],
	data(){
		return {
			showModal : false,
		}
	}

};
</script>
