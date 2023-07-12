<template>
	<div>

		<div class="uk-width-1-1" @click="reasonModal = true">
			<slot name="action-button">
				<div class="chip  uk-border-rounded click">
					<span class="text-small">
						See Reversal Reason
					</span>
				</div>
			</slot>

		</div>



		<vue-final-modal v-model="reasonModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium@s">


					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Sale Rerversal Reason
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="reasonModal = false">
							Close
						</a>
					</div>
					<div class="uk-overflow-auto modal-content">

						<div class="uk-flex uk-flex-column uk-margin-small-bottom tiny-padding">
							<span class="uk-text-small">
								Reason for reversal
							</span>
							<h6 class="tiny-margin-bottom">
								{{sale.reversal_reason}}
							</h6>


							<blockquote class="uk-text-small uk-margin-remove">
								{{sale.reversal_note ? sale.reversal_note : "No Additional Notes"}}
							</blockquote>
						</div>
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-column">
						<span class="text-small">
							Reversed on {{$moment(sale.reversed_at).format('DD MMM, YYYY')}} at {{$moment(sale.reversed_at).format('hh : mm, A')}}
						</span>
						<h5 class="uk-margin-remove">
							{{sale.reversed_by.name}}
						</h5>
					</div>

				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/sales/singleton"
export default {
	mixins : [bindProps],
	data(){
		return {
			reasonModal : false
		}
	}
}
</script>