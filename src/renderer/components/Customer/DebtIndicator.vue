<template>
	<div>
		<div class="square-20 uk-flex uk-flex-column uk-flex-middle uk-flex-center background uk-border-circle click" @click="showModal = true">
			<div class="pulse  uk-flex uk-flex-column uk-flex-center uk-flex-middle square-20" :class="customer.has_debt ? 'warn' : 'good'">
				<div class="square-20 uk-flex uk-flex-column uk-flex-middle uk-flex-center">
					<span class="mdi" :class="customer.has_debt ? 'mdi-alert-box uk-text-danger' : 'mdi-check uk-text-white'"></span>
				</div>
			</div>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large">
					<div class="uk-width-1-1 uk-padding-small rounded-top uk-flex" :class="customer.has_debt ? 'uk-background-primary-op' : 'uk-background-success-op'">
						<div class="square-50 uk-margin-small-right uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle" :class="customer.has_debt ? 'uk-background-primary-op' : 'uk-background-success-op'">
							<h4 class="uk-margin-remove">
								{{customer.name.substring(0,1)}}
							</h4>
						</div>
						<div class="uk-width-expand">
							<h4 class="tiny-margin-bottom">
								{{customer.name}}
							</h4>

							<p class="tiny-margin-bottom">
								<template v-if="customer.phone">
									{{customer.phone}} &bull; 
								</template>
								<template v-if="customer.email">
									{{customer.email}}
								</template>
							</p>
							<p v-if="customer.gender" class="uk-text-capitalize">
								<span class="mdi mdi-gender-male" v-if="customer.gender === 'male'"></span>
								<span class="mdi mdi-gender-female" v-else-if="customer.gender === 'female'"></span> 
								<span>{{customer.gender}}</span>
							</p>
						</div>
					</div>
					
					<div class="tiny-padding modal-content">

						<template v-if="customer.has_debt">
							<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding-small">
								<div class="square-40 uk-flex uk-flex-column uk-flex-middle uk-flex-center background uk-border-circle">
									<div class="pulse  uk-flex uk-flex-column uk-flex-center uk-flex-middle square-40 warn">
										<div class="square-40 uk-flex uk-flex-column uk-flex-middle uk-flex-center">
											<span class="mdi lni-large mdi-alert uk-text-danger"></span>
										</div>
									</div>
								</div>
								<p class="uk-text-center uk-margin-top">
									{{customer.name}} has a total debt of 
									
								</p>

								<h4 class="uk-text-bold">
									{{ customer.total_debt | currency(`${emporium.currency} `)}} 
								</h4>
								<nuxt-link class="uk-button uk-button-primary uk-button-small" :to="{name: 'customers-customer', params:{customer: customer.uuid}}">
									Browse Purchases
								</nuxt-link>
							</div>
						</template>

						<template v-else>
							<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding-small">
								<div class="square-40 uk-flex uk-flex-column uk-flex-middle uk-flex-center background uk-border-circle">
									<div class="pulse  uk-flex uk-flex-column uk-flex-center uk-flex-middle square-40 good">
										<div class="square-40 uk-flex uk-flex-column uk-flex-middle uk-flex-center">
											<span class="mdi lni-large mdi-check uk-text-white"></span>
										</div>
									</div>
								</div>
								<p class="uk-text-center uk-margin-top">
									{{customer.name}} has no outstanding payments to make to your store 
								</p>



								<h4 class="uk-text-bold">
									{{ customer.total_debt | currency(`${emporium.currency} `)}} 
								</h4>
							</div>
						</template>
					</div>

					<div class="tiny-padding uk-flex uk-flex-center border-top">
						<button class="uk-button uk-button-danger" @click="showModal = false">
							Close
						</button>
					</div>


				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/customer"
export default{
	mixins : [bindProps],
	data(){
		return {
			showModal : false
		}
	}
}
</script>
