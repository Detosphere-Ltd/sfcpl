<template>
	<div>
		<div class="click" @click="showModal = true">
			<slot name="action-button">
				<a class="uk-text-truncate uk-margin-remove-vertical chip uk-border-rounded uk-background-danger">
					<small class="text-small uk-text-truncate uk-text-white">
						Reverse Adjustment
					</small>
				</a>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Reverse Stock Adjustment
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
							Close
						</a>
					</div>



					<div class="uk-overflow-auto modal-content">
						<div class="uk-flex uk-flex-column border-bottom tiny-padding">
							<h5 class="uk-margin-remove-top tiny-margin-bottom">
								{{ adjustment.quantity | number('0,0') | pluralize('Unit') }} of {{ adjustment.model.product_variation.product.name }} will be added back to your warehouse stock after this action.
							</h5>

							<span class="text-small">
								Product Code : {{ adjustment.model.product_variation.product.code }} 
							</span>

							<span class="text-small">
								Variation : {{adjustment.model.product_variation.variation.name}} 
							</span>

							<div class="tiny-padding uk-padding-remove-horizontal uk-flex uk-flex-column">
								<div class="uk-flex uk-flex-column">
									<p class="uk-margin-remove">
										Recorded by {{adjustment.created_by.name}}
									</p>
									<span>
										{{$moment(adjustment.created_at).format('ddd MMM DD, YYYY')}} at {{$moment(adjustment.created_at).format('hh:mm A')}}

										&nbsp;&bull;&nbsp;

										<template v-if="adjustment.branch && adjustment.branch.name">
											At {{adjustment.branch.name | branchize}}
										</template>
										<template v-else>
											At Warehouse
										</template>


									</span>
									<span>
										Reason : {{ adjustment.tags[0].name | capitalize }}
									</span>
								</div>
								<div class="tiny-padding uk-padding-remove-horizontal uk-flex uk-flex-column tiny-margin-top" v-if="adjustment.note">
									<span class="text-small-spaced uk-text-uppercase">Note</span>
									<p class="tiny-margin-top uk-margin-remove-bottom">
										{{ adjustment.note }}
									</p>
								</div>
							</div>
						</div>


						<div class="tiny-padding uk-flex uk-flex-column">
							<span class="uk-text-small">
								Reason for stock adjustment reversal 
							</span>
							<span class="uk-text-warning uk-margin-small-bottom text-small">(Required. At least 5 characters)</span>
							<textarea rows="10" class="uk-textarea" placeholder="Reversal reason" v-model="form.reason"></textarea>
							<span class="text-small tiny-margin-bottom uk-text-danger" v-if="errors && errors.reason">{{errors.reason[0]}}</span>

						</div>
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger uk-margin-small-top" :disabled="!form.reason || form.reason.length < 5 || loading" @click="reverseAdjustment()">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>
								Reverse Adjustment
							</template>
						</button>
					</div>


				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>

export default {
	props : {
		adjustment : {
			type : Object,
			required : true
		}
	},
	data(){
		return {
			showModal : false,
			loading : false,
			form : {
				reason : '',
			}
		}
	},



	methods : {
		reset(){
			this.form = {
				reason : '',
			}
		},


		async reverseAdjustment(){
			this.loading = true
			await this.$axios.$post(`/stock-adjustments/${this.adjustment.uuid}`, this.form)
			.then(()=>{
				this.reset()
				this.$message.success('Stock adjustment reversed', 5)
				this.showModal = false
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`Failed to reverse adjustment. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 5)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}

}
</script>
