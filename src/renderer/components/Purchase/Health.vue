<template>
	<div>
		<div class="square-25 uk-flex uk-flex-column uk-flex-middle uk-flex-center background uk-border-circle click" @click="showModal = true">
			<div class="pulse  uk-flex uk-flex-column uk-flex-center uk-flex-middle square-25" :class="purchase.is_expired ? 'warn' : 'good'">
				<div class="square-25 uk-flex uk-flex-column uk-flex-middle uk-flex-center">
					<span class="mdi" :class="purchase.is_expired ? 'mdi-alert uk-text-danger' : 'mdi-check uk-text-white'"></span>
				</div>
			</div>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large">
					<div class="tiny-padding modal-content">

						<template v-if="purchase.is_expired">
							<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding">
								<div class="square-50 uk-flex uk-flex-column uk-flex-middle uk-flex-center background uk-border-circle">
									<div class="pulse  uk-flex uk-flex-column uk-flex-center uk-flex-middle square-50 warn">
										<div class="square-50 uk-flex uk-flex-column uk-flex-middle uk-flex-center">
											<span class="mdi lni-large mdi-alert uk-text-danger"></span>
										</div>
									</div>
								</div>
								<h4 class="uk-text-bold uk-margin-top">
									Expired Purchase
								</h4>
								<p class="uk-text-center uk-margin-small-top">
									This purchase expired on {{$moment(purchase.expires_at).format('DD MMMM, YYYY')}}. The purchase was recorded on {{$moment(purchase.created_at).format('DD, MMMM, YYYY')}} by <br> 

									<template v-if="purchase.created_by && purchase.created_by.name !== undefined">
										{{purchase.created_by.name}}
									</template>
								</p>
							</div>
						</template>

						<template v-else>
							<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding">
								<div class="square-50 uk-flex uk-flex-column uk-flex-middle uk-flex-center background uk-border-circle">
									<div class="pulse  uk-flex uk-flex-column uk-flex-center uk-flex-middle square-50 good">
										<div class="square-50 uk-flex uk-flex-column uk-flex-middle uk-flex-center">
											<span class="mdi lni-large mdi-check uk-text-white"></span>
										</div>
									</div>
								</div>

								<p class="uk-text-center uk-margin-top">
									This purchase will expire on {{$moment(purchase.expires_at).format('DD MMMM, YYYY')}}. The purchase was recorded on {{$moment(purchase.created_at).format('DD, MMMM, YYYY')}} by <br> 

									<template v-if="purchase.created_by && purchase.created_by.name !== undefined">
										{{purchase.created_by.name}}
									</template>
								</p>
								
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
import {bindProps} from "@/mixins/purchase"
export default{
	mixins : [bindProps],
	data(){
		return {
			showModal : false
		}
	}
};
</script>
