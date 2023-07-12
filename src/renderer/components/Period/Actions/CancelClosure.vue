<template>
	<div>
		<div class="uk-width-auto click" @click="year.status === 'pending'  ? showModal = true : ''">
			<slot name="action-button">
				<button class="uk-button uk-button-danger" :disabled="year.status !== 'pending'">
					Cancel Closure
				</button>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="true" overlay-class="uk-overlay-primary" attach=".app" @before-open="consent = false">
			<div class="uk-width-1-1 uk-margin-top uk-flex uk-flex-column uk-flex-middle">
				<div class="uk-width-1-1 uk-width-large@s  background bordered  rounded raised-deep uk-animation-scale-up uk-animation-fast uk-margin-auto-vertical uk-inline">
					<div class="uk-position-cover background uk-position-z-index bordered uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle" v-if="loading">
						<loaders-spinner></loaders-spinner>
						<p class="uk-text-center uk-margin-top">
							Processing request
						</p>
					</div>
					<div class="uk-padding">
						<h4>
							Are you sure you want to cancel the scheduled closure of this financial year for {{emporium.name}} on {{$appName}}?
						</h4>
						<p>
							Please note take note of the following
						</p>
						<ul>
							<li>
								This action will prevent the closure of the current financial year.
							</li>

							<li>
								If there are no previous financial years, this action will default back to using the financial period that starts from {{$moment(emporium.created_at).format('DD MMM, YYYY')}} for {{emporium.name}} 
							</li>
						</ul>

						<div>
							<label class="uk-flex uk-flex-wrap uk-flex-top uk-light">
								<input type="checkbox" class="uk-checkbox square-25 bordered uk-border-rounded uk-margin-small-right" v-model="consent">
								<p class="uk-width-expand uk-margin-remove uk-text-warning">
									I understand the implications of cancelling the closure of this current financial and wish to proceed.
								</p>
							</label>
						</div>
					</div>
					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger uk-margin-small-right" @click="showModal = false">
							Cancel
						</button>

						<button class="uk-button uk-button-primary" @click="cancelClosure" :disabled="!consent">
							Cancel Scheduled Closure 
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps, cancel} from "@/mixins/periods/singleton"
export default {
	mixins : [bindProps, cancel]
}
</script>
