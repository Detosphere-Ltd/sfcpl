<template>
	<div>
		<button class="uk-button uk-button-primary uk-button-small" @click="showModal = true">
			<span class="tiny-margin-right mdi mdi-plus-circle uk-text-white"></span>
			New Customer
		</button>


		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="reset">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s uk-overflow-auto modal-content">

					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Create A New Customer
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
							Close
						</a>
					</div>
					<div class="tiny-padding">
						<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-child-width-1-1 uk-grid-collapse" uk-grid>

							<div class="grid-padding uk-flex uk-flex-column">
								<span class="text-small tiny-margin-bottom">
									Customer Name
								</span>
								<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Customer Name" v-model="customerForm.name" @focus="$store.dispatch('validation/clearErrors')">
								<span class="text-small uk-text-danger uk-margin-small-left" v-if="errors && errors.name">
									{{errors.name[0]}}
								</span>
							</div>

							<div class="uk-width-1-1 grid-padding uk-flex uk-flex-column">
								<span class="uk-text-small tiny-margin-left tiny-margin-bottom">
									Customer Type
								</span>
								<select class="uk-select uk-text-capitalize uk-form-large" v-model="customerForm.type">
									<option value="" selected disabled>Select Customer Type</option>
									<option v-for="type in ['individual' , 'company']" :value="type" :key="type" v-text="type">
									</option>
								</select>
								<span v-if="errors && errors['customer.type']" class="uk-text-danger uk-text-small">{{errors['customer.type'][0]}}</span>
							</div>

							<div class="grid-padding uk-flex uk-flex-column">
								<span class="text-small tiny-margin-bottom">
									Phone Number (International Format : Eg +233 244 500 000)
								</span>
								<input type="text" class="uk-input uk-form-large" v-model="customerForm.phone">
								<span class="text-small uk-text-danger uk-margin-small-left" v-if="errors && errors.phone">
									{{errors.phone[0]}}
								</span>
							</div>

							<div class="grid-padding uk-flex uk-flex-column">
								<span class="text-small tiny-margin-bottom">
									Email Address
								</span>
								<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Email Address" v-model="customerForm.email" @focus="$store.dispatch('validation/clearErrors')">
								<span class="text-small uk-text-danger uk-margin-small-left" v-if="errors && errors.email">
									{{errors.email[0]}}
								</span>
							</div>

							<template v-if="customerForm.type === 'individual'">
								<div class="grid-padding uk-flex uk-flex-column">
									<span class="text-small tiny-margin-bottom">
										Date of birth
									</span>
									<input type="date" class="uk-input uk-form-large uk-text-small" placeholder="Date of birth" v-model="customerForm.date_of_birth" @focus="$store.dispatch('validation/clearErrors')" :max="$moment().format('YYYY-MM-DD')">
									<span class="text-small uk-text-danger uk-margin-small-left" v-if="errors && errors.date_of_birth">
										{{errors.date_of_birth[0]}}
									</span>
								</div>


								<div class="grid-padding uk-flex uk-flex-column">
									<select class="uk-select uk-form-large uk-text-small" v-model="customerForm.gender">
										<option value="" selected disabled>Select Gender</option>
										<option value="female">Female</option>
										<option value="male">Male</option>
										<option value="other">Other</option>
									</select>
									<span class="text-small uk-text-danger uk-margin-small-left" v-if="errors && errors.gender">
										{{errors.gender[0]}}
									</span>
								</div>
							</template>
						</div>
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<div class="grid-padding">
							<slot></slot>
							<button class="uk-button uk-button-primary tiny-margin-left" :disabled="loading || !customerForm.name || (!customerForm.phone && !customerForm.email)" @click.prevent="createCustomer">
								<partials-loader v-if="loading"></partials-loader>
								<template v-else>Create Customer</template>
							</button>
						</div>
					</div>
				</div>

			</div>
		</vue-final-modal>

	</div>
</template>
<script>
import {create, base} from "@/mixins/customer"
export default{
	mixins : [create, base]
};
</script>
