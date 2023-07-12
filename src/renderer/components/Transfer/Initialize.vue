<template>
	<div>
		<button class="uk-button uk-button-success uk-text-white uk-button-small" :disabled="selection && selection.length < 1" @click="showModal = true">
			Transfer Selected {{ selection.length | pluralize('Product') }}
		</button>
		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-medium background raised-deep uk-border-rounded bordered">
					<transfer-automatically :selection="selection" class="border-bottom tiny-padding" @emptied="showModal = false; $emit('emptied')" @transfer-initiated="$emit('transfer-initiated'); $emit('emptied')">
					</transfer-automatically>
					<transfer-manually :selection="selection" class="tiny-padding" @emptied="showModal = false; $emit('emptied')" @transfer-initiated="$emit('transfer-initiated'); $emit('emptied')">
					</transfer-manually>
					<div class="uk-flex uk-flex-center uk-padding-small border-top">
						<button class="uk-button uk-button-small uk-button-danger" @click="showModal = false">
							Cancel
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>

	</div>
</template>
<script>
export default{
	data(){
		return {
			showModal : false
		}
	},
	props : {
		selection : {
			type : Array,
			default : []
		}
	},
};
</script>
