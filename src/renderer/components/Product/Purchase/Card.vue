<template>
	<div>
		<div class="uk-padding-small uk-padding-remove-horizontal uk-flex uk-flex-wrap">

			<div class="uk-width-expand@xl uk-flex uk-flex-middle">
				<div class="grid-gutter uk-width-small">
					<div class="uk-width-1-1">
						<p class="uk-text-truncate uk-margin-remove uk-text-capitalize">
							{{purchase.product_variation.variation.name}}
						</p>
						<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
							{{purchase.product_variation.code}}
						</p>
					</div>
				</div>
				<div class="grid-gutter uk-width-small">
					<div class="uk-width-1-1">
						<p class="uk-text-truncate uk-margin-remove">
							{{purchase.quantity | number('0,0')}}
						</p>
					</div>
				</div>
				<div class="grid-gutter uk-width-small">
					<div class="uk-width-1-1">
						<p class="uk-text-truncate uk-margin-remove">
							{{purchase.cost_price | currency('')}}
						</p>
					</div>
				</div>

				<div class="grid-gutter uk-width-small">
					<div class="uk-width-1-1">
						<p class="uk-text-truncate uk-margin-remove">
							{{purchase.discount_received | currency('')}}
						</p>
					</div>
				</div>

				<div class="grid-gutter uk-width-small">
					<div class="uk-width-1-1">
						<p class="uk-text-truncate uk-margin-remove" v-if="purchase.supplier && purchase.supplier.name !== undefined">
							
							<nuxt-link :to="{name: 'suppliers-supplier', params : {supplier: purchase.supplier.uuid}}" class="uk-text-success underlined"  v-if="can('view-suppliers')">
								{{purchase.supplier.name | truncate(15)}}
							</nuxt-link>

							<template v-else>
								{{purchase.supplier.name | truncate(15)}}
							</template>
						</p>

						<p v-else class="uk-margin-remove">
							N/A
						</p>
					</div>
				</div>

				

				<div class="grid-gutter uk-width-small">
					<div class="uk-width-1-1">
						<p class="uk-text-truncate uk-margin-remove">
							{{ purchase.created_by && purchase.created_by.name ? purchase.created_by.name : 'System Admin'  }}
						</p>
					</div>
				</div>

				<div class="grid-gutter uk-width-small">
					<div class="uk-width-1-1">
						<p class="uk-text-truncate uk-margin-remove">
							{{$moment(purchase.created_at).format('DD MMM, YYYY')}}
						</p>
					</div>
				</div>



			</div>


			<div  class="tiny-margin-top uk-padding-small uk-padding-remove-vertical uk-width-auto@xl">
				<div class="uk-flex uk-flex-right" v-if="!purchase.is_reversed">
					<product-purchase-actions-reverse :purchase="purchase" @done="$emit('done')" v-if="can('reverse-purchases')"></product-purchase-actions-reverse>
				</div>

				<div v-else>
					<div class="uk-flex uk-flex-wrap uk-flex-right uk-flex-middle uk-width-1-1">
						<span class="chip uk-background-danger-op text-small uk-border-rounded click" @click="reasonModal = true">
							Reversed.  Click for info
						</span>
					</div>

					<vue-final-modal v-model="reasonModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary">
						<div class="uk-width-1-1 uk-margin-auto-vertical">
							<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium@s uk-overflow-auto modal-content">

								<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom uk-width-1-1">
									<h5 class="uk-margin-remove uk-text-bold">
										Reversal Info
									</h5>
									<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="reasonModal = false" >
										Close
									</a>

								</div>

								<div class="uk-padding-small">
									<p>
										This purchase was reversed by {{purchase.reversed_by.name}} on {{$moment(purchase.reversed_at).format("DD MMMM, YYYY  : hh mm a")}}.
									</p>
									<h6 class="text-small">
										Reason Provided Was
									</h6>
									<p>
										{{purchase.reversal_reason}}
									</p>
								</div>

							</div>
						</div>
					</vue-final-modal>
				</div>
			</div>

		</div>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/purchase"
export default{
	mixins : [bindProps],
	data(){
		return {
			reasonModal : false
		}
	}
};
</script>
