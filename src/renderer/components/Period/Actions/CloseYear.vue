<template>
	<div>
		<div class="uk-width-auto click" @click="showModal = true">
			<slot name="action-button">
				<button class="uk-button uk-button-danger">
					Close Current Period
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
							Are you sure you want to close the current operational period for {{emporium.name}} on {{$appName}}?
						</h4>
						<p>
							Please note take note of the following
						</p>
						<ul>
							<li>
								This action cannot be reversed once completed. (This takes place at midnight)
							</li>

							
							<li>
								Left-over stock from the operational period will be used as opening stock for the next one (Your next period is created automatically)
							</li>
							<li>
								When you reverse sales from this period after closing it, the records will affect the next period.
							</li>
							<li>
								Purchases recorded in this operational period will no longer be reversible.
							</li>
						</ul>

						<div>
							<label class="uk-flex uk-flex-wrap uk-flex-top uk-light">
								<input type="checkbox" class="uk-checkbox square-25 bordered uk-border-rounded uk-margin-small-right" v-model="consent">
								<p class="uk-width-expand uk-margin-remove uk-text-warning">
									I understand the implications of closing the current operational period and wish to proceed.
								</p>
							</label>
						</div>
					</div>
					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger uk-margin-small-right" @click="showModal = false">
							Cancel
						</button>

						<button class="uk-button uk-button-primary" @click="closePeriod" :disabled="!consent">
							Close This Period
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {close} from "@/mixins/periods/singleton"
export default {
	mixins : [close]
}
</script>
