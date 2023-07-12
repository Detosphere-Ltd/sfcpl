<template>
	<div>
		<div @click="$uikit.modal($refs.modal).show()" class="click">
			<slot name="action-button">
				<button  class="uk-button uk-flex-middle uk-flex uk-button-small">
					{{ levy.active ? 'Deactivate' : 'Activate' }} Levy
				</button>
			</slot>
		</div>

		<div class="uk-width-1-1 uk-padding-remove"  uk-modal="esc-close: false; bg-close: false; sel-close: .levy-toggle-modal; delay-hide: 0; delay-show: 0; stack: true" ref="modal" @beforeshow="$emit('opening')"  @beforehide="$emit('closing')">
			<div :class="colorMode" class="uk-modal-dialog transparent uk-padding-remove uk-width-medium@s uk-margin-large-top uk-animation-slide-top-small uk-animation-fast uk-width-1-1 uk-border-rounded">
				<div class="uk-width-1-1 background  uk-inline uk-flex uk-flex-column uk-border-rounded no-radius-sm bordered no-border-sm">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							{{ levy.active ? 'Deactivate' : 'Activate' }} Levy
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded levy-toggle-modal">
							Close
						</a>
					</div>
					<div class="modal-content">						
						<div class="uk-padding-small uk-flex uk-flex-column uk-flex-middle">
							<p class="uk-margin-remove uk-text-center">
								Are you sure you want to {{levy.active ? 'deactivate' : 'activate'}} {{levy.name}} in your store?
							</p>
						</div>
					</div>
					<div class="tiny-padding border-top">
						<button class="uk-button uk-button-large uk-width-1-1" :class="[loading ?  'loading' : '', levy.active ? 'uk-button-danger' : 'uk-button-primary']" :disabled="loading" @click.prevent="toggle">
							{{levy.active ? 'Deactivate' : 'Activate'}} Levy
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { bindProps ,toggle} from "@/mixins/levy"
export default {

	mixins : [bindProps , toggle],

	mounted(){
		this.$on('done', ()=>{
			this.$uikit.modal(this.$refs.modal).hide()
		})
	}

}
</script>
