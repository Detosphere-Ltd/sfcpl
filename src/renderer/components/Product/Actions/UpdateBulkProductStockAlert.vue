<template>
	<div>
		<div class="uk-width-1-1 click" @click="selection.length > 0 ? showModal = true : ''">
			<slot name="action-button">
				<button class="uk-button uk-button-success uk-button-small uk-text-white" :disabled="selection.length < 1">
					Stock Alert Settings
				</button>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" attach=".content">
			<div class="uk-width-1-1 uk-margin-large-top">
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
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
							Close
						</a>
					</div>
					

					<div class="tiny-padding uk-overflow-auto modal-content">
						<div class="uk-width-1-1 uk-flex uk-flex-wrap">
							<div class="uk-width-1-1 uk-flex uk-flex-column">
								<h4>Update Stock Alert Settings for {{ selection.length | pluralize('Product') }}</h4>
							</div>

							<div class="uk-width-1-1">
								<h6>Warehouse Stock Alert Settings</h6>

								<div class="uk-width-1-1 bordered uk-border-rounded">
									<div class="uk-flex  uk-width-1-1 border-bottom">
										<div class="border-right uk-width-expand uk-flex uk-flex-column uk-flex-center tiny-padding uk-padding-remove-vertical">
											<span>
												Warning Level
											</span>
										</div>

										<div class="uk-width-1-2 uk-flex">
											<a-input-number @focus="cleanup" class="uk-width-1-1 no-border" v-model="stock_alert_settings.warehouse.warning" size="large" placeholder="Warning Stock Level" :formatter="value => `${value} ${$options.filters.pluralize(Number(value),'Unit')}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')"></a-input-number>
										</div>
									</div>

									<div class="uk-flex uk-flex-wrap uk-width-1-1">
										<div class="border-right uk-width-expand uk-flex uk-flex-column uk-flex-center tiny-padding uk-padding-remove-vertical">
											<span>
												Danger Level
											</span>
										</div>

										<div class="uk-width-1-2 uk-flex">
											<a-input-number @focus="cleanup" class="uk-width-1-1 no-border" v-model="stock_alert_settings.warehouse.danger" size="large" placeholder="Danger Stock Level" :formatter="value => `${value} ${$options.filters.pluralize(Number(value),'Unit')}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')"></a-input-number>
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
								<h6>Branch Stock Alert Settings</h6>

								<div class="uk-width-1-1 bordered uk-border-rounded">
									<div class="uk-flex uk-flex-wrap uk-width-1-1 border-bottom">
										<div class="border-right uk-width-expand uk-flex uk-flex-column uk-flex-center tiny-padding uk-padding-remove-vertical">
											<span>
												Warning Level
											</span>
										</div>

										<div class="uk-width-1-2 uk-flex">
											<a-input-number @focus="cleanup" class="uk-width-1-1 no-border" v-model="stock_alert_settings.branch.warning" size="large" placeholder="Warning Stock Level" :formatter="value => `${value} ${$options.filters.pluralize(Number(value),'Unit')}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')"></a-input-number>
										</div>
									</div>

									<div class="uk-flex uk-flex-wrap uk-width-1-1">
										<div class="border-right uk-width-expand uk-flex uk-flex-column uk-flex-center tiny-padding uk-padding-remove-vertical">
											<span>
												Danger Level
											</span>
										</div>

										<div class="uk-width-1-2 uk-flex">
											<a-input-number @focus="cleanup" class="uk-width-1-1 no-border" v-model="stock_alert_settings.branch.danger" size="large" placeholder="Danger Stock Level" :formatter="value => `${value} ${$options.filters.pluralize(Number(value),'Unit')}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')"></a-input-number>
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
		</vue-final-modal>

	</div>
</template>
<script>
import {bindProps, stockAlerts} from "@/mixins/product/singleton"
export default{
	props : {
		selection : {
			type : Array,
		default : []
		}
	},

	data(){
		return {
			loading : false,

			showModal : false,

			stock_alert_settings : {
				warehouse : {
					warning : 0,
					danger : 0,
				},
				branch : {
					warning : 0,
					danger : 0,
				}
			}
		}
	},

	methods : {
		async updateStockAlerts(){
			this.loading = true
			await this.$axios.$post(`/products/stock-alert-settings`, { products : this.selection , stock_alert_setting : this.stock_alert_settings})
			.then(()=>{
				this.showModal = false
				this.$emit('done')
				this.$message.success(`Products Stock Alert updated.`, 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to update stock alert for the selected products. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
};
</script>
