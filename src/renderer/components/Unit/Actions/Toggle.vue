<template>
	<div>
		<div class="uk-width-1-1 click" @click="showModal = true">
			<slot name="action-button">
				<div class="status" :class="unit.active ? 'uk-background-danger' : 'uk-background-primary'">
					<span class="text-small uk-text-white">
						{{unit.active ? "Deactivate" : "Activate"}}
					</span>
				</div>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" attach=".content">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium">


					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							{{unit.active ? "Deactivate" : "Activate"}}
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
							Close
						</a>
					</div>

					<div class="tiny-padding  uk-overflow-auto modal-content">
						<h5 >
							Are you sure you want to {{unit.active ? "deactivate" : "activate" }} this purchase unit?
						</h5>
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-small" :disabled="loading" :class="unit.active ? 'uk-button-danger' : 'uk-button-primary'" @click="toggle">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>
								{{unit.active ? "Deactivate" : "Activate" }}
							</template>
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps, toggleActiveState} from "@/mixins/unit"
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