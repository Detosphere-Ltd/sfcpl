<template>
	<div>
		<div @click="$uikit.modal($refs.modal).show()" class="click">
			<slot name="action-button">
				<button  class="uk-button uk-button-primary  uk-flex-middle uk-flex uk-button-small">
					<span class="uk-margin-small-right mdi mdi-plus-circle uk-text-white"></span>
					Update Levy
				</button>
			</slot>
		</div>

		<div class="uk-width-1-1 uk-padding-remove"  uk-modal="esc-close: false; bg-close: false; sel-close: .levy-update-modal; delay-hide: 0; delay-show: 0; stack: true" ref="modal" @beforeshow="$emit('opening')"  @beforehide="$emit('closing')">
			<div :class="colorMode" class="uk-modal-dialog transparent uk-padding-remove uk-width-large@s uk-margin-large-top uk-animation-slide-top-small uk-animation-fast uk-width-1-1 uk-border-rounded">

				<div class="uk-width-1-1 background  uk-inline uk-flex uk-flex-column uk-border-rounded no-radius-sm bordered no-border-sm">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Update Levy
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded levy-update-modal">
							Close
						</a>
					</div>
					<div class="modal-content">
						<div class="uk-flex uk-flex-wrap">
							<div class="tiny-padding uk-width-1-1 uk-flex uk-flex-column">
								<span class="text-small uk-margin-small-bottom">
									Levy Name
								</span>
								<input type="text" class="uk-input uk-form-large" placeholder="Name" v-model="form.name" @focus="cleanup">

								<span class="text-small uk-text-danger" v-if="errors && errors.name">
									{{errors.name[0]}}
								</span>
							</div>

							<div class="tiny-padding uk-width-1-1 uk-flex uk-flex-column">
								<span class="text-small uk-margin-small-bottom">
									Percentage Charge
								</span>
								<a-input-number v-model="form.percent" size="large"  @focus="cleanup" class="input-number" :formatter="value => `${value} %`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')" :step="0.1" :max="100" :min="0"></a-input-number>

								<span class="text-small uk-text-danger" v-if="errors && errors.percent">
									{{errors.percent[0]}}
								</span>
							</div>

							<div class="uk-width-1-1 uk-flex uk-flex-column">
								

								<div class="tiny-padding">
									<span class="text-small">
										This Levy applies to 
									</span>
								</div>
								
								<div class="tiny-padding uk-flex border-bottom click" @click.prevent="form.applies_to = 'product'">
									<div class="square-30 bordered background uk-margin-small-right rounded center">
										<span class="mdi mdi-check uk-text-large" v-if="form.applies_to === 'product'"></span>
									</div>
									<div class="uk-width-expand uk-flex uk-flex-column">
										<span>
											Individual Products
										</span>
										<span class="text-small">
											This levy applies only to specific products
										</span>
									</div>
								</div>

								<div class="tiny-padding uk-flex click" @click.prevent="form.applies_to = 'sale'">
									<div class="square-30 bordered background uk-margin-small-right rounded center">
										<span class="mdi mdi-check uk-text-large" v-if="form.applies_to === 'sale'"></span>
									</div>
									<div class="uk-width-expand uk-flex uk-flex-column">
										<span>
											All Sales
										</span>
										<span class="text-small">
											This levy applies to every product in every sale
										</span>
									</div>
								</div>


								<span class="text-small uk-text-danger tiny-padding" v-if="errors && errors.applies_to">
									{{errors.applies_to[0]}}
								</span>
							</div>
						</div>

						<div class="tiny-padding border-top">
							<button class="uk-button uk-button-primary uk-button-large uk-width-1-1" :class="{loading : loading}" :disabled="loading || !form.name || form.percent < 0 || !form.applies_to" @click.prevent="patch">
								Update Levy
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { bindProps , base , patch} from "@/mixins/levy"
import editor from "@/mixins/utils/editor"
export default {

	mixins : [bindProps , base , patch, editor],

	mounted(){

		this.setupEditor('form', this.levy)

		this.$on('done', ()=>{
			this.$uikit.modal(this.$refs.modal).hide()
		})
	}

}
</script>
