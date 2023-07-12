<template>
	<div>

		<div @click="$uikit.modal($refs.modal).show()" class="click">
			<slot name="action-button">
				<button  class="uk-button uk-button-primary  uk-flex-middle uk-flex uk-button-small">
					<span class="uk-margin-small-right mdi mdi-plus-circle uk-text-white"></span>
					Stock Alert Settings
				</button>
			</slot>
		</div>


		<div class="uk-width-1-1 uk-padding-remove"  uk-modal="esc-close: false; bg-close: false; sel-close: .product-stock-alert; delay-hide: 0; delay-show: 0; stack: true" ref="modal" @beforeshow="$emit('opening')"  @beforehide="$emit('closing')">
			<div :class="colorMode" class="uk-modal-dialog transparent uk-padding-remove uk-width-large@s uk-margin-large-top uk-animation-slide-top-small uk-animation-fast uk-width-1-1 uk-border-rounded">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s uk-inline">
					<div class="uk-position-cover uk-position-z-index" v-if="loading">
						<div class="uk-height-1-1 uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered rounded">
							<loaders-spinner class="uk-margin-bottom"></loaders-spinner>
							<span>Updating stock alert settings...</span>
						</div>
					</div>

					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Stock Alert Settings
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded product-stock-alert">
							Close
						</a>
					</div>

					<div class="uk-width-1-1 uk-flex uk-flex-column border-bottom tiny-padding">
						<h3 class="uk-margin-remove">{{product.name}}</h3>
						<span class="text-small">{{product.code}}</span>
					</div>

					<div class="tiny-padding uk-overflow-auto modal-content">
						<div class="uk-width-1-1 uk-flex uk-flex-wrap">

							<div class="uk-width-1-1">
								<h5>Warehouse Stock Alert Settings</h5>

								<div class="uk-width-1-1 bordered uk-border-rounded">
									<div class="uk-flex  uk-width-1-1 border-bottom">
										<div class="border-right uk-width-expand uk-flex uk-flex-column uk-flex-center tiny-padding uk-padding-remove-vertical">
											<span>
												Warning Level
											</span>
										</div>

										<div class="uk-width-1-2 uk-flex">
											<a-input-number @focus="cleanup" class="uk-width-1-1 no-border" v-model="stock_alert_settings.warehouse.warning" size="large" placeholder="Warning Stock Level" :formatter="value => `${value} ${$options.filters.pluralize(Number(value),'Unit', {includeNumber : false})}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')"></a-input-number>
										</div>
									</div>

									<div class="uk-flex uk-flex-wrap uk-width-1-1">
										<div class="border-right uk-width-expand uk-flex uk-flex-column uk-flex-center tiny-padding uk-padding-remove-vertical">
											<span>
												Danger Level
											</span>
										</div>

										<div class="uk-width-1-2 uk-flex">
											<a-input-number @focus="cleanup" class="uk-width-1-1 no-border" v-model="stock_alert_settings.warehouse.danger" size="large" placeholder="Danger Stock Level" :formatter="value => `${value} ${$options.filters.pluralize(Number(value),'Unit', {includeNumber : false})}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')"></a-input-number>
										</div>

										<div class="uk-width-1-1 tiny-padding border-top">
											<span class="text-small uk-text-danger" v-if="errors && errors['stock_alert_setting.warehouse.danger']">
												{{errors['stock_alert_setting.warehouse.danger'][0]}}
											</span>
											<span v-else>
												PS: The Danger level must be below the warning level
											</span>

										</div>
									</div>

								</div>
							</div>


							<div class="uk-width-1-1 uk-margin-top">
								<h5>Branch Stock Alert Settings</h5>

								<div class="uk-width-1-1 bordered uk-border-rounded">
									<div class="uk-flex uk-flex-wrap uk-width-1-1 border-bottom">
										<div class="border-right uk-width-expand uk-flex uk-flex-column uk-flex-center tiny-padding uk-padding-remove-vertical">
											<span>
												Warning Level
											</span>
										</div>

										<div class="uk-width-1-2 uk-flex">
											<a-input-number @focus="cleanup" class="uk-width-1-1 no-border" v-model="stock_alert_settings.branch.warning" size="large" placeholder="Warning Stock Level" :formatter="value => `${value} ${$options.filters.pluralize(Number(value),'Unit', {includeNumber : false})}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')"></a-input-number>
										</div>
									</div>

									<div class="uk-flex uk-flex-wrap uk-width-1-1">
										<div class="border-right uk-width-expand uk-flex uk-flex-column uk-flex-center tiny-padding uk-padding-remove-vertical">
											<span>
												Danger Level
											</span>
										</div>

										<div class="uk-width-1-2 uk-flex">
											<a-input-number @focus="cleanup" class="uk-width-1-1 no-border" v-model="stock_alert_settings.branch.danger" size="large" placeholder="Danger Stock Level" :formatter="value => `${value} ${$options.filters.pluralize(Number(value),'Unit', {includeNumber : false})}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')"></a-input-number>
										</div>

										<div class="uk-width-1-1 tiny-padding border-top">
											<span class="text-small uk-text-danger" v-if="errors && errors['stock_alert_setting.branch.danger']">
												{{errors['stock_alert_setting.branch.danger'][0]}}
											</span>
											<span v-else>
												PS: The Danger level must be below the warning level
											</span>

										</div>
									</div>

								</div>
							</div>

						</div>
					</div>

					<div class="uk-width-1-1 tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-primary" @click="updateStockAlerts" :disabled="loading">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>Update Stock Alert Settings</template>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {bindProps, stockAlerts} from "@/mixins/product/singleton"
export default{
	mixins : [bindProps, stockAlerts],

	mounted(){
		this.$on('done', ()=>{
			this.$uikit.modal(this.$refs.modal).hide()
		})
	}
};
</script>
