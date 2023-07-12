<template>
	<div>
		<div class="click uk-flex" @click="payment.is_reversed ? (reasonModal = true) : (showModal = true)">
			<slot name="action-button">
				<div class="chip uk-button-danger uk-border-rounded click">
					<span class="text-small uk-text-white">
						Reverse Payment
					</span>
				</div>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="reason = ''">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium@s">


					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Payment Rerversal
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
							Close
						</a>
					</div>
					<div class=" uk-overflow-auto modal-content">

						<div class="tiny-padding uk-flex uk-flex-column">
							<span class="uk-text-small uk-margin-small-bottom">You need to enter a reason in no less that 5 characters to reverse a payment.</span>
							<textarea rows="5" class="uk-textarea" placeholder="Eg: Wrong amount" v-model="reason"></textarea>
							<span class="text-small tiny-margin-bottom uk-text-danger" v-if="errors && errors.reason">{{errors.reason[0]}}</span>
							
						</div>
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger uk-margin-small-top" :disabled="!reason || reason.length < 5 || loading" @click="reversePayment">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>
								Reverse Payment
							</template>
						</button>
					</div>


				</div>
			</div>
		</vue-final-modal>

		<vue-final-modal v-model="reasonModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="reason = ''">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium@s">


					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							This payment has been Reversed!
						</h5>
					</div>
					<div class=" uk-overflow-auto modal-content tiny-padding">
						<p>
							This payment was reversed by <span class="uk-text-bold">{{payment.reversed_by.name}}</span> on {{$moment(payment.reversed_at).format('DD MMM, YYYY')}} at {{$moment(payment.reversed_at).format('hh:mm A')}}
						</p>
						<p class="uk-margin-remove">
							The reason given was:
						</p>

						<div class="tiny-padding uk-border-rounded bordered tiny-margin-top">
							<p class="uk-margin-remove">
								{{payment.reversal_reason}}
							</p>
						</div>
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger uk-margin-small-top"  @click="reasonModal = false">
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
export default {
	mixins : [bindProps],
	data(){
		return {
			showModal : false,
			reasonModal : false,
			reason : '',
			loading : false
		}
	},
	props : {
		payment : {
			type : Object,
			required : true
		}
	},

	methods : {
		async reversePayment(){
			this.loading = true
			await this.$axios.$post(`/purchases/${this.purchase.uuid}/payments/${this.payment.uuid}`, {reason : this.reason})
			.then(() => {
				this.showModal = false
				this.$message.success('Payment reversed', 4)
				this.$emit('done')
			})
			.catch(err=>{
				this.$message.error(`Failed to reverse payment. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 6)
			})

			.finally(()=>{
				this.loading = false
			})
		}
	}
}
</script>
