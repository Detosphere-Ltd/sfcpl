<template>
	<div>
		<div class="click uk-flex" @click="showModal = true">
			<slot name="action-button">
				<div class="chip uk-button-danger uk-border-rounded click">
					<span class="text-small uk-text-white">
						Reverse Purchase
					</span>
				</div>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="reason = ''">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s">


					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Confirm Purchase Rerversal
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
							Close
						</a>
					</div>
					<template v-if="purchase.is_reversible">
						<div class=" uk-overflow-auto modal-content">

							<div class="tiny-padding uk-flex uk-flex-column">
								<span class="uk-text-small uk-margin-small-bottom">You need to enter a reason in no less that 5 characters to reverse a purchase.</span>
								<textarea rows="5" class="uk-textarea" placeholder="Enter a reason for reversing this purshase. Eg: Wrong quantity" v-model="reason"></textarea>
								<span class="text-small tiny-margin-bottom uk-text-danger" v-if="errors && errors.reason">{{errors.reason[0]}}</span>

							</div>
						</div>

						<div class="tiny-padding border-top uk-flex uk-flex-center">
							<button class="uk-button uk-button-danger uk-margin-small-top" :disabled="!reason || reason.length < 5 || loading" @click="reversePurchase">
								<partials-loader v-if="loading"></partials-loader>
								<template v-else>
									Reverse Purchase
								</template>
							</button>
						</div>
					</template>
					<template v-else>
						<div class=" uk-overflow-auto modal-content">

							<div class="tiny-padding uk-flex uk-flex-column">
								<h4>
									Sorry. You cannot reverse this purchase!
								</h4>
								<template  v-if="purchase.irreversible_reasons && purchase.irreversible_reasons.length > 0">
									<p class="uk-margin-small-bottom">
										Reasons are provided below 
									</p>
									<ul>
										<li v-for="rs in purchase.irreversible_reasons" :key="rs">
											{{rs}}
										</li>
									</ul>
								</template>
							</div>
						</div>
					</template>


				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import { bindProps , reversal } from "@/mixins/purchase"
export default{
	mixins : [bindProps , reversal ]
};
</script>
