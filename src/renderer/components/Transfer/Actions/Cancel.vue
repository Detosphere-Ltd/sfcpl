<template>
	<div>
		<button class="uk-button uk-button-danger uk-button-small" @click="showModal = true">
			Cancel Transfer
		</button>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="comments = ''">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="rounded bordered background raised-deep uk-width-1-1 uk-inline uk-margin-auto uk-width-large@s">

					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Cancel Transfer
						</h5>
						<button class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="processing">
							Cancel
						</button>
					</div>
					<div class="tiny-padding">

						<div class="tiny-padding uk-flex uk-flex-column uk-flex-middle">
							<p class="uk-margin-remove uk-text-center">
								You are about to cancel this transfer. <br> Please note the this  action cannot be reversed.
							</p>
						</div>

						<div class="tiny-padding uk-flex uk-flex-column uk-flex-middle">
							<span class="text-small tiny-margin-bottom">Provide a reason for cancelling this transfer (Required)</span>
							<textarea rows="5" class="uk-textarea" placeholder="Enter comments for this action" v-model="comments"></textarea>
							<span class="text-small tiny-margin-bottom uk-text-danger" v-if="errors && errors.comments">{{errors.comments[0]}}</span>
						</div>
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger" :disabled="processing || !comments || comments.length < 2" @click="cancelTransfer">
							<partials-loader v-if="processing"></partials-loader>
							<template v-else>
								Cancel Transfer
							</template>
						</button>
					</div>


				</div>
			</div>
		</vue-final-modal>
	</div>
</template>

<script>
import {base, bindProps} from "@/mixins/transfer/singleton"
import {cancel} from "@/mixins/transfer/actions"
export default{
	mixins : [base, bindProps , cancel],
};
</script>
