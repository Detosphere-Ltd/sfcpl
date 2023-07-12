<template>
	<div>
		<div class="square-20 uk-flex uk-flex-column uk-flex-middle uk-flex-center background uk-border-circle click" @click="showModal = true">
			<div class="pulse  uk-flex uk-flex-column uk-flex-center uk-flex-middle square-20" :class="product.has_expired_items ? 'warn' : 'good'">
				<!--  -->
				<div class="square-20 uk-flex uk-flex-column uk-flex-middle uk-flex-center">
					<span class="mdi" :class="product.has_expired_items ? 'mdi-alert uk-text-danger' : 'mdi-check uk-text-white'"></span>
				</div>
			</div>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Expiry Notice
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
							Close
						</a>
					</div>
					
					<div class="tiny-padding">

						<template v-if="product.has_expired_items">
							<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding-small">
								<div class="square-40 uk-flex uk-flex-column uk-flex-middle uk-flex-center background uk-border-circle">
									<div class="pulse  uk-flex uk-flex-column uk-flex-center uk-flex-middle square-40 warn">
										<div class="square-40 uk-flex uk-flex-column uk-flex-middle uk-flex-center">
											<span class="mdi lni-large mdi-alert uk-text-danger"></span>
										</div>
									</div>
								</div>
								<p class="uk-text-center uk-margin-top">
									{{ product.expired_items_quantity | pluralize('Unit')}} of this product 
									{{ product.expired_items_quantity | pluralize(['has', 'have'], {includeNumber : false}) }} expired.  
								</p>
							</div>
						</template>

						<template v-else>
							<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding-small">
								<div class="square-40 uk-flex uk-flex-column uk-flex-middle uk-flex-center background uk-border-circle">
									<div class="pulse  uk-flex uk-flex-column uk-flex-center uk-flex-middle square-40 good">
										<div class="square-40 uk-flex uk-flex-column uk-flex-middle uk-flex-center">
											<span class="mdi lni-large mdi-check uk-text-white"></span>
										</div>
									</div>
								</div>
								<p class="uk-text-center uk-margin-top">
									Everything looks good. There are no expired items for this product.  
								</p>
							</div>
						</template>
					</div>


				</div>
			</div>
		</vue-final-modal>



	</div>
</template>
<script>
import {bindProps} from "@/mixins/stock/singleton"
export default{
	mixins : [bindProps],
	data(){
		return {
			showModal : false,
		}
	},

};
</script>
