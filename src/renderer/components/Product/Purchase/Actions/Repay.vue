<template>
	<div>
		<div class="click uk-flex" @click="showModal = true">
			<slot name="action-button">
				<div class="chip uk-button-danger uk-border-rounded click">
					<span class="text-small uk-text-white">
						Pay
					</span>
				</div>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="reason = ''">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium@s">


					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Pay Debt
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
							Close
						</a>
					</div>
					<div class=" uk-overflow-auto modal-content">
						<div class="tiny-padding uk-flex uk-flex-column">
							<span class="uk-text-small uk-margin-small-bottom">Enter how much you want to record as payment for this purchase. You can record a maximum of {{purchase.amount_outstanding | currency(`${emporium.currency} `)}}</span>
							<a-input-number :max="purchase.amount_outstanding" :step="0.01" v-model="repayForm.amount"></a-input-number>
							<span class="text-small tiny-margin-bottom uk-text-danger" v-if="errors && errors.amount_paid">{{errors.amount_paid[0]}}</span>
						</div>

						<div class="tiny-padding uk-flex uk-flex-column  uk-width-1-1 tags-input">
							<span class="tiny-margin-bottom text-small tiny-margin-left">Payment Mode</span>
							<a-select show-search placeholder="Select Payment Mode" :filter-option="true" optionFilterProp="text"  size="large" :showArrow="true" class="uk-width-1-1" v-model="repayForm.payment_mode">
								<a-select-option disabled value="" key="select-payment" name="Select Payment Mode" class="uk-text-capitalize">
									Select Payment Mode
								</a-select-option>
								<a-select-option :value="mode.value" v-for="(mode, key) in $store.getters['paymentModes']" :key="mode.value" v-if="mode.value !== 'credit'" :text="mode.text">
									<div class="uk-flex uk-flex-column">
										{{mode.text}}  
									</div>
								</a-select-option>
							</a-select>
						</div>

						<div class="tiny-padding uk-flex uk-flex-column uk-width-1-1">
							<span class="tiny-margin-bottom text-small tiny-margin-left">Reference</span>
							<input type="text" class="uk-input" placeholder="Reference Number (Optional)" v-model="repayForm.reference_no">
						</div>
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-primary" :disabled="!repayForm.amount || !repayForm.payment_mode || loading" @click="repayPurchase">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>
								Record  Payment
							</template>
						</button>
					</div>


				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import { bindProps , repay } from "@/mixins/purchase"
export default{
	mixins : [bindProps , repay ]
};
</script>
