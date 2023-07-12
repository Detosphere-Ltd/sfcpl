<template>
	<div>
		<div class="click" @click="showModal = true">
			<slot name="action-button">
				<button class="uk-button uk-button-view uk-button-small">
					Skip This Step
				</button>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="true" overlay-class="uk-overlay-primary" attach=".app">
			<div class="uk-width-1-1 uk-margin-top uk-flex uk-flex-column uk-flex-middle">
				<div class="uk-width-1-1 uk-width-large@s  background bordered  rounded raised-deep uk-animation-scale-up uk-animation-fast uk-margin-auto-vertical uk-inline">
					
					<div class="uk-position-cover uk-position-z-index background bordered uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle" v-if="loading">
						<loaders-spinner></loaders-spinner>
						<p class="uk-text-center uk-margin-top">
							Processing request
						</p>
					</div>

					<div class="uk-padding">
						<h4 class="uk-text-center">
							Are you sure you want to skip the onboarding process?
						</h4>
						<p class="uk-text-center">
							Please note that not following the onboarding guide can complicate some processes later in your everday use of {{$appName}}. Only skip this if you know your way arround.
						</p>
					</div>
					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger uk-margin-small-right" @click="showModal = false" :disabled="loading">
							Cancel
						</button>

						<button class="uk-button uk-button-primary" :disabled="loading" @click.prevent="skipStage(stageKey)">
							Skip Step
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import { setup } from "@/mixins/setup"
export default {
	props : {
		stageKey : {
			type : String,
			required : true
		}
	},
	mixins : [setup]
}
</script>

