<template>
	<div>
		<button class="uk-button uk-button-success uk-button-small uk-text-white" @click="showModal = true">
			Accept Request 
		</button>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-top">
				<div class="uk-width-medium background raised-deep uk-border-rounded bordered">
					<request-actions-auto-accept :transfer="transfer" class="border-bottom tiny-padding" @done="showModal = false; $emit('done')"  @emptied="showModal = false; $emit('emptied')">
					</request-actions-auto-accept>
					<request-actions-accept-manually :transfer="transfer" class="tiny-padding"  @done="showModal = false; $emit('done')" @emptied="showModal = false; $emit('emptied')">
					</request-actions-accept-manually>

					<div class="uk-flex uk-flex-center uk-padding-small border-top">
						<button class="uk-button uk-button-small uk-button-danger" @click="showModal = false;">
							Cancel
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>

<script>
import {base, bindProps} from "@/mixins/requests/singleton"
export default{
	mixins : [base, bindProps],
};
</script>
