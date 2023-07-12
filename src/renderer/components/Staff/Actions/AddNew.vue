<template>
	<div>
		<div @click="$uikit.modal($refs.modal).show()" class="click">
			<slot name="action-button">
				<button  class="uk-button uk-button-primary  uk-flex-middle uk-flex uk-button-small">
					<span class="uk-margin-small-right mdi mdi-plus-circle uk-text-white"></span>
					New Staff
				</button>
			</slot>
		</div>

		<div class="uk-width-1-1 uk-padding-remove"  uk-modal="esc-close: false; bg-close: false; sel-close: .close-add-staff-modal; delay-hide: 0; delay-show: 0; stack: true" ref="modal" @beforeshow="$emit('opening')"  @beforehide="$emit('closing')">
			<div :class="colorMode" class="uk-modal-dialog transparent uk-padding-remove uk-width-2xlarge@s uk-margin-auto-vertical uk-animation-slide-top-small uk-animation-fast uk-width-1-1 uk-border-rounded">

				<div class="uk-width-1-1 background  uk-inline uk-flex uk-flex-column uk-border-rounded no-radius-sm bordered no-border-sm">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Setup A New Staff Account
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded close-add-staff-modal" :disabled="loading">
							Close
						</a>
					</div>
					<div class="tiny-padding">
						<staff-forms-new-staff @staff-added="$emit('needs-to-refresh'); $uikit.modal($refs.modal).hide() "></staff-forms-new-staff>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {base} from "@/mixins/staff/actions"
export default{
	data(){
		return {
			showModal : false
		}
	},
	mixins : [ base],
};
</script>
