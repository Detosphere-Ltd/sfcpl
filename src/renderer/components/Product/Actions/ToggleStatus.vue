<template>
	<div>
		<div class="uk-width-1-1 click" @click="showModal = true">
			<slot name="action-button">
				<span :class="product.active ? 'uk-text-danger' : 'uk-text-success'">
					{{product.active ? "Deactivate" : "Activate"}} Product
				</span>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" attach=".content">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large">


					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							{{product.active ? "Deactivate" : "Activate"}} Product
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
							Close
						</a>
					</div>

					<div class="tiny-padding  uk-overflow-auto modal-content">
						<h5 >
							Are you sure you want to {{product.active ? "deactivate" : "activate" }} this product? <br> {{product.name | capitalize}}
						</h5>

						<p class="uk-margin-remove">
							This action will {{product.active ? "deactivate from your product catalog. You will not be able to perform some actions on this product until it is activated" : "activate in your product catalog" }}.
						</p>
						<hr class="uk-margin-small-bottom">
						<div>
							<button class="uk-button uk-button-small" :disabled="loading" :class="product.active ? 'uk-button-danger' : 'uk-button-primary'" @click="toggle">
								<partials-loader v-if="loading"></partials-loader>
								<template v-else>
									{{product.active ? "Deactivate" : "Activate" }}
								</template>
							</button>

						</div>

					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps, toggleActiveState} from "@/mixins/product/singleton"
export default{
	mixins : [bindProps, toggleActiveState],
	data(){
		return {
			showModal : false,
			loading : false,
		}
	}
};
</script>