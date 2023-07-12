<template>
	<div>
		<div class="uk-width-1-1 uk-flex uk-flex-middle grid-padding">

			<div class="grid-gutter uk-width-expand">
				<div class="uk-flex uk-flex-middle">
					<customer-debt-indicator :customer="customer" class="uk-margin-small-right"></customer-debt-indicator>
					<p class="uk-text-truncate uk-margin-remove uk-text-small">
						<nuxt-link :to="{name: 'customers-customer', params : {customer: customer.uuid}}">
							<span  class="underlined highlight-text">{{customer.name}}</span>
						</nuxt-link>
					</p>
				</div>
			</div>



			<div class="grid-gutter uk-visible@xl">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{customer.type ? customer.type : 'N/A'}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{customer.gender ? customer.gender : 'N/A'}}
					</p>
				</div>
			</div>

			<div class="grid-gutter  uk-visible@xl">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{customer.date_of_birth ? $moment().diff(customer.date_of_birth, 'years') : 'N/A'}}
					</p>
				</div>
			</div>
			<div class="grid-gutter uk-visible@xl">
				<div class="uk-width-small uk-flex">

					<p class="uk-text-truncate uk-margin-remove-vertical label uk-border-rounded uk-margin-auto-right" :class="customer.active ? 'label-success' : 'label-danger'">
						<small>
							{{customer.active ? 'Active' : 'Inactive'}}
						</small>
					</p>
				</div>
			</div>

			<div class="grid-gutter uk-visible@l">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{customer.total_debt ? customer.total_debt : 0 | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>


			<div class="grid-gutter uk-visible@xl">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small uk-text-center">
						{{$moment(customer.created_at).format('DD MMM, YYYY')}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small uk-text-center">
						{{customer.total_sales | pluralize('Time')}}
					</p>
				</div>
			</div>
			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{customer.total_sales_value ? customer.total_sales_value : 0 | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>
			

			<div class="grid-gutter">
				<div class="uk-width-small uk-flex  uk-flex-middle uk-flex-center">
					<div class="background bordered uk-border-circle uk-flex uk-flex-center uk-flex-column uk-flex-middle square-30 tiny-margin-right click" v-if="customer.phone" @click="phoneModal = true">
						<span class="mdi mdi-phone"></span>
					</div>
					<div class="background bordered uk-border-circle uk-flex uk-flex-center uk-flex-column uk-flex-middle square-30 click" v-if="customer.email" @click="emailModal = true">
						<span class="mdi mdi-email"></span>
					</div>
				</div>

				
			</div>

			<div class="grid-gutter uk-visible@l">
				<div class="uk-width-small uk-flex  uk-flex-right uk-flex-middle"  v-if="customer.name !== 'Walk-in Customer'">
					<div class="background bordered uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-border-circle square-30 tiny-margin-right click" v-if="can('update-customers')" @click="editModal = true">
						<span class="mdi mdi-pencil"></span>
					</div>
					<div class="chip uk-border-rounded click" :class="customer.active ? 'uk-background-danger' : 'uk-background-primary'" v-if="can('change-customer-active-status')" @click="activateModal = true">
						<span class="text-small uk-text-white">
							{{customer.active ? 'Deactivate' : 'Activate'}}
						</span>
					</div>
				</div>
				<div v-else class="uk-width-small"></div>
			</div>

		</div>




		<vue-final-modal v-model="emailModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" v-if="customer.email">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium@s uk-overflow-auto modal-content uk-inline">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold uk-text-truncate">
							Email {{customer.name}}
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="emailModal = false">
							Close
						</a>
					</div>
					<div class="grid-padding">
						<div class="uk-flex uk-flex-middle ukfk=uk-flex-wrap">
							<span class="mdi mdi-email tiny-margin-right"></span>
							<span>
								{{customer.email}}
							</span>
						</div>

						<div class="uk-flex uk-flex-column  grid-padding uk-padding-remove-horizontal">
							<div class="chip background bordered uk-border-rounded click tiny-margin-bottom uk-flex uk-flex-between uk-flex-middle" @click="copyEmailAddress">
								<span class="text-small">
									Copy Address
								</span>
								<span class="mdi mdi-clipboard-multiple tiny-margin-left"></span>
							</div>

							<a :href="`mailto:${customer.email}`" class="chip bordered background uk-border-rounded click uk-flex uk-flex-between uk-flex-middle">
								<span class="text-small">
									Open Default Email Client
								</span>
								<span class="mdi mdi-open-in-new tiny-margin-left"></span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</vue-final-modal>


		<vue-final-modal v-model="phoneModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" v-if="customer.phone">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium@s uk-overflow-auto modal-content uk-inline">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold uk-text-truncate">
							Call {{customer.name}}
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="phoneModal = false">
							Close
						</a>
					</div>
					<div class="tiny-padding uk-flex uk-flex-column">

						<div class="uk-flex uk-flex-middle ukfk=uk-flex-wrap">
							<span class="mdi mdi-phone tiny-margin-right"></span>
							<span>
								{{customer.phone}}
							</span>
						</div>
						<div class="chip background bordered uk-border-rounded click uk-margin-small-top uk-margin-auto-right" @click="copyPhoneNumber">
							<span class="text-small">
								Copy Phone Number
							</span>
							<span class="mdi mdi-clipboard-multiple tiny-margin-left"></span>
						</div>
					</div>
				</div>
			</div>
		</vue-final-modal>



		<vue-final-modal v-model="activateModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" v-if="can('change-customer-active-status')">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium@s uk-overflow-auto modal-content uk-inline">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold uk-text-truncate">
							{{customer.active ? 'Deactivate' : 'Activate'}} Customer
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="activateModal = false">
							Close
						</a>
					</div>
					<div class="tiny-padding uk-flex uk-flex-column">
						<template v-if="customer.active">
							<h5 class="uk-text-bold uk-text-small uk-text-danger">
								Are you sure you want to deactivate {{customer.name}} from your customer's list?
							</h5>
							<p>
								They will no longer be available for selection when they are making a purchase at any of your store's branches until re-activated.
							</p>
						</template>

						<template v-else>
							<p>
								You are about to activate {{customer.name}}'s {{emporium.name}} customer profile.
							</p>
						</template>

						<div>
							<button class="uk-button uk-button-small" :class="customer.active ? 'uk-button-danger' : 'uk-button-primary'" @click="toggle">
								<partials-loader v-if="loading"></partials-loader>
								<template v-else>
									{{customer.active ? 'Deactivate' : 'Activate'}}
								</template>
							</button>
						</div>
					</div>
				</div>
			</div>
		</vue-final-modal>



		<vue-final-modal v-model="editModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" v-if="can('update-customers')">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s  uk-inline">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold uk-text-truncate">
							Edit Customer Profile
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="editModal = false">
							Close
						</a>
					</div>
					<div class="tiny-padding uk-flex uk-flex-column uk-overflow-auto modal-content">
						<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-child-width-1-1 uk-grid-collapse" uk-grid>

							<div class="grid-padding uk-flex uk-flex-column">
								<span class="text-small tiny-margin-bottom">
									Customer Name
								</span>
								<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Customer name" v-model="customerForm.name" @focus="$store.dispatch('validation/clearErrors')">
								<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.name">
									{{errors.name[0]}}
								</span>
							</div>

							<div class="grid-padding uk-flex uk-flex-column">
								<span class="text-small tiny-margin-bottom">
									Customer Type
								</span>

								<select class="uk-select uk-form-large uk-text-small" v-model="customerForm.type">
									<option value="" selected disabled>Select Customer Type</option>
									<option value="individual">Individual</option>
									<option value="company">Company</option>
								</select>
								
								<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.type">
									{{errors.type[0]}}
								</span>
							</div>

							<div class="grid-padding uk-flex uk-flex-column">
								<span class="text-small tiny-margin-bottom">
									Phone Number (International Format : Eg +233 244 500 000)
								</span>
								<input type="text" class="uk-input uk-form-large" v-model="customerForm.phone">
								<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.phone">
									{{errors.phone[0]}}
								</span>
							</div>

							<div class="grid-padding uk-flex uk-flex-column">
								<span class="text-small tiny-margin-bottom">
									Email Address
								</span>
								<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Email Address" v-model="customerForm.email" @focus="$store.dispatch('validation/clearErrors')">
								<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.email">
									{{errors.email[0]}}
								</span>
							</div>

							<template v-if="customerForm.type !== 'company'">
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
									<span class="text-small tiny-margin-bottom">
										Gender
									</span>
									<select class="uk-select uk-form-large uk-text-small" v-model="customerForm.gender">
										<option value="" selected disabled>Select Gender</option>
										<option value="female">Female</option>
										<option value="male">Male</option>
										<option value="other">Other</option>
									</select>
									<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.gender">
										{{errors.gender[0]}}
									</span>
								</div>
							</template>
						</div>
					</div>
					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-primary" :disabled="loading || !customerForm.name || (!customerForm.phone && !customerForm.email)" @click.prevent="updateCustomer">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>Update Customer Details</template>
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>




	</div>
</template>
<script>
import {bindProps, base, toggleActiveState, update} from "@/mixins/customer"
export default{
	mixins : [bindProps, base, toggleActiveState, update],
	data(){
		return {
			emailModal : false,
			phoneModal : false,
			editModal : false,
			activateModal : false
		}
	}
};
</script>
