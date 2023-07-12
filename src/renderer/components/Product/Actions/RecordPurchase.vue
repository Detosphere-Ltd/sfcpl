<template>
	<div>
		<div class="uk-width-1-1 click" @click="showModal = true">
			<slot name="action-button">
				Record A Purchase
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="resetData" attach=".content" @before-open="$emit('opening')" @before-close="$emit('closing')">
			<div class="uk-width-1-1 uk-margin-top">

				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-1-1 uk-inline" style="width: 580px" v-if="product.active">

					<div class="uk-position-cover uk-position-z-index" v-if="loading">
						<div class="uk-height-1-1 uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered rounded">
							<loaders-spinner class="uk-margin-bottom"></loaders-spinner>
							<span>Recording purchase...</span>
						</div>
					</div>

					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom uk-width-1-1">
						<h5 class="uk-margin-remove-vertical uk-text-bold uk-width-expand uk-margin-right uk-text-truncate">
							Record A New Purchase
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
							Cancel
						</a>
					</div>

					<div class="uk-flex uk-flex-column tiny-padding border-bottom">
						<h5 class="tiny-margin-bottom">
							{{product.name | capitalize}} 
						</h5>
						<small class="uk-text-uppercase uk-text-bold">
							Product Code : {{product.code}}
						</small>
					</div>

					<div class="uk-padding-small uk-overflow-auto modal-content">
						
						<template v-if="stage === 'one'">
							<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-flex-middle">
								<div class="uk-width-1-1 grid-gutter uk-padding-remove-horizontal uk-flex uk-flex-column tags-input uk-margin-bottom">
									<span class="uk-margin-small-bottom"> 
										<span class="uk-text-warning uk-text-bold"> *Important!</span> 
										Select a product variation for this purchase. Use the default variation if the product has no variation.
									</span>
									<a-select defaultActiveFirstOption size="large" class="uk-width-1-1 text-small uk-text-capitalize" v-model="purchaseForm.variation" notFoundContent="" option-label-prop="name" show-search filter-option option-filter-prop="name">
										<a-select-option disabled value="" key="select-variant" name="Product Variation" class="uk-text-capitalize">
											Product Variation
										</a-select-option>
										<a-select-option :value="variant.uuid" v-for="variant in variations" :key="variant.uuid" :name="`${variant.name} - ${variant.code}`" class="uk-text-capitalize">
											{{variant.name}} - {{variant.code}}
										</a-select-option>
									</a-select>
									<span v-if="errors && errors.variation" class="uk-text-small uk-text-danger">{{errors.variation[0]}}</span>
								</div>
								

								<div class="uk-width-1-2@m grid-gutter uk-padding-remove-left uk-flex uk-flex-column uk-margin-small-bottom">
									<div class="uk-width-1-1 uk-flex uk-flex-row-reverse uk-flex-middle uk-margin-small-bottom">
										<span class="text-small uk-width-expand">
											Sellable Quantity
										</span>

										<tips-purchase-quantity class="tiny-margin-right"></tips-purchase-quantity>
									</div>
									<a-input-number size="default"  v-model="purchaseForm.quantity" @focus="$store.dispatch('validation/clearErrors')" class="input-number" :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/\D/g, '')">
									</a-input-number>

								</div>


								<div class="grid-gutter uk-padding-remove-right uk-flex uk-flex-column  uk-width-1-2@m tags-input uk-margin-small-bottom">
									<div class="uk-width-1-1 uk-flex uk-flex-middle uk-margin-small-bottom">
										<span class="text-small uk-width-expand">
											Purchase Unit (Optional)
										</span>

										<tips-purchase-unit class="tiny-margin-left"></tips-purchase-unit>
									</div>
									<a-select  show-search placeholder="Select Purchase Unit" :filter-option="true" optionFilterProp="text"  size="large" :showArrow="true" class="uk-width-1-1" v-model="purchaseForm.unit_type">
										<a-select-option  disabled value="" key="select-payment" name="Select Purchase Unit" class="uk-text-capitalize">
											Purchase Unit
										</a-select-option>
										<a-select-option :value="unit.uuid" v-for="(unit, key) in $store.getters['units/activeUnits']" :key="unit.uunit" :text="unit.name">
											{{unit.name}}  
										</a-select-option>
									</a-select>
								</div>

								<div class="uk-width-1-1 grid-gutter uk-padding-remove-left uk-flex uk-flex-column uk-margin-small-bottom">
									<span class="text-small uk-margin-small-bottom">
										Purchase Cost Price
									</span>


									<a-input-number size="large"  v-model="purchaseForm.cost_price" @focus="$store.dispatch('validation/clearErrors')" class="input-number" :formatter="value => `${emporium.currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')" :step="0.01">
									</a-input-number>

									<span v-if="errors && errors.cost_price" class="uk-text-small uk-text-danger">{{errors.cost_price[0]}}</span>
								</div>

								<div class="uk-width-1-2@m grid-gutter uk-padding-remove-left uk-flex uk-flex-column">
									<span class="text-small uk-margin-small-bottom">
										Unit Selling Price
									</span>

									<a-input-number size="large"  v-model="purchaseForm.unit_selling_price" @focus="$store.dispatch('validation/clearErrors')" class="input-number" :formatter="value => `${emporium.currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')" :step="0.01">
									</a-input-number>
									<span v-if="errors && errors.unit_selling_price" class="uk-text-small uk-text-danger">{{errors.unit_selling_price[0]}}</span>
								</div>



								<div class="uk-width-1-2@m grid-gutter uk-padding-remove-right uk-flex uk-flex-column">
									<span class="text-small uk-margin-small-bottom">
										Discount Received (Optional)
									</span>

									<a-input-number size="large"  v-model="purchaseForm.discount_received" @focus="$store.dispatch('validation/clearErrors')" class="input-number" :formatter="value => `${emporium.currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')" :step="0.01">
									</a-input-number>
									<span v-if="errors && errors.discount_received" class="uk-text-small uk-text-danger">{{errors.discount_received[0]}}</span>
								</div>

								<div class="uk-width-1-1 tiny-padding uk-padding-remove-horizontal" v-if="purchaseForm.quantity && purchaseForm.unit_selling_price && purchaseForm.cost_price && (purchaseForm.cost_price - purchaseForm.discount_received) > (purchaseForm.quantity * purchaseForm.unit_selling_price)">
									<span class="uk-text-warning">
										<span class="uk-text-bold uk-text-warning">Friendly Warning!</span> <br> You risk  incurring a loss of 
										{{ (purchaseForm.cost_price - purchaseForm.discount_received) - (purchaseForm.quantity * purchaseForm.unit_selling_price)  | currency(`${emporium.currency}`) }} 
										on this purchase.
									</span>
								</div>


								<div class="uk-width-1-1 grid-gutter uk-padding-remove-horizontal uk-flex uk-flex-column uk-margin-small-top" v-if="product.expires">
									<span class="text-small uk-margin-small-bottom">
										Purchase Expiry Date
									</span>

									<input type="date" class="uk-input uk-form-large uk-text-small" v-model="purchaseForm.expires_at"  :min="$moment().format('YYYY-MM-DD')">

									<span v-if="errors && errors.expires_at" class="uk-text-small uk-text-danger">{{errors.expires_at[0]}}</span>
								</div>

								<template v-if="can('record-purchase-payment')">

									<div class="uk-width-1-1 uk-flex uk-margin-small-top">
										<div class="grid-gutter uk-padding-remove-horizontal uk-flex uk-flex-column uk-margin-small-bottom" :class="purchaseForm.cost_price > (purchaseForm.amount_paid + purchaseForm.discount_received) ? 'uk-width-expand uk-margin-small-right' : 'uk-width-1-1'">
											<div class="uk-flex uk-margin-small-bottom uk-flex-between">
												<span class="text-small">
													Amount Paid
												</span>
											</div>

											<a-input-number size="large"  v-model="purchaseForm.amount_paid" @focus="$store.dispatch('validation/clearErrors')" class="input-number" :formatter="value => `${emporium.currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')" :step="0.01" :max="parseFloat(purchaseForm.cost_price)">
											</a-input-number>
										</div>

										<div class="uk-width-1-2 grid-gutter uk-padding-remove-horizontal uk-flex uk-flex-column" v-if="purchaseForm.cost_price > (purchaseForm.amount_paid + purchaseForm.discount_received)">
											<span class="text-small uk-margin-small-bottom">
												Payment Due Date (Optional)
											</span>

											<input type="date" class="uk-input uk-form-large uk-text-small" v-model="purchaseForm.due_date"  :min="$moment().format('YYYY-MM-DD')">

											<span v-if="errors && errors.due_date" class="uk-text-small uk-text-danger">{{errors.due_date[0]}}</span>
										</div>
									</div>


									<template v-if="purchaseForm.amount_paid && purchaseForm.amount_paid > 0">
										<div class="grid-gutter uk-padding-remove-horizontal uk-flex uk-flex-column  uk-width-1-2@m tags-input uk-margin-small-bottom">
											<span class="uk-margin-small-bottom text-small tiny-margin-left">Payment Mode</span>
											<a-select show-search placeholder="Select Payment Mode" :filter-option="true" optionFilterProp="text"  size="large" :showArrow="true" class="uk-width-1-1" v-model="purchaseForm.payment_mode">
												<a-select-option disabled value="" key="select-payment" name="Select Payment Mode" class="uk-text-capitalize">
													Select Payment Mode
												</a-select-option>
												<a-select-option :value="mode.value" v-for="(mode, key) in $store.getters['paymentModes']" :key="mode.value" v-if="mode.value !== 'credit'" :text="mode.text">
													<div class="uk-flex uk-flex-column">
														{{mode.text}}  
													</div>
												</a-select-option>
											</a-select>
											<span class="text-small uk-text-danger" v-if="errors && errors.payment_mode">{{errors.payment_mode[0]}}</span>
										</div>

										<div class="grid-gutter uk-padding-remove-right uk-flex uk-flex-column uk-width-1-2@m uk-margin-small-bottom" v-if="purchaseForm.payment_mode !== 'credit'">
											<span class="uk-margin-small-bottom text-small tiny-margin-left">Reference</span>
											<input type="text" class="uk-input" placeholder="Reference Number (Optional)" v-model="purchaseForm.reference_no">
											<span class="text-small uk-text-danger" v-if="errors && errors.refrence_no">{{errors.refrence_no[0]}}</span>
										</div>
									</template>

								</template>

								

								<div class="uk-width-1-1 grid-gutter uk-padding-remove-horizontal tags-input uk-flex uk-flex-column uk-margin-small-top">
									<div class="uk-flex uk-flex-between uk-margin-small-bottom uk-flex-middle">
										<span class="text-small">
											Select Supplier
										</span>

										<supplier-actions-add-new v-if="can('create-suppliers')">
											<template #action-button>
												<span class="click text-small underlined highlight-text">
													Add a New Supplier
												</span>
											</template>
										</supplier-actions-add-new>
									</div>
									<a-select defaultActiveFirstOption size="large" class="uk-width-1-1 text-small uk-text-capitalize" v-model="purchaseForm.supplier" notFoundContent="No supplier found." option-label-prop="name" show-search filter-option option-filter-prop="name"  @focus="$store.dispatch('validation/clearErrors')">
										<a-select-option value="" key="select-supplier" name="Select Supplier Purchased From" class="uk-text-capitalize">
											No Supplier
										</a-select-option>
										<a-select-option :value="supplier.uuid" v-for="supplier in suppliers" :key="supplier.uuid" :name="supplier.name" class="uk-text-capitalize">
											{{supplier.name}}
										</a-select-option>
									</a-select>
								</div>





							</div>
						</template>

						<template v-else>
							<div>


								<template  v-for="(attribute, key) in fields">
									<div class="uk-margin-bottom uk-flex uk-flex-column" :key="key">
										<div class="uk-width-1-1 uk-flex uk-margin-small-bottom">
											<!-- Headings -->
											<div class="uk-width-expand">
												<span class="uk-text-capitalize">
													{{attribute.name}}
												</span>

												<div>
													<template v-if="!attribute.match_quantity">
														<span class="text-small uk-margin-small-bottom">
															Rules : {{attribute.type === 'number' ? 'Numeric Value' : 'Text Value'}} Expected


															&bull; {{attribute.required ? 'This value is Required' : 'This value is Optional'}}

															<template v-if="attribute.unique">
																&bull; Must be Unique
															</template>
														</span>

													</template>

													<template v-else>
														<span class="text-small">
															Rules : 
															{{attribute.type === 'number' ? 'Numeric Value' : 'Text Value'}} Expected

															&bull; {{ purchaseForm.quantity ? purchaseForm.quantity : 0 | number('0,0') }}

															{{ attribute.unique ? 'Unique' :''}}

															{{ purchaseForm.quantity ? purchaseForm.quantity : 0 | pluralize(['Entry', 'Entries']) }} 

															{{attribute.required ? 'Required' : 'Expected (optional)'}}
														</span>
													</template>
												</div>
											</div>

											<div class="square-30 uk-border-rounded uk-button-view click uk-flex uk-flex-column uk-flex-center uk-flex-middle" v-if="attribute.match_quantity" @click="visibleIndex === key ? visibleIndex = undefined : visibleIndex = key">
												<span class="mdi uk-text-large" :class="key === visibleIndex ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
											</div>

										</div>

										<hr class="uk-margin-remove-top tiny-margin-bottom" v-if="attribute.match_quantity">


										

										<template v-if="!attribute.match_quantity">

											<template v-if="attribute.type === 'text'" >
												<input @focus="$store.dispatch('validation/clearErrors')" v-model="attribute.value" :placeholder="attribute.name" type="text" class="uk-input uk-form-large">
											</template>

											<template v-else>
												<a-input-number @focus="$store.dispatch('validation/clearErrors')" size="large" v-model="attribute.value" :placeholder="attribute.name"></a-input-number>
											</template>

											
										</template>

										<template v-else>
											<div class="uk-flex uk-flex-column uk-margin-small-top" v-show="key === visibleIndex">
												<div class="uk-margin-small-bottom uk-flex uk-flex-top" v-for="(entry, entryIndex) in purchaseForm.quantity">
													<div class="chip uk-width-auto uk-margin-small-right uk-button-view uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle">
														<span>#{{entryIndex+1}}</span>
													</div>
													
													<div class="uk-width-expand">
														<template v-if="attribute.type === 'text'" >
															<input @focus="$store.dispatch('validation/clearErrors')" :placeholder="`Enter ${attribute.name} for Entry #${entryIndex+1}`" type="text" class="uk-input uk-form-large" v-model="attribute.value[entryIndex]">
														</template>

														<template v-else>
															<a-input-number @focus="$store.dispatch('validation/clearErrors')" size="large" :placeholder="`Enter ${attribute.name} for Entry #${entryIndex+1}`" v-model="attribute.value[entryIndex]"></a-input-number>
														</template>
														<span class="text-small uk-text-danger" v-if="errors && errors[`custom_attributes.${attribute.key}.${entryIndex}`]">
															{{ errors[`custom_attributes.${attribute.key}.${entryIndex}`][0] }}
														</span>
													</div>
												</div>			
											</div>
										</template>
										<span class="text-small uk-text-danger" v-if="errors && errors[`custom_attributes.${attribute.key}`]">
											{{ errors[`custom_attributes.${attribute.key}`][0] }}
										</span>
									</div>
								</template>
							</div>
						</template>
					</div>


					<div class="uk-width-1-1 tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-view uk-margin-small-right" :disabled="loading || disableCreation" v-if="product.has_custom_purchase_attributes" @click="stage === 'one' ? stage = 'two' : stage = 'one' ">
							{{stage === 'one' ? 'Next' : 'Back'}}
						</button>
						<button class="uk-button uk-button-primary" @click="recordPurchase(false)" :disabled="disableCreation || loading">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>Record Purchase</template>
						</button>
					</div>
				</div>
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium" v-else>
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom uk-width-1-1">
						<h5 class="uk-margin-remove-vertical uk-text-bold uk-width-expand uk-margin-right">
							New Purchase
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
							Close
						</a>
					</div>

					<div class="tiny-padding uk-flex uk-flex-column uk-flex-middle">
						<h5 class="uk-text-center">Sorry</h5>
						<p class="uk-text-center">
							You cannot record purchases for a product you have deactivated. Activate the product to continue
						</p>
					</div>
				</div>
			</div>
		</vue-final-modal>

		<vue-final-modal v-model="supplierPrompt" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" attach=".app">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large">
					<div class="uk-padding-small uk-flex uk-flex-column uk-flex-middle modal-content uk-overflow-auto">
						<div class="square-60 uk-border-circle uk-background-danger uk-margin-small-bottom uk-flex uk-flex-middle uk-flex-center uk-flex-middle">
							<span class="mdi mdi-allergy uk-text-white lni-large"></span>
						</div>
						<h4 class="uk-text-center uk-text-bold">
							Pardon the Interuption.
						</h4>
						<p class="uk-text-center">
							It appears you are about to record a credit purchase without selecting a supplier. This means you will not be able to know which supplier to pay back to when the need arises. If this is not the case kindly fill the "Amount Paid" field ans select a Payment Mode to continue.
						</p>
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-view tiny-margin-right" @click="supplierPrompt = false" :disabled="loading">
							Back
						</button>
						<button class="uk-button uk-button-primary" @click="supplierPrompt = false; recordPurchase(true)" :disabled="disableCreation || loading || (purchaseForm.amount_paid > 0 && !purchaseForm.payment_mode)">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>Ignore and Proceed</template>
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {mapGetters} from "vuex"
import {bindProps, purchase} from "@/mixins/product/singleton"
export default{
	mixins : [bindProps, purchase],
	data(){
		return {
			showModal : false,
			loading : false,
			stage : 'one',
			visibleIndex : 0
		}
	},

	computed : {
		...mapGetters({
			variations  : 'variations/variations',
			suppliers  : 'suppliers/activeSuppliers',
		})
	},
};
</script>