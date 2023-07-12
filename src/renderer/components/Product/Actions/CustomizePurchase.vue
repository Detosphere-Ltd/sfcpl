<template>
	<div>
		<div class="uk-width-1-1 click" @click="showModal = true">
			<slot name="action-button">
				<a class="uk-border-circle square-30 uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-background-primary">
					<span class="mdi mdi-pencil uk-text-white"></span>
				</a>
			</slot>
		</div>

		<vue-final-modal :key="showModal" v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" attach=".content" @before-open="setupFields; $emit('opening')" @before-close="$emit('closing')">
			<div class="uk-width-1-1 uk-margin-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-xlarge@s uk-inline">

					<div class="uk-position-cover uk-position-z-index" v-if="loading">
						<div class="uk-height-1-1 uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered rounded">
							<loaders-spinner class="uk-margin-bottom"></loaders-spinner>
							<span>Processing...</span>
						</div>
					</div>

					<div class="uk-flex uk-flex-middle tiny-padding border-bottom">
						<div class="uk-flex uk-flex-middle uk-margin-auto-right">
							<tips-custom-purchase-fields class="uk-margin-small-right"></tips-custom-purchase-fields>
							<h5 class="uk-margin-remove uk-text-bold">
								Add Custom Purchase Attributes
							</h5>
						</div>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
							Close
						</a>
					</div>
					

					<div class="tiny-padding uk-overflow-auto modal-content">
						<div class="uk-width-1-1 bordered uk-border-rounded uk-margin-small-bottom" v-if="fields && fields.length > 0">

							<template  v-for="(field, key) in fields">


								<div class=" tiny-padding" :key="key" :class="key < fields.length - 1 ? 'border-bottom' : ''">
									<div class="uk-flex uk-flex-right uk-margin-small-bottom" >
										<span class="label click uk-background-danger uk-border-rounded" @click="removeEntry(key)">
											<span class="text-small uk-text-white">
												Remove
											</span>
										</span>
									</div>

									<div>
										<div class="uk-flex uk-flex-wrap uk-flex-top uk-margin-small-bottom">
											<span class="text-small uk-margin-small-right">
												Attribute Name <br>
												(Required)
											</span>
											<div class="uk-width-expand uk-flex uk-flex-column">
												<input type="text" class="uk-input uk-width-1-1" placeholder="Name of field (Unique)" v-model="fields[key].name">

												<span class="text-small uk-text-danger"  v-if="errors && errors[`custom_purchase_attributes.${key}.name`]">
													{{errors[`custom_purchase_attributes.${key}.name`][0]}}
												</span>
											</div>
										</div>

										<div class="uk-flex uk-flex-top">
											<span class="text-small uk-margin-right">
												Settings
											</span>
											<div class="uk-width-expand uk-flex uk-flex-column uk-margin-medium-left">
												<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom tags-input">
													<span class="text-small tiny-margin-bottom">
														Attribute Type
													</span>
													
													<a-select show-search size="large" v-model="fields[key].type" option-label-prop="title">
														<a-select-option value="text" title="Text Value">
															<div>
																Text Value
															</div>
															<div class="text-small">
																Text, Alpha-Numeric Values, String caharacters etc.
															</div>
														</a-select-option>
														<a-select-option value="number" title="Numeric Value" class="border-top">
															<div>
																Numeric Value
															</div>
															<div class="text-small">
																Accept only numeric values for this field.
															</div>
														</a-select-option>
													</a-select>
													<span class="text-small uk-text-danger"  v-if="errors && errors[`custom_purchase_attributes.${key}.type`]">
														{{errors[`custom_purchase_attributes.${key}.type`][0]}}
													</span>
												</div>

												<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom">
													<label class="uk-flex uk-flex-top grid-gutter uk-padding-remove-bottom click">
														<div class="uk-light tiny-margin-right tiny-margin-top uk-width-auto">
															<input type="checkbox" class="uk-checkbox  uk-border-rounded  bordered square-20" :disabled="loading" v-model="fields[key].required">
														</div>
														<span class="uk-flex uk-flex-column uk-width-expand text-small tiny-margin-left">
															<span class="uk-text-bold">Set as a required field</span>
															<span>
																If checked, this field will be required for every puchase of this product
															</span>
														</span>
													</label>
													<span class="text-small uk-text-danger"  v-if="errors && errors[`custom_purchase_attributes.${key}.required`]">
														{{errors[`custom_purchase_attributes.${key}.required`][0]}}
													</span>
												</div>


												<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom">
													<label class="uk-flex uk-flex-top grid-gutter uk-padding-remove-bottom click">
														<div class="uk-light tiny-margin-right tiny-margin-top uk-width-auto">
															<input type="checkbox" class="uk-checkbox  uk-border-rounded  bordered square-20" :disabled="loading" v-model="fields[key].match_quantity">
														</div>
														<span class="uk-flex uk-flex-column uk-width-expand text-small tiny-margin-left">
															<span class="uk-text-bold">	Match Units</span>
															<span>
																If checked, will require that you provide a value for every unit when recording a purhase for this unit. Eg(1000 IMEI numbers will be required for a purchase of 1000 devices)
															</span>
														</span>
													</label>
												</div>


												<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom" v-if="fields[key].match_quantity">
													<label class="uk-flex uk-flex-top grid-gutter uk-padding-remove-bottom click">
														<div class="uk-light tiny-margin-right tiny-margin-top uk-width-auto">
															<input type="checkbox" class="uk-checkbox  uk-border-rounded  bordered square-20" :disabled="loading" v-model="fields[key].unique">
														</div>
														<span class="uk-flex uk-flex-column uk-width-expand text-small tiny-margin-left">
															<span class="uk-text-bold">Must be unique</span>
															<span>
																If checked, every entry made for this field for this product will be validated for uniqueness.
															</span>
														</span>
													</label>

													<span class="text-small uk-text-danger"  v-if="errors && errors[`custom_purchase_attributes.${key}.unique`]">
														{{errors[`custom_purchase_attributes.${key}.unique`][0]}}
													</span>
												</div>

											</div>
										</div>
									</div>

								</div>

							</template>
							
						</div>

						<template v-else>
							<div class="uk-padding-small">
								<h4 class="uk-text-center">Add Custom Purchase Attributes</h4>
								<p class="uk-text-center">
									Sometimes you need to record specific information for every unit of a product prurchased. For stores that deal in gadgets and electronic devices for instance it may be crucial to capture serial numbers, IMEI numbers or other important information. This is where you reach out for custom purchase attributes. Click on  "Add Entry" below to start adding custom purhase attrributes to your product now.
								</p>
							</div>
						</template>



						<div class="uk-flex uk-flex-right">
							<div class="chip bordered uk-border-rounded click uk-flex-middle" @click="addEntry">
								<span class="mdi mdi-plus-circle tiny-margin-right"></span>
								<span class="text-small">Add Entry</span>
							</div>
						</div>

					</div>

					<div class="uk-width-1-1 tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-primary" :disabled="loading || !(fields.every(item => {return item.name && item.type})) || fields.length < 1" @click="setupCPF">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>
								{{product.has_custom_purchase_attributes ? 'Update' : 'Add' }} Purchase Attributes
							</template>
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>

	</div>
</template>
<script>
import {bindProps, CPF} from "@/mixins/product/singleton"
export default{
	mixins : [bindProps, CPF],

	methods : {
		async setupCPF(){
			this.loading = true
			await this.$axios.$patch(`/products/${this.product.uuid}`, {custom_purchase_attributes : this.fields})
			.then(()=>{
				this.showModal = false
				this.$emit('done')
				this.$message.success(`Product purchase settings updated.`, 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to update product purchase settings. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		},
	}
};
</script>
