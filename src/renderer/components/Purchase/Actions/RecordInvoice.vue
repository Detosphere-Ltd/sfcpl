<template>
	<div>
		<div class="click" @click="loadModal = true">
			<slot name="action-button">
				<button class="uk-button uk-button-primary uk-button-small">
					Record Purchase
				</button>
			</slot>
		</div>


		<vue-final-modal v-model="loadModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" @before-open="fetchData(); $store.dispatch('variations/getData')">
			<div class="uk-card rounded bordered background raised-deep uk-margin-auto uk-margin-auto-vertical uk-width-1-1 uk-inline  uk-width-1-1 uk-width-medium">
				<div class="uk-padding-small uk-flex uk-flex-column uk-flex-middle">
					<template v-if="loading">
						<loaders-spinner></loaders-spinner>
						<p class="uk-text-center uk-margin-small-top">
							Setting things up... please wait
						</p>
					</template>

					<template v-else>
						<error-parser v-if="failed && errData !== undefined" :errorData="errData">
							<div  slot="further-action" class="uk-flex">
								<button class="uk-button uk-button-small uk-button-danger tiny-margin-right" @click="loadModal = false">
									Close
								</button>
								<button class="uk-button uk-button-small uk-button-primary" @click="fetchData">
									Retry
								</button>
							</div>
						</error-parser>
					</template>
				</div>
			</div>
		</vue-final-modal>



		<vue-final-modal :key="showModal" v-model="showModal" classes="uk-width-1-1" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" attach=".app">
			<div class="uk-width-1-1 uk-margin-small-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-5-6@xl uk-margin-auto " style="max-width:99vw;">
					<div class="uk-width-1-1 uk-inline">
						
						<div class="uk-position-cover background bordered rounded raised-deep uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-position-z-index" v-if="recording">
							<div class="uk-width-large uk-flex uk-flex-column uk-flex-middle">
								<loaders-spinner></loaders-spinner>
								<p class="uk-margin-top uk-text-center">
									{{processStage}}
								</p>
							</div>
						</div>
						
						<div class="uk-flex uk-flex-middle uk-flex-between tiny-padding border-bottom">

							<partials-themer></partials-themer>
							<h5 class="uk-margin-remove uk-text-bold uk-text-truncate">
								Record A New Purchase Invoice
							</h5>



							<div class="uk-width-2xlarge@m uk-margin-auto uk-inline" ref="searchArea" id="searchArea">
								<div class="uk-flex uk-flex-middle uk-flex-between" ref="searchBoxRAea">
									<tips-product-selection class="uk-margin-small-right">
										<template slot="action-button">
											<div class="square-30 tip uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle">
												<span class="mdi mdi-lightbulb uk-text-white"></span>
											</div>
										</template>
									</tips-product-selection>

									<div class="uk-width-expand uk-inline">
										<input type="text" class="uk-input" placeholder="Search & Select Products for Invoice" ref="searchBox" @focus="focusSearchArea = true" v-model="searchTerm" @keydown.enter="searchData">
										<div class="label uk-position-center-right uk-margin-small-right uk-background-danger pill uk-text-white click" v-if="searchTerm" @click="searchTerm = ''; fetchData()">
											<small>Clear</small>
										</div>

										<div  class="uk-width-2xlarge@m uk-position-center-top uk-position-z-index uk-animation-slide-top-small uk-animation-fast" v-show="focusSearchArea">
											<div class="uk-width-1-1@m background bordered uk-border-rounded" ref="optionsArea">
												<div class="uk-width-1-1">
													<div class="grid-padding uk-flex uk-flex-middle uk-flex-between">
														<h6 class="uk-margin-remove uk-text-bold">
															Product Search Results
														</h6>

														<div class="uk-flex uk-flex-middle">
															<span class="mdi mdi-loading uk-text-primary spin tiny-margin-right" v-if="searching"></span>

															<div class="chip uk-border-rounded uk-background-danger click" @click="focusSearchArea = false">
																<small class="uk-text-white">Close</small>
															</div>
														</div>

													</div>


													<div class="modal-content uk-overflow-auto border-top">


														<div v-if="allProducts && allProducts.length > 0">
															<template  v-for="(item, key) in allProducts">
																<div class="uk-flex uk-flex-middle grid-padding click success-on-hover" :key="item.uuid" :class="key < allProducts.length - 1 ? 'border-bottom' : ''" @click="addToList(item)">
																	<div class="uk-width-expand uk-inline">
																		<div class="uk-flex uk-flex-column">

																			<h5 class="uk-margin-remove">
																				{{item.name}}
																			</h5>
																			<span class="text-small">
																				Product Code {{item.code}} &bull; {{item.store_quantity | number('0,0')}} Available in Store &bull; {{item.warehouse_quantity | number('0,0')}} Availbale at Warehouse  
																			</span>

																			<span class="text-small uk-text-warning" v-if="item.has_custom_purchase_attributes">
																				***Custom Purchase Attributes  
																			</span>
																		</div>
																		<div class="label uk-position-center-right uk-margin-small-right uk-background-success-op uk-border-rounded click" v-if="selectedProducts.includes(item.uuid)">
																			<small>Selected</small>
																		</div>
																	</div>
																	<div class="square-25 uk-margin-small-left uk-background-success uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle" >
																		<span class="mdi mdi-plus uk-text-white"></span>
																	</div>
																</div>	
															</template>
														</div>

														<template v-else>
															<div class="uk-flex uk-flex-column uk-flex-middle uk-padding">
																<div class="square-60 uk-background-primary-op uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle">
																	<span class="mdi mdi-package lni-mid-large"></span>
																</div>
																<p class="uk-text-center uk-margin-top">
																	{{searchTerm ? 'No Products found for your search' : 'No products found.'}}
																</p>
																<button class="uk-button uk-button-small uk-button-primary" :disabled="loading" @click="fetchData(); searchTerm = ''" :class="{loading : loading}">
																	{{searchTerm ? 'Load all products' : 'Try again'}}
																</button>
															</div>
														</template>	
													</div>
												</div>


											</div>
										</div>
									</div>

									<button class="uk-button uk-button-small uk-button-primary uk-margin-small-left" :disabled="searching || searchTerm.length < 2" @click="searchData" :class="{loading : searching}">
										Search
									</button>
								</div>


							</div>

							<a class="uk-button uk-button-small uk-button-danger" @click="showModal = false">
								Close
							</a>
						</div>

						<div class="uk-width-1-1 uk-flex uk-height-1-1">
							<div class="uk-width-expand uk-height-1-1">
								<div class="uk-width-1-1 tiny-padding border-bottom">
									<headers-record-new-invoice></headers-record-new-invoice>
								</div>

								<div class="uk-overflow-auto uk-width-1-1" style="min-height: 85vh; max-height: 90vh">
									<div class="uk-width-1-1">

										<div v-if="productSelection && productSelection.length > 0">
											<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-flex-middle grid-padding"  v-for="(product, index) in productSelection" :key="index" :class="index < productSelection.length - 1 ? 'border-bottom' : ''">

												<div class="grid-gutter uk-width-1-1 uk-flex uk-flex-top uk-flex-between uk-margin-small-bottom">
													<div class="uk-flex  uk-flex-column uk-width-expand">
														<div class="uk-flex uk-flex-column">
															<h5 class="uk-margin-remove-top tiny-margin-bottom">
																{{product.name}}
															</h5>
															<small>
																Product Code : {{product.code}}
															</small>
															<span class="text-small uk-text-warning uk-width-1-2" v-if="product.has_custom_purchase_attributes">
																This product has custom purchase attributes and therfore cannot be recorded in an invoice purchase. You should remove it from the list and record a purchase for it directly.
															</span>
														</div>
													</div>

													



												</div>
												<div class="grid-gutter uk-width-expand  uk-margin-small-right">
													<div class="tags-input uk-flex uk-flex-column">

														<a-select size="large" class="uk-width-1-1 text-small uk-text-capitalize"  v-model="product.variation" notFoundContent="No variation found" option-label-prop="name" show-search filter-option option-filter-prop="name">
															<a-select-option disabled value="" :key="`${product.name}-${index}-select-variant`" name="*Select variation" class="uk-text-capitalize">
																*Select variation
															</a-select-option>
															<a-select-option :value="variant.uuid" v-for="variant in $store.getters['variations/activeVariations']" :name="`${variant.name}`" class="uk-text-capitalize" :key="`${product.name}-${index}-${variant.uuid}`">
																{{variant.name}} - {{variant.code}}
															</a-select-option>
														</a-select>

													</div>
												</div>

												<div class="grid-gutter uk-margin-auto-left  uk-margin-small-right">
													<div class="uk-width-small">
														<a-input-number v-model="productSelection[index].quantity" :min="1" :step="1" :formatter="value => `${value} ${$options.filters.pluralize(value,'Unit', {includeNumber : false})}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')" >
															
														</a-input-number>
													</div>
												</div>

												<div class="grid-gutter">
													<div class="uk-width-small">
														<a-tooltip  placement="bottom" trigger="click" :title="`${(productSelection[index].quantity && productSelection[index].cost_price) ? getUnitCostPrice(productSelection[index].cost_price , productSelection[index].quantity) : 'Enter Quantity & Cost Price to get estimated Unit Cost Price'}`" :overlayClassName="`${colorMode} uk-position-z-index`">
															<a-input-number v-model="productSelection[index].cost_price" :step="0.01" :formatter="value => `${emporium.currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')"  @change=" (productSelection[index].quantity && productSelection[index].cost_price) ? calProfitMargin(index) : ''">
															</a-input-number>
														</a-tooltip>
													</div>
												</div>

												

												<div class="grid-gutter">

													<div class="uk-width-x-small">
														<a-input-number v-model="productSelection[index].profit_margin" :min="0" :max="100" :step="1" :formatter="value => `${value}%`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')" @change="calProfitMargin(index)">
														</a-input-number>
													</div>
												</div>

												<div class="grid-gutter">
													<div class="uk-width-small" :class="colorMode">

														<a-tooltip placement="bottom" trigger="click" :title="`This field is required for first time purchases or when there is a price change otherwise the current unit selling price will be used.`" :overlayClassName="`${colorMode} uk-position-z-index`">
															<a-input-number v-model="productSelection[index].unit_selling_price" :step="0.01" :formatter="value => `${emporium.currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')" @change="calUnitSellingPice(index)"></a-input-number>
														</a-tooltip>
													</div>
												</div>

												<div class="grid-gutter">

													<div class="uk-width-small">
														<!-- <input type="date" class="uk-input" :min="$moment().format('YYYY-MM-DD')" :readonly="!product.expires" v-if="product.expires" :disabled="!product.expires"> -->

														<template v-if="product.expires">
															<vc-date-picker  v-model="productSelection[index].expires_at" color="purple" :is-dark="colorMode === 'uk-dark' ? true : false" :min-date="new Date()">
																<template v-slot="{ inputEvents }">
																	<input :value="productSelection[index].expires_at ? $moment(productSelection[index].expires_at).format('DD MMM, YYYY') : ''" class="uk-input" placeholder="Expriy Date" readonly v-on="inputEvents"/>
																</template>
															</vc-date-picker>

														</template>
														<div v-else class="uk-input uk-flex uk-flex-center">
															N/A
														</div>
													</div>
												</div>



												<div class="uk-width-1-1 tiny-margin-top uk-flex" v-if="errors && Object.keys(errors).length > 0">
													<div class="uk-width-1-1 uk-flex uk-flex-middle">

														<div class="grid-gutter uk-padding-remove-top uk-width-expand uk-margin-small-right">
															<div class="uk-width-small">
																<span class="text-small uk-text-danger" v-if="errors && errors[`purchase_items.${index}.variation`]">
																	{{errors[`purchase_items.${index}.variation`][0]}}
																</span>
															</div>
														</div>

														<div class="grid-gutter uk-padding-remove-top uk-margin-auto-left uk-margin-small-right">
															<div class="uk-width-small uk-flex uk-flex-middle">
																<span class="text-small uk-text-danger" v-if="errors && errors[`purchase_items.${index}.quantity`]">
																	{{errors[`purchase_items.${index}.quantity`][0]}}
																</span>
															</div>
														</div>

														<div class="grid-gutter uk-padding-remove-top">
															<div class="uk-width-small">
																<span class="text-small uk-text-danger" v-if="errors && errors[`purchase_items.${index}.cost_price`]">
																	{{errors[`purchase_items.${index}.cost_price`][0]}}
																</span>
															</div>
														</div>

														<div class="grid-gutter uk-padding-remove-top">
															<div class="uk-width-x-small">
															</div>
														</div>

														<div class="grid-gutter uk-padding-remove-top">

															<div class="uk-width-small uk-flex uk-flex-middle">
																<span class="text-small uk-text-danger" v-if="errors && errors[`purchase_items.${index}.unit_type`]">
																	{{errors[`purchase_items.${index}.unit_type`][0]}}
																</span>
															</div>
														</div>

														<div class="grid-gutter uk-padding-remove-top">
															<div class="uk-width-small uk-flex uk-flex-middle">
																<span class="text-small uk-text-danger" v-if="errors && errors[`purchase_items.${index}.expires_at`]">
																	{{errors[`purchase_items.${index}.expires_at`][0]}}
																</span>
																<span class="text-small" v-else-if="product.expires">
																	* Expiry Date Required
																</span>
															</div>
														</div>

													</div>
												</div>

												<div class="uk-width-1-1 uk-flex uk-flex-middle  grid-gutter">

													<span class="underlined click" v-if="product.variation" @click="checkSellingPrice(product.uuid , product.variation , index)">
														Click to see current unit price 
													</span>

													<partials-loader v-if="checking_price && product.variation"></partials-loader>

													<template v-if="product.pricing_info">

														<template v-if="product.variation === product.pricing_info.variation">
															<span v-if="!product.pricing_info.has_variation" class="uk-margin-small-left uk-text-warning">
																You do not currently have the selected variation of this product in your store.
															</span>

															<span  v-else class="uk-margin-left uk-text-bold uk-text-primary">
																(Currently sells at {{product.pricing_info.price | currency(`${emporium.currency} `)}} )
															</span>
														</template>
													</template>

													<div class="uk-margin-auto-left"></div>
													<div class="status uk-flex uk-flex-middle uk-margin-small-right uk-background-primary uk-text-white uk-border-rounded click" @click="duplicateProduct(index, product)"  v-if="duplicatable(product) < $store.getters['variations/activeVariations'].length">
														<span class="mdi mdi-content-copy  tiny-margin-right"></span>
														<small>Duplicate</small>
													</div>

													<div class="status uk-flex uk-flex-middle uk-background-danger uk-border-rounded uk-text-white click" @click="removeFromList(index, product)">
														<span class="mdi mdi-minus-circle-outline  tiny-margin-right"></span>
														<small>Remove</small>
													</div>

												</div>

											</div>			
										</div>

										<div class="uk-padding-large uk-flex uk-flex-column uk-flex-middle" v-else>
											<div class="square-70 uk-background-primary-op uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle">
												<span class="mdi mdi-package lni-mid-large"></span>
											</div>
											<p class="uk-text-center uk-margin-top">
												No Products Selected. <br> Search and select products from the search bar to continue
											</p>
										</div>
									</div>
								</div>
							</div>
							<div class="border-left"></div>

							<!-- ========================== -->

							<!-- =========================== -->

							<div class="uk-width-medium uk-height-1-1">
								<div class="modal-content uk-overflow-auto uk-width-1-1">
									<div class="uk-flex uk-flex-wrap uk-flex-column">

										<div class="tiny-padding border-bottom">
											<p class="uk-margin-remove uk-text-center fz-emphasiz">
												Invoice
											</p>
										</div>
										<div class="uk-flex uk-flex-column uk-width-1-1 uk-margin-small-bottom tiny-padding">
											<span class="tiny-margin-bottom fz-large">Invoice Number (Optional)</span>
											<input type="text" class="uk-input" placeholder="Invoice Number" v-model="invoiceInfo.invoice_no">
											<span class="text-small uk-text-danger" v-if="errors && errors.invoice_no">{{errors.invoice_no[0]}}</span>
										</div>

										<div class="uk-flex uk-flex-column uk-width-1-1 uk-margin-small-bottom tiny-padding">
											<span class="tiny-margin-bottom fz-large">Discount Received (Optional)</span>
											<a-input-number step="0.01" v-model="payment.discount_received" :formatter="value => `${emporium.currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')"></a-input-number>
											<span class="text-small uk-text-danger" v-if="errors && errors.discount_received">{{errors.discount_received[0]}}</span>
										</div>

										<div class="uk-flex uk-flex-column uk-width-1-1 uk-margin-small-bottom tiny-padding">
											<span class="tiny-margin-bottom fz-large">Total Amount Paid</span>
											<a-input-number step="0.01" v-model="payment.amount_paid" :formatter="value => `${emporium.currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/[^0-9\.]+/g, '')" :class="payment.amount_paid > totalCostPrice ? 'has-error' : ''"></a-input-number>

											<span class="text-small uk-text-danger grid-gutter uk-padding-remove-bottom" v-if="payment.amount_paid > totalCostPrice">
												The amount you entered exceeds the expected amount
											</span>

											<div class="grid-padding uk-flex uk-flex-between tiny-margin-bottom" v-if="totalCostPrice > 0">
												<span class="text-small uk-text-success">
													({{ totalCostPrice | currency(`${emporium.currency} `)}} Estimated)
												</span>
												<tips-amount-paid></tips-amount-paid>
											</div>
											
											<span class="text-small uk-text-danger" v-if="errors && errors.amount_paid">{{errors.amount_paid[0]}}</span>
										</div>

										<div class="uk-width-1-1 uk-flex uk-flex-column uk-margin-small-bottom" v-if="totalCostPrice > payment.amount_paid">
											<span class="fz-large uk-margin-small-bottom">
												Due date for additional payment (Optional)
											</span>

											<input type="date" class="uk-input uk-text-small" v-model="due_date"  :min="$moment().format('YYYY-MM-DD')">
											<span v-if="errors && errors.due_date" class="uk-text-small uk-text-danger">{{errors.due_date[0]}}</span>
										</div>

										<template v-if="payment.amount_paid && payment.amount_paid > 0">
											<div class="uk-flex uk-flex-column  uk-width-1-1 tags-input uk-margin-small-bottom tiny-padding uk-padding-remove-top">
												<span class="tiny-margin-bottom text-small">Payment Mode*</span>
												<a-select show-search placeholder="Select Payment Mode" :filter-option="true" optionFilterProp="text"  size="large" :showArrow="true" class="uk-width-1-1" v-model="payment.payment_mode">
													<a-select-option value="" key="select-payment" name="Select Payment Mode" class="uk-text-capitalize">
														Select Payment Mode
													</a-select-option>
													<a-select-option :value="mode.value" v-for="(mode, key) in $store.getters['paymentModes']" :key="mode.value" :text="mode.text">
														<div class="uk-flex uk-flex-column">
															{{mode.text}}  
														</div>
													</a-select-option>
												</a-select>
												<span class="text-small uk-text-danger" v-if="errors && errors.payment_mode">{{errors.payment_mode[0]}}</span>
											</div>

											<div class="uk-flex uk-flex-column uk-width-1-1 uk-margin-small-bottom tiny-padding uk-padding-remove-top">
												<span class="tiny-margin-bottom text-small">Payment Reference (Optional)</span>
												<input type="text" class="uk-input" placeholder="Payment Reference" v-model="payment.refrence_no">
												<span class="text-small uk-text-danger" v-if="errors && errors.refrence_no">{{errors.refrence_no[0]}}</span>
											</div>
										</template>

										<div class="uk-width-1-1 uk-margin-small-bottom tags-input uk-flex uk-flex-column tiny-padding">
											<div class="uk-flex uk-flex-between uk-margin-small-bottom uk-flex-middle">
												<span class="fz-large">
													Select Supplier
												</span>

												
											</div>
											<a-select defaultActiveFirstOption size="large" class="uk-width-1-1 text-small uk-text-capitalize" v-model="invoiceInfo.supplier" notFoundContent="No supplier found." option-label-prop="name" show-search filter-option option-filter-prop="name"  @focus="$store.dispatch('validation/clearErrors')">
												<a-select-option value="" key="select-supplier" name="Select Supplier Purchased From" class="uk-text-capitalize">
													No Supplier
												</a-select-option>
												<a-select-option :value="supplier.uuid" v-for="supplier in  $store.getters['suppliers/activeSuppliers']" :key="supplier.uuid" :name="supplier.name" class="uk-text-capitalize">
													{{supplier.name}}
												</a-select-option>
											</a-select>

											<div class="uk-flex uk-flex-right">
												<supplier-actions-add-new v-if="can('create-suppliers')">
													<template #action-button>
														<span class="click text-small underlined highlight-text">
															Add a New Supplier
														</span>
													</template>
												</supplier-actions-add-new>
											</div>
										</div>

										<div class="uk-flex uk-flex-column uk-width-1-1 uk-margin-small-bottom tiny-padding">
											<span class="tiny-margin-bottom fz-large">
												Upload your invoice receipt as eveidence for later.
											</span>
											<template v-if="invoiceReceiptFile">
												<div class="uk-input uk-flex uk-flex-center uk-background-success uk-text-white">
													<span class="mdi mdi-file uk-margin-small-right"></span>
													<span class="text-small">
														Invoice Attachment Selected
													</span>
												</div>

												<div class="uk-flex uk-margin-auto-right uk-margin-small-top ">
													<div class="chip background bordered click uk-border-rounded uk-margin-small-right" @click.prevent="$refs.invoiceReceipt.click()">
														<small>
															Choose Another File
														</small>
													</div>

													<div class="chip uk-background-danger uk-text-white click uk-border-rounded" @click.prevent="removeFile">
														<small>
															Remove File
														</small>
													</div>

												</div>

											</template>
											<div class="uk-input uk-flex uk-flex-center dashed click" @click.prevent="$refs.invoiceReceipt.click()" v-else>
												<span class="mdi mdi-plus-circle tiny-margin-right"></span>
												<span class="text-small">Click to select file</span>
											</div>
										</div>

										<div class="uk-flex uk-flex-column uk-width-1-1 uk-margin-small-bottom tiny-padding">
											<span class="tiny-margin-bottom text-small">Additional Notes (Optional)</span>
											<textarea  cols="3" rows="3" class="uk-textarea" placeholder="Additional Notes" v-model="invoiceInfo.note"></textarea>
											<span class="text-small uk-text-danger" v-if="errors && errors.note">{{errors.note[0]}}</span>
										</div>


									</div>
								</div>

								<div class="uk-width-1-1 tiny-padding">
									<button class="uk-button uk-button-primary uk-width-1-1 uk-button-large" @click.prevent="recordPurchase" :disabled="selectedProducts.length < 1 || recording || (payment.amount_paid > totalCostPrice)">
										Record Invoice
									</button>
								</div>
							</div>








						</div>
					</div>
				</div>

				<input type="file" hidden ref="invoiceReceipt" accept="application/pdf, image/jpeg, image/png" @change="handleFileSelect">
			</div>
		</vue-final-modal>


		<vue-final-modal v-model="successModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary">
			<div class="uk-card rounded bordered background raised-deep uk-margin-auto uk-margin-auto-vertical uk-width-1-1 uk-inline  uk-width-1-1 uk-width-large">
				<div class="uk-position-cover background bordered rounded raised-deep uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-position-z-index" v-if="recording">
					<div class="uk-width-large uk-flex uk-flex-column uk-flex-middle">
						<loaders-spinner></loaders-spinner>
						<p class="uk-margin-top uk-text-center">
							{{processStage}}
						</p>
					</div>
				</div>
				<div class="modal-content uk-overflow-auto uk-width-1-1">
					<div class="uk-padding uk-flex uk-flex-column uk-flex-middle">

						<div class="square-70 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-bottom">
							<span class="mdi mdi-check lni-extra-large uk-text-white"></span>
						</div>

						<h4 class="uk-text-center">
							Purchase Invoice Recorded.
						</h4>
						<p class="uk-text-center">
							The invoice has been successfully recorded and your warehouse inventory has been updated!
						</p>
						<p class="uk-text-danger uk-text-center" v-if="uploadFail">
							PS: We could not upload the attachment of this invoice at this very moment but do not worry. You can try uploading it again from your "Purchase Invoices" records.
						</p>

						<div class="tiny-padding success-on-hover uk-width-1-1 uk-flex uk-flex-column click"  v-if="can('view-products') && $route.name !== 'inventory'" @click.prevent="resetData(); $router.push({name:'inventory'})">
							<span class="text-small">
								Go to Warehouse
							</span>
							<span>
								See your warehouse stock updated with your latest purchases
							</span>
						</div>

						<div class="tiny-padding border-top success-on-hover uk-width-1-1 uk-flex uk-flex-column click" v-if="can('view-purchases')" @click.prevent="browseInvoices">
							<span class="text-small">
								Browse Invoices
							</span>
							<span>
								See a list of all purchase invoices recorded.
							</span>
						</div>

						<div class="tiny-padding border-top success-on-hover uk-width-1-1 uk-flex uk-flex-column click"  v-if="can('view-purchases')" @click.prevent="reInit">
							<span class="text-small">
								New Invoice
							</span>
							<span>
								Record a new purchase from an Invoice
							</span>
						</div>

						
					</div>
				</div>

				<div class="uk-width-1-1 tiny-padding border-top uk-flex uk-flex-center">
					<button class="uk-button uk-button-small uk-button-danger tiny-margin-right" @click.prevent="completeProcess">
						Close
					</button>
				</div>
			</div>
		</vue-final-modal>

	</div>
