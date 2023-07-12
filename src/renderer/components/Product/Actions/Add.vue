<template>
	<div>
		<div @click="showModal = true">
			<slot name="action-button">
				<button class="uk-button uk-button-primary uk-button-small">
					<span class="tiny-margin-right mdi mdi-plus-circle uk-text-white"></span>
					New Product
				</button>
			</slot>
		</div>


		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="resetData(); step = 1">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-xlarge@s uk-inline">
					<div class="uk-position-cover uk-position-z-index" v-if="loading">
						<div class="uk-height-1-1 uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered rounded">
							<loaders-spinner class="uk-margin-bottom"></loaders-spinner>
							<span>Creating your product...</span>
						</div>
					</div>

					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Create A New Product
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
							Close
						</a>
					</div>
					<div class="tiny-padding uk-overflow-auto modal-content">
						<template v-if="step === 1">
							
							<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-flex-bottom">
								<div class="uk-width-1-1 grid-gutter uk-flex uk-flex-column uk-margin-small-bottom">
									<span class="text-small uk-margin-small-bottom uk-text-bold">
										Product Name
									</span>
									<input type="text" class="uk-input uk-form-large" placeholder="Product Name" v-model="productForm.name" @focus="cleanup">
									<span v-if="errors && errors.name" class="uk-text-small uk-text-danger">{{errors.name[0]}}</span>
								</div>

								<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom">
									<div class="uk-flex uk-flex-top  tiny-margin-bottom">
										<div class="uk-width-expand">
											<span class="text-small tiny-margin-bottom">
												Product Code - Must be Unique. <span class="uk-text-danger">Cannot be modified after creation</span>
											</span>
										</div>

										<tips-product-code class="tiny-margin-left"></tips-product-code>
									</div>
									<input type="text" class="uk-input uk-form-large" placeholder="Code" v-model="productForm.code" @focus="cleanup">
									<span v-if="errors && errors.code" class="uk-text-small uk-text-danger">{{errors.code[0]}}</span>
								</div>

								<div class="uk-width-1-1 grid-gutter uk-flex uk-flex-column uk-margin-small-bottom">
									<span class="text-small uk-margin-small-bottom uk-text-bold">
										Describe this product
									</span>
									<textarea  rows="3" class="uk-textarea" placeholder="Product description" v-model="productForm.description" @focus="cleanup"></textarea>
								</div>

								<div class="uk-width-1-1 grid-gutter  uk-flex uk-flex-column uk-margin-small-bottom">
									<span class="text-small uk-margin-small-bottom uk-text-bold">
										Select Tags (Categories) for this product
									</span>
									<div class="uk-flex uk-flex-column uk-width-1-1 tags-input background">
										<a-select mode="tags" class="uk-width-1-1 uk-text-small" size="large" notFoundContent="" option-label-prop="name" :tokenSeparators="[',']" placeholder="Select tags related to this product"
										v-model="tags" @focus="cleanup">
										<a-select-option v-for="singleton in availableTags" :key="singleton.name" :value="singleton.name" :name="singleton.name">
											<span class="text-small uk-text-capitalize">
												{{singleton.name}}
											</span>
										</a-select-option>
									</a-select>
									<span v-if="errors && errors.tags" class="uk-text-small uk-text-danger">{{errors.tags[0]}}</span>
								</div>
							</div>
						</div>

						<div class="grid-gutter uk-flex uk-flex-column" v-if="$store.getters['levies/product_levies'] && $store.getters['levies/product_levies'].length > 0">
							<span class="text-small uk-margin-small-bottom uk-text-bold">
								Select Applicable Product Specific Levies (Taxes)
							</span>

							<div class="uk-width-1-1 uk-flex uk-flex-column stripped-bottom bordered rounded">
								<div class="uk-width-1-1 uk-flex" v-for="levy in $store.getters['levies/product_levies']" :key="levy.uuid">
									<div class="uk-light uk-width-auto center uk-margin-small-right border-right tiny-padding">
										<input type="checkbox" class="uk-checkbox square-20 bordered rounded" :value="levy.uuid" v-model="levies">
									</div>
									<div class="uk-width-expand tiny-padding center">
										<div class="uk-width-1-1 uk-flex uk-flex-column">
											<p class="uk-margin-remove">
												{{levy.name}}
											</p>
										</div>
									</div>

									<div class="uk-width-x-small border-left tiny-padding center">
										<span>
											{{levy.percent / 100 | percent}}
										</span>
									</div>

								</div>
							</div>
						</div>



						<div class="grid-gutter">
							<div class="uk-width-1-1 tiny-padding bordered rounded">
								<div class="uk-flex uk-flex-middle uk-flex-between grid-padding uk-padding-remove-horizontal">

									<label class="uk-flex uk-flex-top grid-gutter uk-padding-remove-bottom click">
										<div class="uk-light uk-margin-small-right tiny-margin-top uk-width-auto">
											<input type="checkbox" class="uk-checkbox  uk-border-rounded  bordered square-20" v-model="productForm.expires" :disabled="loading">
										</div>
										<span class="uk-flex uk-flex-column uk-width-expand text-small">
											<span class="uk-text-bold">This product expires</span>
											<span>
												If selected, you'll be required to set an expiry date for every purchase you make for this product. 
											</span>
										</span>
									</label>
								</div>
							</div>
						</div>


						<template v-if="can('record-purchases')">
							<div class="grid-gutter">
								<div class="uk-width-1-1 tiny-padding bordered rounded">
									<div class="uk-flex uk-flex-middle uk-flex-between ">

										<label class="uk-flex uk-flex-top grid-gutter uk-padding-remove-bottom  click">
											<div class="uk-light  uk-margin-small-right tiny-margin-top uk-width-auto">
												<input type="checkbox" class="uk-checkbox uk-border-rounded  bordered square-20" v-model="first_purchase" :disabled="loading">
											</div>
											<span class="uk-flex uk-flex-column uk-width-expand text-small">
												<span>Also record your first purchase for this product. <b>(Optional)</b></span>
												<span>
													This only applies to the default variation of this product in your store. To take stock for specific variations of this product, skip this step.
												</span>
											</span>
										</label>
									</div>
								</div>
							</div>
						</template>



					</template>

					<template v-else>
						<div class="uk-width-1-1 uk-flex uk-flex-wrap">
							<div class="uk-width-1-1 grid-gutter uk-flex uk-flex-column tags-input uk-margin-bottom">
								<span class="tiny-margin-bottom"> <span class="uk-text-warning uk-text-bold">*Important! </span>Default variation will be used if left blank</span>


								<a-select defaultActiveFirstOption size="large" class="uk-width-1-1 text-small uk-text-capitalize" v-model="purchaseForm.variation" notFoundContent="Variation not found" option-label-prop="name" show-search filter-option option-filter-prop="name"  @focus="cleanup">
									<a-select-option disabled value="" key="select-variant" name="Product Variation" class="uk-text-capitalize">
										Product Variation
									</a-select-option>
									<a-select-option :value="variant.uuid" v-for="variant in variations" :key="variant.uuid" :name="`${variant.name} - ${variant.code}`" class="uk-text-capitalize">
										{{variant.name}} - {{variant.code}}
									</a-select-option>
								</a-select>


								<span v-if="errors && errors.variation" class="uk-text-small uk-text-danger">{{errors.variation[0]}}</span>
							</div>

							<div class="uk-width-1-2@m grid-gutter uk-flex uk-flex-column uk-margin-small-bottom">
								<div class="uk-width-1-1 uk-flex uk-flex-row-reverse uk-flex-middle uk-margin-small-bottom">
									<span class="text-small uk-width-expand">
										Sellable Quantity
									</span>

									<tips-purchase-quantity class="tiny-margin-right"></tips-purchase-quantity>
								</div>
								<a-input-number size="default"  v-model="purchaseForm.quantity" @focus="cleanup" class="input-number" :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/\D/g, '')">
								</a-input-number>

							</div>


							<div class="grid-gutter uk-flex uk-flex-column  uk-width-1-2@m tags-input uk-margin-small-bottom">
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

							<div class="uk-width-1-1 grid-gutter uk-flex uk-flex-column" v-if="productForm.expires">
								<span class="text-small tiny-margin-bottom">
									Purchase Expiry Date
								</span>

								<input type="date" class="uk-input uk-form-large uk-text-small" v-model="purchaseForm.expires_at"  :min="$moment().format('YYYY-MM-DD')">

								<span v-if="errors && errors.expires_at" class="uk-text-small uk-text-danger">{{errors.expires_at[0]}}</span>
							</div>

							<div class="uk-width-1-1 grid-gutter uk-flex uk-flex-column uk-margin-small-bottom">
								<span class="text-small tiny-margin-bottom">
									Total Purchase Cost Price
								</span>


								<a-input-number size="large"  v-model="purchaseForm.cost_price" @focus="cleanup" class="input-number" :formatter="value => `${emporium.currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')" :step="0.01">
								</a-input-number>


							</div>




							<div class="uk-width-1-2@m grid-gutter uk-flex uk-flex-column">
								<span class="text-small tiny-margin-bottom">
									*Unit Selling Price
								</span>

								<a-input-number size="large"  v-model="purchaseForm.unit_selling_price" @focus="cleanup" class="input-number" :formatter="value => `${emporium.currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')" :step="0.01">
								</a-input-number>

							</div>



							<div class="uk-width-1-2@m grid-gutter uk-flex uk-flex-column">
								<span class="text-small tiny-margin-bottom">
									Discount Received (If any)
								</span>

								<a-input-number size="large"  v-model="purchaseForm.discount_received" @focus="cleanup" class="input-number" :formatter="value => `${emporium.currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')" :step="0.01">
								</a-input-number>
							</div>

							<template v-if="can('record-purchase-payment')">

								<div class="uk-width-1-1 grid-gutter uk-flex uk-flex-column uk-margin-small-bottom uk-margin-small-top" >
									<div class="uk-flex tiny-margin-bottom uk-flex-between">
										<span class="text-small tiny-margin-bottom">
											Amount Paid
										</span>
									</div>

									<a-input-number size="large"  v-model="purchaseForm.amount_paid" @focus="cleanup" class="input-number" :formatter="value => `${emporium.currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')" :step="0.01">
									</a-input-number>
								</div>

								<template v-if="purchaseForm.amount_paid && purchaseForm.amount_paid > 0">
									<div class="grid-gutter uk-flex uk-flex-column  uk-width-1-2@m tags-input uk-margin-small-bottom">
										<span class="tiny-margin-bottom text-small tiny-margin-left">Payment Mode</span>
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

									<div class="grid-gutter uk-flex uk-flex-column uk-width-1-2@m uk-margin-small-bottom" v-if="purchaseForm.payment_mode !== 'credit'">
										<span class="tiny-margin-bottom text-small tiny-margin-left">Reference</span>
										<input type="text" class="uk-input" placeholder="Reference Number (Optional)" v-model="purchaseForm.reference_no">
										<span class="text-small uk-text-danger" v-if="errors && errors.reference_no">{{errors.reference_no[0]}}</span>
									</div>
								</template>

							</template>


							<div class="uk-width-1-1 grid-gutter tags-input uk-flex uk-flex-column uk-margin-small-top">
								<span class="text-small tiny-margin-bottom">
									Select Supplier
								</span>
								<a-select defaultActiveFirstOption size="large" class="uk-width-1-1 text-small uk-text-capitalize" v-model="purchaseForm.supplier" notFoundContent="No supplier found." option-label-prop="name" show-search filter-option option-filter-prop="name"  @focus="cleanup">
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
				</div>
				<div class="uk-width-1-1 tiny-padding border-top uk-flex uk-flex-center">
					<button class="uk-button uk-button-view tiny-margin-right" v-if="step === 2" @click="step = 1" :disabled="loading">
						Back
					</button>
					<button class="uk-button uk-button-primary tiny-margin-right" v-if="first_purchase && step === 1" @click="step = 2" :disabled="!productForm.name || loading">
						Next
					</button>
					<button class="uk-button uk-button-primary" @click="createProduct" :disabled="!productForm.name || loading" v-if="!first_purchase">
						<partials-loader v-if="loading"></partials-loader>
						<template v-else>Create Product</template>
					</button>
					<button class="uk-button uk-button-primary" @click="createProduct(false)" :disabled="!productForm.name || disableCreation || loading || (purchaseForm.amount_paid > 0 && !purchaseForm.payment_mode)" v-if="first_purchase && step === 2">
						<partials-loader v-if="loading"></partials-loader>
						<template v-else>Create Product with Purchase</template>
					</button>


				</div>
			</div>
		</div>
	</vue-final-modal>

	<vue-final-modal v-model="supplierPrompt" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" attach=".app">
		<div class="uk-width-1-1 uk-margin-large-top">
			<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large">
				<div class="uk-padding-small uk-flex uk-flex-column uk-flex-middle modal-content uk-overflow-auto">
					<div class="square-60 uk-border-circle uk-background-danger uk-margin-small-bottom uk-flex uk-flex-middle uk-flex-center uk-flex-middle">
						<span class="mdi mdi-alert uk-text-white lni-large"></span>
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
					<button class="uk-button uk-button-primary" @click="supplierPrompt = false; createProduct(true)" :disabled="!productForm.name || disableCreation || loading || (purchaseForm.amount_paid > 0 && !purchaseForm.payment_mode)">
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
import {create} from "@/mixins/product/singleton"
export default{
	mixins : [create],
	data(){
		return {
			step : 1
		}
	}
};
</script>
