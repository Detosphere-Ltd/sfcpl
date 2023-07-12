<template>
	<div>
		<button class="uk-button uk-button-danger uk-button-small" @click="showModal = true">
			Raise Issue
		</button>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="comments = ''">
			<div class="uk-width-1-1 uk-margin-top">
				<div class="rounded bordered background raised-deep uk-width-1-1 uk-inline uk-margin-auto uk-width-large@s">

					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Confirm Action
						</h5>
						<button class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="processing">
							Cancel
						</button>
					</div>
					<div>

						
						<div>

							<div class="uk-padding-small">
								<h5 class="uk-margin-remove-top tiny-margin-bottom">
									You are about to raise an issue with this transfer.
								</h5>
								<p class="uk-margin-remove">
									A comment is required (at least 5 characters) to keep all parties involved informed about this action.
								</p>

								<div class="uk-flex uk-margin-small-top">
									<transfer-actions-details :transfer="transfer" :tab="'products'">
										<template #action-button>
											View Transfer Details
										</template>
									</transfer-actions-details>
								</div>
							</div>
						</div>



						<div class="tiny-padding uk-flex uk-flex-column border-top">
							<span class="text-small tiny-margin-bottom">Provide additional comments (Required)</span>
							<textarea rows="5" class="uk-textarea" placeholder="Enter comments for this action" v-model="comments"></textarea>
							<span class="text-small tiny-margin-bottom uk-text-danger" v-if="errors && errors.comments">{{errors.comments[0]}}</span>
						</div>
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger" :disabled="processing || !comments || comments.length < 2" @click="raiseTransferIssue">
							<partials-loader v-if="processing"></partials-loader>
							<template v-else>
								Submit Issue
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
import {raise_issue} from "@/mixins/transfer/actions"
export default{
	mixins : [base, bindProps , raise_issue],
};
</script>
