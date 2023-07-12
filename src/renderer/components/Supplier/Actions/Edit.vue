<template>
	<div>
		<a class="chip uk-button-view uk-border-rounded" @click="showModal = true">
			<span class="text-small">
				Edit Details
			</span>
		</a>
		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-large-top" :esc-to-close="true" overlay-class="uk-overlay-primary">
			<div class="uk-card rounded bordered background raised-deep uk-margin-auto uk-margin-auto-vertical uk-margin-remove-top uk-width-1-1 uk-inline uk-margin-auto uk-overflow-auto uk-width-large@m uk-padding-remove">
				<div class="uk-width-1-1 tiny-padding uk-background-close uk-flex uk-flex-middle uk-flex-between border-bottom">
					<h5 class="uk-margin-remove uk-text-bold">
						Edit Supplier Details
					</h5>

					<div class="square-25 uk-background-danger uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle click" @click.prevent="showModal = false">
						<span class="mdi mdi-close uk-text-white"></span>
					</div>
				</div>
				<div class="tiny-padding">
					
					<form class="uk-width-1-1 uk-flex uk-flex-wrap uk-grid-collapse" uk-grid>
						<div class="uk-width-1-1 grid-padding">
							<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Supplier name" v-model="supplierInfo.name" @focus="$store.dispatch('validation/clearErrors')">
							<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.name">
								{{errors.name[0]}}
							</span>
						</div>

						<div class="uk-width-1-1 grid-padding">
							<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Email Address" v-model="supplierInfo.email" @focus="$store.dispatch('validation/clearErrors')">
							<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.email">
								{{errors.email[0]}}
							</span>
						</div>

						<div class="uk-width-1-1 grid-padding">
							<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Phone Number" v-model="supplierInfo.phone" @focus="$store.dispatch('validation/clearErrors')">
							<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.phone">
								{{errors.phone[0]}}
							</span>
						</div>

						<div class="uk-width-1-1 grid-padding">
							<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Country" v-model="supplierInfo.country" @focus="$store.dispatch('validation/clearErrors')">
							<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.country">
								{{errors.country[0]}}
							</span>
						</div>	

						<div class="uk-width-1-1 grid-padding">
							<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="City" v-model="supplierInfo.city" @focus="$store.dispatch('validation/clearErrors')">
							<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.city">
								{{errors.city[0]}}
							</span>
						</div>

						<div class="grid-padding uk-width-1-1">
							<hr class="uk-margin-small-bottom">
							<div>

								<button class="uk-button uk-button-primary" :disabled="loading" @click.prevent="updateSupplier">
									<partials-loader v-if="loading"></partials-loader>
									<template v-else>
										Update Supplier
									</template>
								</button>

							</div>
						</div>
					</form>

				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps , update} from "@/mixins/suppliers"
export default{
	mixins : [bindProps , update],
	data(){
		return {
			showModal : false,
		}
	},
};
</script>
