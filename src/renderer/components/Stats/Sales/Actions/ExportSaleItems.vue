<template>
	<div>
		<button class="uk-button uk-button-primary uk-button-small" :disabled="data.length < 1" @click="showModal = true">
			Export Data
		</button>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" @before-open="sent = false">
			<div class="uk-card rounded bordered background raised-deep uk-margin-auto uk-margin-auto-vertical uk-width-1-1 uk-inline  uk-width-1-1 uk-width-large">
				<div class="uk-position-cover uk-position-z-index background bordered rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle" v-if="loading">
					<loaders-spinner></loaders-spinner>
					<p class="uk-margin-top">
						Processing Request...
					</p>
				</div>
				<div class="tiny-padding border-bottom uk-flex uk-flex-between uk-flex-middle">
					<h5 class="uk-margin-remove">
						Export Sales Records
					</h5>

					<button class="uk-button uk-button-danger uk-button-small" @click="showModal = false">
						Close
					</button>
				</div>
				<div class="uk-padding-small">
					<div v-if="sent" class="uk-flex uk-flex-column uk-flex-middle uk-padding-small">
						<div class="square-60 uk-background-primary uk-border-circle uk-margin-small-bottom uk-flex uk-flex-middle uk-flex-center uk-flex-column">
							<span class="mdi mdi-email-check lni-large uk-text-white"></span>
						</div>
						<p class="uk-text-center">
							Your data export request has been submitted. You will receive an email via the provided address with an attached file when the operation is complete. Please check your Spam/Junk mail if you don't see this in your mail inbox.
						</p>
						<button class="uk-button uk-button-primary uk-button-small uk-text-capitalize" @click="sent = false; email = ''">
							Send to another mail
						</button>
					</div>
					<div class="uk-flex uk-flex-column" v-else>
						<p>
							Enter An Email Address to receive this data.
						</p>
						<input type="email" class="uk-input uk-form-large uk-text-small" placeholder="Email Address" v-model="email">
						<span class="text-small uk-text-danger tiny-margin-top" v-if="errors && errors.email">
							{{errors.email[0]}}
						</span>

						<div class="uk-width-1-1 uk-flex uk-flex-column">

							<div class="uk-flex uk-flex-middle uk-flex-between grid-padding uk-padding-remove-horizontal">
								<label class="uk-flex uk-flex-top grid-gutter uk-padding-remove-bottom click">
									<div class="uk-light uk-margin-small-right tiny-margin-top uk-width-auto">
										<input value="summary" type="radio" class="uk-radio  uk-border-rounded  bordered square-20" v-model="type">
									</div>
									<span class="uk-flex uk-flex-column uk-width-expand text-small">
										<span class="uk-text-bold">Summary Export</span>
										<span>
											Select to export summary data for {{data.length | pluralize('record')}}. 
										</span>
									</span>
								</label>
							</div>

							<div class="uk-flex uk-flex-middle uk-flex-between grid-padding uk-padding-remove-horizontal border-top">
								<label class="uk-flex uk-flex-top grid-gutter uk-padding-remove-bottom click">
									<div class="uk-light uk-margin-small-right tiny-margin-top uk-width-auto">
										<input value="detailed" type="radio" class="uk-radio  uk-border-rounded  bordered square-20" v-model="type">
									</div>
									<span class="uk-flex uk-flex-column uk-width-expand text-small">
										<span class="uk-text-bold">Datailed Export</span>
										<span>
											Select to export detailed data for {{data.length | pluralize('record')}}. 
										</span>
									</span>
								</label>
							</div>


						</div>
					</div>
				</div>

				<div class="tiny-padding border-top uk-flex uk-flex-center" v-if="!sent">
					<button class="uk-button uk-button-primary" @click="exportData">
						Export Data
					</button>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {saleItemsExporter} from "@/mixins/exporter"
export default {
	mixins : [saleItemsExporter],

	data(){
		return {
			showModal : false
		}
	},
	props : {
		data : {
			type : Array,
			required : true
		},

		params : {
			type : String
		}
	}
}
</script>
