<template>
	<div>
		<button class="uk-button uk-button-primary uk-button-small" @click="showModal = true">
			Confirm Store Details
		</button>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="true" overlay-class="uk-overlay-primary" attach=".app">
			<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle">
				<div class="uk-width-1-1 uk-width-large@s  background bordered  rounded raised-deep uk-animation-scale-up uk-animation-fast uk-margin-auto-vertical uk-inline">
					<div class="uk-position-cover background bordered rounded uk-position-z-index uk-flex uk-flex-column uk-flex-middle uk-flex-center" v-if="loading">
						<loaders-spinner></loaders-spinner>
						<p class="uk-text-center uk-margin-top">
							Confirming store details... 
						</p>
					</div>
					<div class="tiny-padding border-bottom">
						<h4 class="uk-text-center uk-margin-remove">
							Confirm Your Store Info
						</h4>
					</div>
					<div class="tiny-padding modal-content uk-overflow-auto">
						
						<div class="uk-width-1-1 uk-flex uk-flex-wrap">

							<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom">
								<span class="text-small tiny-margin-bottom">
									Store Name
								</span>
								<input type="text" class="uk-input" placeholder="Store Name" v-model="storeDetails.name">
								<span class="text-small uk-text-danger" v-if="errors && errors.name">
									{{errors.name[0]}}
								</span>
							</div>

							<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom">
								<span class="text-small tiny-margin-bottom">
									Email Address
								</span>
								<input type="text" class="uk-input" placeholder="Email Address">
								<span class="text-small uk-text-danger" v-if="errors && errors.email" v-model="storeDetails.email">
									{{errors.email[0]}}
								</span>
							</div>

							<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom">
								<span class="text-small tiny-margin-bottom">
									Phone Number (International Format)
								</span>
								<input type="text" class="uk-input" placeholder="Phone Number" v-model="storeDetails.phone">
								<span class="text-small uk-text-danger" v-if="errors && errors.number">
									{{errors.number[0]}}
								</span>
							</div>

							<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom">
								<span class="text-small tiny-margin-bottom">
									Currency (Will Be Applied to All Data)
								</span>
								<input type="text" class="uk-input" placeholder="Currency" v-model="storeDetails.currency">
								<span class="text-small uk-text-danger" v-if="errors && errors.currency">
									{{errors.currency[0]}}
								</span>
							</div>

							<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom">
								<span class="text-small tiny-margin-bottom">
									Website
								</span>
								<input type="url" class="uk-input" placeholder="Website" v-model="storeDetails.website">
								<span class="text-small uk-text-danger" v-if="errors && errors.website">
									{{errors.website[0]}}
								</span>
							</div>

							<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom">
								<span class="text-small tiny-margin-bottom">
									Address
								</span>
								<input type="text" class="uk-input" placeholder="Address"  v-model="storeDetails.address">
								<span class="text-small uk-text-danger" v-if="errors && errors.address">
									{{errors.address[0]}}
								</span>
							</div>


						</div>
					</div>
					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger uk-margin-small-right" @click="showModal = false">
							Cancel
						</button>

						<button class="uk-button uk-button-primary" @click.prevent="confirmStoreDetails">
							Confirm Store Details
						</button>
					</div>
				</div>

			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import editor from "@/mixins/utils/editor"
import { setup } from "@/mixins/setup"
export default {
	mixins : [editor, setup],
	async mounted(){
		let model =  (({ name , email , phone, currency , website, address, vat_percent  }) => ({ name , email , phone, currency , website, address, vat_percent }))(this.emporium)
		await this.setupEditor('storeDetails', model)
	}
}
</script>