</template>
<script>
import catalog from "@/mixins/loaders/invoiceCatalog"
export default {
	mixins : [catalog],
	data(){
		return {
			checking_price : false,
			due_date : '',
			processStage : 'Recording purchase',
			recording : false,
			loadModal : false,
			showModal : false,
			successModal : false,
			focusSearchArea : false,
			uploadFail : false,
			invoiceReceiptFile : undefined,
			productSelection : [],
			payment : {
				discount_received : '',
				amount_paid : '',
				payment_mode : '',
				reference_no : ''
			},

			invoiceInfo:{
				invoice_no : '',
				supplier : '',
				note : ''
			}
		}
	},

	computed : {
		selectedProducts(){
			return [...new Set(this.productSelection.map( item => item.uuid ))] 
		},
		totalCostPrice(){
			let amount = 0
			if (this.productSelection.length < 1) {
				return amount
			}

			this.productSelection.forEach(item => {
				amount += item.cost_price
			})

			return (amount - this.payment.discount_received)


		}
	},

	methods : {
		duplicatable(product){
			let occurance = this.productSelection.filter(item => {return item.product === product.product})
			return occurance.length 
		},
		async duplicateProduct(index, product){
			await this.productSelection.splice(index + 1, 0, {...product, variation : '', quantity : '', unit_selling_price : '', cost_price : '', unit_type: '', expires_at : '', profit_margin : ''})
			this.$message.destroy()
			this.$message.success("Product duplicated", 3)
		},

		async handleSelect(val, key){
			await setTimeout(function() {
				this.productSelection[key].variation = val
			}.bind(this), 10);
		},

		async addToList(item) {
			this.$message.destroy()
			if (!this.selectedProducts.includes(item.uuid)) {
				item.product = item.uuid
				let ext = {variation : '', quantity : '', unit_selling_price : '', cost_price : '', unit_type: '', expires_at : '', profit_margin : ''}
				item = await Object.assign({}, item, ext)
				await this.productSelection.push(item)
				await setTimeout(function() {
					this.focusSearchArea = true
				}.bind(this), 10);
				return
			}

			this.$message.warning("Product already selected", 3)
		},

		async removeFromList(index,product) {
			this.$message.destroy()
			if (this.selectedProducts.includes(product.uuid)) {
				return this.productSelection = await this.productSelection.filter((prod, id) => { return id !== index })
			}

			this.$message.error("Product not selected", 3)
		},

		handleFileSelect(){
			this.invoiceReceiptFile = this.$refs.invoiceReceipt.files.length > 0 ? this.$refs.invoiceReceipt.files[0] : undefined
		},

		removeFile(){
			this.invoiceReceiptFile = undefined
			this.$refs.invoiceReceipt.files = null
		},


		async recordPurchase(){
			let payload = {...this.payment, ...this.invoiceInfo, purchase_items : this.productSelection, due_date : this.due_date}
			this.recording = true
			this.uploadFail = false
			this.processStage = 'Recording purchase invoice'
			await this.$axios.$post(`/purchase-invoices`, payload)
			.then(res => {
				// If purchase invoice file is not seleceted for upload end process abruptly else delegate to upload handler 
				if (!this.invoiceReceiptFile) {
					this.$message.success(`Purchase invoice recorded.`, 4)
					this.showModal = false
					this.successModal = true
					this.recording = false
					return
				}
				this.showModal = false
				this.successModal = true
				this.uploadHandler(res.data.uuid)
			})
			.catch(err=>{
				this.recording = false
				this.$message.error(`Failed to record purchase invoice. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
		},

		async uploadHandler(invoice){
			this.processStage = 'Uploading attachment'
			this.recording = true
			this.uploadFail = false

			let form = new FormData()
			form.append('file', this.invoiceReceiptFile)
			await this.$axios.$post(`/purchase-invoices/${invoice}/media`, form, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(res=>{
				this.$message.success(`attachment uploaded.`)
			})
			.catch(err=>{
				this.uploadFail = true
				this.successModal = true
				this.$message.error(`Failed to upload your attachment. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 6)
			})
			.finally(()=>{
				this.recording = false
				this.successModal = true
			})
		},

		async completeProcess(){
			await this.resetData()
			this.$emit('completed')
		},

		async browseInvoices(){
			await this.resetData()
			await this.$router.push({name: 'inventory-purchases-invoices'})
		},

		async reInit(){
			await this.resetData()
			this.loadModal = true
		},

		async resetData(){
			await this.removeFile()
			this.due_date = ''
			this.processStage = 'Recording purchase'
			this.recording = false
			this.loadModal = false
			this.showModal = false
			this.successModal = false
			this.focusSearchArea = false
			this.uploadFail = false
			this.productSelection = []
			this.payment = {
				discount_received : '',
				amount_paid : '',
				payment_mode : '',
				reference_no : ''
			}
			this.invoiceInfo = {
				invoice_no : '',
				supplier : '',
				note : ''
			}
		},

		getUnitCostPrice(cp , qty){
			let sp = parseInt(cp) / parseInt(qty)
			return `Estimated Unit Cost Price : ${this.emporium.currency} ${ sp ? sp.toFixed(2) : 0}`
		},

		calProfitMargin(index){

			let found = this.productSelection.find((item , i) => {return  i === index})
			if (found) {
				let ucp = Number(found.cost_price) / Number(found.quantity)
				let pMargin = (Number(found.profit_margin) / 100) * ucp
				let usp = Number(ucp) + Number(pMargin)
				found.unit_selling_price = usp ? usp.toFixed(2) : 0
			}
		},

		calUnitSellingPice(index){
			let found = this.productSelection.find((item , i) => {return  i === index})
			if (found) {
				let usp = Number(found.unit_selling_price)
				let ucp = Number(found.cost_price) / Number(found.quantity)
				let profit = usp - ucp
				let pMargin = (profit / ucp) * 100
				console.log(pMargin)
				found.profit_margin =  pMargin ? pMargin.toFixed(2) : 0
			}
		},

		async checkSellingPrice(product, variation , index){
			if (this.checking_price) {
				this.$message.warning('A price check is already being done')
				return
			}
			this.checking_price = true
			await this.$axios.$post(`/products/${product}/check-price`, {variation})
			.then(res => {
				this.$set(this.productSelection[index], 'pricing_info', {...res.data , variation : variation})
			})
			.catch(err => {
				this.$message.error(`${err.response && err.response.data.message !== undefined ? err.response.data.message : 'Failed to get pricing info'}`)
			})
			.finally(()=>{
				this.checking_price = false
			})
		}
	},

	mounted(){
		this.$on('loaded', ()=>{
			this.loadModal = false
			this.showModal = true
		})
	}
}
</script>
