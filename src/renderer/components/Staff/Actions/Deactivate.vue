<template>
	<div class="uk-width-1-1">
		<div class="uk-card uk-width-1-1 tiny-padding danger-on-hover click uk-border-rounded uk-flex uk-flex-middle uk-transition-toggle" @click="showModal = true">
			<div class="uk-width-expand">
				<h6 class="tiny-margin-bottom uk-margin-remove uk-text-bold uk-text-truncate">
					Deactivate Account
				</h6>
				<p class="uk-text-small uk-margin-remove uk-text-truncate">
					Revoke {{staff.name}}'s access to this application.
				</p>
			</div>

			<div class="square-30 uk-background-danger-op  uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle click uk-transition-slide-left-small">
				<span class="mdi mdi-chevron-right uk-text-dark lni-large"></span>
			</div>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" :esc-to-close="true" overlay-class="uk-overlay-primary rounded" attach=".app">
			<div>
				<div class="uk-card rounded bordered background raised-deep uk-margin-auto uk-margin-large-top uk-width-1-1 uk-inline uk-margin-auto uk-width-medium">
					<h5 class="uk-text-bold uk-text-dark uk-padding-small uk-padding-remove-bottom">
						Deactivate Staff Account.
					</h5>
					<hr class="uk-margin-small-bottom">
					<p class="uk-padding-small uk-padding-remove-vertical">
						<span class="uk-text-dark uk-text-bold">{{staff.name}}'s</span> access to {{$appName}} will be terminated after this operation.
					</p>
					<div class="tiny-padding uk-flex uk-flex-center border-top">
						<button class="uk-button uk-button-small uk-border-rounded uk-button-view tiny-margin-right" @click.prevent="showModal = false" :disabled="loading">
							Cancel
						</button>

						<button class="uk-button uk-button-small uk-button-danger uk-border-rounded" :disabled="loading" @click="toggle">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>
								Deactivate
							</template>
						</button>

					</div>
				</div>
			</div>

		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/staff/singleton"
import {base, toggleActiveState} from "@/mixins/staff/actions"
export default{
	mixins : [bindProps , base, toggleActiveState],
	data(){
		return {
			showModal : false
		}
	},

};
</script>
