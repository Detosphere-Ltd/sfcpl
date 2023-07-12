<template>
	<div class="uk-width-1-1">
		<div class="uk-card uk-width-1-1 tiny-padding success-on-hover click uk-border-rounded uk-flex uk-flex-middle uk-transition-toggle" @click="showModal = true">
			<div class="uk-width-expand">
				<h6 class="tiny-margin-bottom uk-margin-remove uk-text-bold uk-text-truncate">
					Detach User From Branch
				</h6>
				<p class="uk-text-small uk-margin-remove uk-text-truncate">
					Make this user a Corporate Level User.
				</p>
			</div>

			<div class="square-30 uk-background-success-op  uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle click uk-transition-slide-left-small">
				<span class="mdi mdi-chevron-right lni-large"></span>
			</div>
		</div>
		<div class="tiny-margin-top tiny-margin-bottom border-bottom"></div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center"  :esc-to-close="true" overlay-class="uk-overlay-primary rounded" attach=".app">
			<div>
				<div class="uk-card rounded bordered background raised-deep uk-margin-auto uk-margin-large-top uk-width-1-1 uk-inline uk-margin-auto uk-width-medium">
					<div class="tiny-padding border-bottom">
						<h5 class="uk-text-bold uk-margin-remove">
							Detach User From Branch
						</h5>
					</div>


					<div class="modal-content uk-padding-small">
						<p class="uk-margin-remove">
							<span class="uk-text-bold">{{staff.name}}</span> will be treated as a corporate level user after this action. This means they will no longer be able to sign in into the branch application for your store.
						</p>
					</div>
					
					<div class="tiny-padding uk-flex uk-flex-center border-top">
						<button class="uk-button uk-button-small uk-border-rounded uk-button-view tiny-margin-right"@click.prevent="showModal = false" :disabled="loading">
							Cancel
						</button>

						<button class="uk-button uk-button-small uk-button-primary uk-border-rounded" :disabled="loading" @click="detachUser()">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>
								Detach From Branch
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
import {base, detach} from "@/mixins/staff/actions"
export default{
	mixins : [bindProps , base, detach],

	data(){
		return {
			showModal : false
		}
	},

};
</script>

