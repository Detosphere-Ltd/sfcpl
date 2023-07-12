<template>
	<div>


		<div @click="$uikit.modal($refs.modal).show()" class="click">
			<slot name="action-button">
				<a class="chip uk-button-view uk-border-rounded">
					<span class="text-small">Record Adjustment</span>
				</a>
			</slot>
		</div>


		<div class="uk-width-1-1 uk-padding-remove"  uk-modal="esc-close: false; bg-close: false; sel-close: .stock-adjustment-modal; delay-hide: 0; delay-show: 0; stack: true" ref="modal" @beforeshow="$emit('opening');"  @beforehide="$emit('closing')">
			<div :class="colorMode" class="uk-modal-dialog transparent uk-padding-remove uk-width-large@s uk-margin-auto-vertical uk-animation-slide-top-small uk-animation-fast uk-width-1-1 uk-border-rounded">
				
				<div class="uk-width-1-1 background uk-inline uk-flex uk-flex-column uk-border-rounded no-radius-sm bordered no-border-sm">
					<div class="rounded background uk-position-cover uk-position-z-index center bordered uk-padding-small" v-if="loading">
						<loaders-spinner></loaders-spinner>
						<span class="uk-margin-small-top">
							Updating Price...
						</span>
					</div>

					<div class="tiny-padding border-bottom uk-flex uk-flex-middle">

						<div class="uk-width-expand">
							<div class="uk-flex uk-flex-column">
								<span class="uk-h5 uk-margin-remove uk-text-bold">
									Adjust Product Price
								</span>
							</div>
						</div>

						<div class="uk-button uk-button-danger uk-button-small stock-adjustment-modal uk-text-white">
							Close
						</div>
					</div>

					
					<div class="tiny-padding uk-overflow-auto modal-content">
						<div class="tiny-padding uk-flex uk-flex-column">

							<h4 class="tiny-margin-bottom">Select a Purchase</h4>
							<span class="text-small uk-margin-small-bottom">
								We will record this adjustment against the selected purchase
							</span>
							<div class="tags-input uk-width-1-1">
								<a-select class="uk-width-1-1" show-search size="large" placeholder="Select a purchase for this adjustment" v-model="purchase" option-label-prop="label">
									<a-select-option notFoundContent="No purchases available for selection" v-for="(entry, key) in product.available_purchases" :key="key" :value="entry.uuid" :label="`Purchase recorded on ${$moment(entry.created_at).format('DD MMMM, YYYY')}`">
										<div>
											Purchase recorded on {{$moment(entry.created_at).format('DD MMMM, YYYY')}} 
										</div>

										<template v-if="entry.expires_at">
											<div>
												Expires on {{$moment(entry.expires_at).format('DD MMMM, YYYY')}}
											</div>
										</template>

										<div>
											{{entry.quantity | number('0,0') | pluralize('Unit') }} Available 
										</div>
										

										<template v-if="entry.supplier && entry.supplier.name !== undefined">
											<div class="uk-text-bold"> {{entry.supplier.name}} </div>
										</template> 

									</a-select-option>
								</a-select>
							</div>
							<span class="text-small tiny-margin-bottom uk-text-danger" v-if="errors && errors.quantity">{{errors.quantity[0]}}</span>

						</div>
						<div class="tiny-padding uk-flex uk-flex-column">
							<span class="uk-text-small uk-margin-small-bottom">
								Adjustment Quantity. 

								<template v-if="selectedPurchase">({{selectedPurchase.quantity | number('0,0') | pluralize('Unit') }} Max.)</template>
							</span>
							<a-input-number placeholder="Enter Adjustment Quantity" v-model="form.quantity" :max="selectedPurchase ? selectedPurchase.quantity : 0"></a-input-number>
							<span class="text-small tiny-margin-bottom uk-text-danger" v-if="errors && errors.quantity">{{errors.quantity[0]}}</span>

						</div>

						<div class="tiny-padding uk-flex uk-flex-column tags-input">
							<span class="uk-text-small uk-margin-small-bottom">Adjustment Reason</span>
							<a-select placeholder="Select adjustment reason" size="large" notFoundContent="Reason Not Found" show-search option-label-prop="text" v-model="form.reason">
								<a-select-option v-for="(option, key) in reasons" :key="key" :value="option" :text="option">
									{{option}}
								</a-select-option>
							</a-select>
							<span class="text-small tiny-margin-bottom uk-text-danger" v-if="errors && errors.reason">{{errors.reason[0]}}</span>

						</div>

						<div class="tiny-padding uk-flex uk-flex-column">
							<span class="uk-text-small uk-margin-small-bottom">
								Provide additional notes for this adjustment.
							</span>
							<textarea rows="5" class="uk-textarea" placeholder="Additional notes" v-model="form.note"></textarea>
							<span class="text-small tiny-margin-bottom uk-text-danger" v-if="errors && errors.note">{{errors.note[0]}}</span>

						</div>
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger uk-margin-small-top" :disabled="!form.quantity || !form.reason || form.reason.length < 5 || !purchase  || loading" @click="recordAdjustment()">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>
								Record Adjustment
							</template>
						</button>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>
<script>

import {bindProps} from "@/mixins/stock/singleton"
export default {
	mixins : [bindProps],
	data(){
		return {
			loading : false,
			reasons : ['Theft', 'Breakages', 'Expired Items', 'Protocol Sales', 'Gifts', 'Other'],
			purchase : undefined,
			form : {
				quantity : '',
				reason : '',
				note : '',
			}
		}
	},


	computed : {
		selectedPurchase(){
			if (this.purchase) {
				return this.product.available_purchases.filter(item => {return item.uuid === this.purchase})[0]
			}
			return undefined
		}
	},


	methods : {
		reset(){
			this.form = {
				quantity : '',
				reason : '',
				note : '',
			}
			this.purchase = undefined
		},


		async recordAdjustment(){
			this.loading = true
			await this.$axios.$post(`/warehouse/${this.purchase}/adjustments`, this.form)
			.then(()=>{
				this.reset()
				this.$message.success('Stock adjustment recorded', 5)
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to record adjustment. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 5)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	},


	mounted(){
		this.$on('done', ()=>{
			this.$uikit.modal(this.$refs.modal).hide()
		})
	}

}
</script>
