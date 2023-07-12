<template>
	<div>
		<div class="uk-width-auto click" @click="loadModal = true">
			<slot name="action-button">
				<button class="uk-button uk-button-primary">
					View Report Details
				</button>
			</slot>
		</div>


		<vue-final-modal v-model="loadModal" classes="uk-width-1-1" :esc-to-close="false" overlay-class="uk-overlay-primary" content-classes="uk-flex uk-flex-column" attach=".app" @before-open="getFinancialYearDetails()">
			<div class="uk-width-1-1 uk-flex">
				<div class="uk-width-1-1 uk-width-medium uk-margin-medium-top rounded raised uk-margin-auto background bordered uk-animation-scale-up uk-animation-fast uk-inline">
					<div class="background bordered rounded uk-padding uk-flex uk-flex-column uk-flex-center uk-flex-middle" v-if="loading">
						<loaders-spinner></loaders-spinner>
						<p class="uk-text-center uk-margin-top">
							Loading report details...
						</p>
					</div>
					<template v-else>
						<error-parser :errorData="errData" v-if="failed && errData !== undefined" class="uk-padding">
							<template slot="further-action">
								<div class="tiny-padding uk-flex uk-flex-center">
									<button class="uk-button uk-button-danger uk-margin-small-right" @click="loadModal = false">
										Cancel
									</button>
									<button @click="getFinancialYearDetails()" class="uk-button uk-button-primary uk-button-small">
										Retry
									</button>
								</div>
							</template>
						</error-parser>
					</template>

				</div>
			</div>
		</vue-final-modal>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1" :esc-to-close="false" overlay-class="uk-overlay-primary" attach=".app" v-if="Object.keys(period).length > 0">
			<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle">
				<div class="uk-width-1-1 uk-width-1-1  background uk-animation-scale-up uk-animation-fast">

					<div class="tiny-padding border-bottom uk-flex uk-flex-middle uk-flex-between">
						<div class="uk-flex uk-flex-column uk-flex-middle uk-margin-auto">
							<h5 class="uk-margin-remove-vertical uk-text-center">
								Period Report <br> {{$moment(period.started_at).format('DD MMMM, YYYY')}} - {{$moment(period.ended_at).format('DD MMMM, YYYY')}}
							</h5>

						</div>

						<button class="uk-button uk-button-danger uk-button-small" @click="showModal = false">
							Close
						</button>
					</div>
					<div class="uk-width-1-1">
						<div class="uk-width-1-1 uk-flex uk-flex-wrap ">
							<div class="uk-width-expand tiny-padding modal-content-full uk-overflow-auto">
								<div class="uk-container uk-container-expand">

									<div class="tiny-padding uk-width-1-1 uk-flex uk-flex-wrap uk-grid-match">
										<div class="uk-width-1-3 tiny-padding uk-padding-remove-left uk-margin-auto-vertical uk-margin-remove-top">
											<div class="tiny-padding bordered">
												<h4>
													Opening Balance
												</h4>


												<section>
													<div>
														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Opening Stock
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{period.store_opening_stock | number('0,0') | pluralize('Unit')}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Cost Of Opening Stock
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{period.cost_of_store_opening_stock | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Opening Debt
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold" :class="period.opening_debt > 0 ? 'uk-text-danger' : ''">
																	{{period.opening_debt | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Opening Credit
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold" :class="period.opening_credit > 0 ? 'uk-text-success' : ''">
																	{{period.opening_credit | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>
													</div>



													<div class="tiny-padding uk-padding-remove-horizontal uk-flex uk-flex-column">
														<span class="uk-text-uppercase uk-text-bold uk-margin-small-top tiny-margin-bottom">
															Warehouse
														</span>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Warehouse Opening Stock
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break text-small">
																	{{period.warehouse_opening_stock | number('0,0') | pluralize('Unit')}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Cost Of Warehouse Opening Stock
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break text-small">
																	{{period.cost_of_warehouse_opening_stock | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>
													</div>


													<div class="tiny-padding uk-padding-remove-horizontal uk-flex uk-flex-column">
														<span class="uk-text-uppercase uk-text-bold uk-margin-small-top tiny-margin-bottom">
															Branches
														</span>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Branches Opening Stock
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break text-small">
																	{{period.branch_opening_stock | number('0,0') | pluralize('Unit')}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Cost Of Branches Opening Stock
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break text-small">
																	{{period.cost_of_branch_opening_stock | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>
													</div>
												</section>
											</div>
											<div class="border-top uk-hidden@xl"></div>
											<div class="border-top uk-hidden@xl"></div>
											<div class="tiny-padding bordered uk-flex uk-flex-column uk-hidden@xl">
												<h4>
													Transfers
												</h4>

												<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
													<div class="uk-width-1-1">
														<span class="uk-text-capitalize uk-text-break text-small">
															Transfers To Branches
														</span>
													</div>

													<div class="uk-width-auto">
														<span class="uk-text-capitalize uk-text-break uk-text-bold">
															{{period.quantity_transferred_to_branches | number('0,0') | pluralize('Unit')}}
														</span>
													</div>
												</div>

												<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
													<div class="uk-width-1-1">
														<span class="uk-text-capitalize uk-text-break text-small">
															Cost Of Transfers To Branches
														</span>
													</div>

													<div class="uk-width-auto">
														<span class="uk-text-capitalize uk-text-break uk-text-bold">
															{{ period.cost_of_quantity_transferred_to_branches | currency(`${emporium.currency} `)}}
														</span>
													</div>
												</div>

												<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
													<div class="uk-width-1-1">
														<span class="uk-text-capitalize uk-text-break text-small">
															Transfers From Branches
														</span>
													</div>

													<div class="uk-width-auto">
														<span class="uk-text-capitalize uk-text-break uk-text-bold">
															{{period.quantity_transferred_from_branches | number('0,0') | pluralize('Unit')}}
														</span>
													</div>
												</div>

												<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal">
													<div class="uk-width-1-1">
														<span class="uk-text-capitalize uk-text-break text-small">
															Cost Of Transfers From Branches
														</span>
													</div>

													<div class="uk-width-auto">
														<span class="uk-text-capitalize uk-text-break uk-text-bold">
															{{period.cost_of_quantity_transferred_from_branches | currency(`${emporium.currency} `)}}
														</span>
													</div>
												</div>
											</div>

										</div>
										<div class="uk-width-1-3 tiny-padding uk-padding-remove-right uk-flex uk-flex-column">
											<div class="uk-width-1-1 uk-flex uk-flex-wrap bordered">

												<section class="uk-width-1-2@xl border-right">
													<div class="tiny-padding">


														<div class="uk-flex uk-flex-column">
															<h4>
																Purchases
															</h4>
															<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
																<div class="uk-width-1-1">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		Total Recorded Quantity.
																	</span>
																</div>

																<div class="uk-width-auto">
																	<span class="uk-text-capitalize uk-text-break uk-text-bold">
																		{{period.recorded_purchase_quantity | number('0,0') | pluralize('Unit')}}
																	</span>
																</div>
															</div>

															<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
																<div class="uk-width-1-1">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		Cost Of Recorded Purchases
																	</span>
																</div>

																<div class="uk-width-auto">
																	<span class="uk-text-capitalize uk-text-break uk-text-bold">
																		{{period.cost_of_recorded_purchase | currency(`${emporium.currency} `)}}
																	</span>
																</div>
															</div>

															<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
																<div class="uk-width-1-1">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		Reversed Purchase Quantity
																	</span>
																</div>

																<div class="uk-width-auto">
																	<span class="uk-text-capitalize uk-text-break uk-text-bold">
																		{{period.reversed_purchase_quantity | number('0,0') | pluralize('Unit')}}
																	</span>
																</div>
															</div>


															<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
																<div class="uk-width-1-1">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		Cost Of Purchase Reversals
																	</span>
																</div>

																<div class="uk-width-auto">
																	<span class="uk-text-capitalize uk-text-break uk-text-bold">
																		{{ period.cost_of_reversed_purchase | currency(`${emporium.currency} `)}}
																	</span>
																</div>
															</div>

															<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
																<div class="uk-width-1-1">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		Sellable Quantity Purchased
																	</span>
																</div>

																<div class="uk-width-auto">
																	<span class="uk-text-capitalize uk-text-break uk-text-bold">
																		{{ period.sellable_purchase_quantity | number('0,0') | pluralize('Unit')}}
																	</span>
																</div>
															</div>

															<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
																<div class="uk-width-1-1">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		Cost Of Sellable Purchases
																	</span>
																</div>


																<div class="uk-width-auto">
																	<span class="uk-text-capitalize uk-text-break uk-text-bold">
																		{{ period.cost_of_sellable_purchase | currency(`${emporium.currency} `)}}
																	</span>
																</div>
															</div>

															<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
																<div class="uk-width-1-1">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		Amount Paid For Purchases
																	</span>
																</div>

																<div class="uk-width-auto">
																	<span class="uk-text-capitalize uk-text-break uk-text-bold">
																		{{ period.payments_made | currency(`${emporium.currency} `)}}
																	</span>
																</div>
															</div>

															<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
																<div class="uk-width-1-1">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		Discount Received on Purchases 
																	</span>
																</div>

																<div class="uk-width-auto">
																	<span class="uk-text-capitalize uk-text-break uk-text-bold">
																		{{ period.discount_received | currency(`${emporium.currency} `)}}
																	</span>
																</div>
															</div>

															<div class="uk-flex uk-flex-between uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal">
																<div class="uk-width-1-1">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		Amount Outstanding for Purchases 
																	</span>
																</div>

																<div class="uk-width-auto">
																	<span class="uk-text-capitalize uk-text-break uk-text-bold">
																		{{ period.total_debt | currency(`${emporium.currency} `)}}
																	</span>
																</div>
															</div>
														</div>
													</div>
												</section>
												<section class="uk-width-1-2@xl">
													<div class="border-top uk-hidden@xl"></div>
													<div class="border-top uk-hidden@xl"></div>
													<div class="border-top uk-hidden@xl"></div>
													<div class="uk-flex uk-flex-column tiny-padding">
														<h4>
															Sales
														</h4>
														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Total Qty. Sold
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{ period.quantity_sold | number('0,0') | pluralize('Unit')}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Cost Of Sales
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{ period.cost_of_quantity_sold | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Gross Value of Sales
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{ (period.gross_sales + period.discount_allowed + period.total_tax) | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Discount Given On Sales
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{ period.discount_allowed | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Taxes on Sales
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{ period.total_tax | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Net Value of Sales
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{ period.gross_sales | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>
													</div>
													<div class="border-top uk-visible@xl"></div>
													<div class="border-top uk-visible@xl"></div>
													<div class="border-top uk-visible@xl"></div>
													<div class="tiny-padding uk-flex uk-flex-column uk-visible@xl">
														<h4>
															Transfers
														</h4>

														<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-1-1">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Transfers To Branches
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{period.quantity_transferred_to_branches | number('0,0') | pluralize('Unit')}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-1-1">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Cost Of Transfers To Branches
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{ period.cost_of_quantity_transferred_to_branches | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-1-1">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Transfers From Branches
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{period.quantity_transferred_from_branches | number('0,0') | pluralize('Unit')}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal">
															<div class="uk-width-1-1">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Cost Of Transfers From Branches
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{period.cost_of_quantity_transferred_from_branches | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>
													</div>
												</section>
											</div>
										</div>
										<div class="uk-width-1-3 tiny-padding uk-padding-remove-right uk-margin-auto-vertical uk-margin-remove-top">
											<div class="tiny-padding bordered">
												<h4>
													Closing Balance
												</h4>


												<section>
													<div>
														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Closing Stock
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{period.store_closing_stock | number('0,0') | pluralize('Unit')}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Cost Of Closing Stock
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{period.cost_of_store_closing_stock | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Closing Debt
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold" :class="period.closing_debt > 0 ? 'uk-text-danger' : ''">
																	{{period.closing_debt | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Closing Credit
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold" :class="period.closing_credit > 0 ? 'uk-text-success' : ''">
																	{{period.closing_credit | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>
													</div>



													<div class="tiny-padding uk-padding-remove-horizontal uk-flex uk-flex-column">
														<span class="uk-text-uppercase uk-text-bold uk-margin-small-top tiny-margin-bottom">
															Warehouse
														</span>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Warehouse Closing Stock
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{period.warehouse_closing_stock | number('0,0') | pluralize('Unit')}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Cost Of Warehouse Closing Stock
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{ period.cost_of_warehouse_closing_stock | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>
													</div>


													<div class="tiny-padding uk-padding-remove-horizontal uk-flex uk-flex-column">
														<span class="uk-text-uppercase uk-text-bold uk-margin-small-top tiny-margin-bottom">
															Branches
														</span>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Branches Closing Stock
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{ period.branch_closing_stock | number('0,0') | pluralize('Unit')}}
																</span>
															</div>
														</div>

														<div class="uk-flex uk-flex-between uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal">
															<div class="uk-width-expand uk-margin-right">
																<span class="uk-text-capitalize uk-text-break text-small">
																	Cost Of Branches Closing Stock
																</span>
															</div>

															<div class="uk-width-auto">
																<span class="uk-text-capitalize uk-text-break uk-text-bold">
																	{{ period.cost_of_branch_closing_stock | currency(`${emporium.currency} `)}}
																</span>
															</div>
														</div>
													</div>
												</section>
											</div>
										</div>
									</div>

								</div>



								<div class="uk-width-1-1 uk-width-4-5@xl">
									<div class="uk-container">
										
										<h4 class="tiny-padding uk-padding-remove-bottom">
											Financial Period Highlights
										</h4>

										<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-grid-match">
											<div class="uk-width-1-2  tiny-padding">
												<div class="tiny-padding bordered uk-border-rounded">
													<h5 class="uk-text-bold">
														Most Valuable Products
													</h5>
													<p class="tiny-margin-bottom">
														These are the top 5 products that brought in the most value for in terms of sales for the <code class="highlight-text uk-text-bold">{{$moment(period.started_at).format('DD/MMM/YYYY')}} - {{$moment(period.ended_at).format('DD/MMM/YYYY')}} </code> Period.
													</p>

													<div class="uk-width-1-1 uk-margin-small-top">
														<template v-if="period.valuable_products && period.valuable_products.length > 0">
															<div class="uk-flex uk-width-1-1">
																<div class="uk-width-1-2">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Product
																	</span>
																</div>
																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Qty. Sold
																	</span>
																</div>
																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Value
																	</span>
																</div>
															</div>

															<div class="uk-flex uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal" v-for="(vp, i) in period.valuable_products" :key="`vp-${vp.uuid}`" :class="i < period.valuable_products.length - 1 ? 'border-bottom' : ''">
																<div class="uk-width-1-2 uk-flex uk-flex-column">
																	<span class="uk-text-capitalize uk-text-break">
																		{{vp.product_name}}
																	</span>
																	<span class="uk-text-capitalize uk-text-break text-small">
																		{{vp.variation_name}} - {{vp.code}}
																	</span>
																</div>
																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		{{vp.quantity | number('0,0') | pluralize('Unit' )}}
																	</span>
																</div>
																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		{{vp.amount | currency(`${emporium.currency} `)}}
																	</span>
																</div>
															</div>
														</template>
														<template v-else>
															<div class="uk-flex">
																<div class="square-30 bordered uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-right">
																	<span class="mdi mdi-chart-line-variant"></span>
																</div>

																<p class="uk-width-expand uk-margin-remove">
																	Sorry. There is no report for "Most Valuable Products" within the period under consideration.
																</p>
															</div>
														</template>
													</div>
												</div>
											</div>
											<div class="uk-width-1-2 tiny-padding">
												<div class="tiny-padding bordered uk-border-rounded">
													<h5 class="uk-text-bold">
														Products Your Customers Love
													</h5>
													<p class="tiny-margin-bottom">
														These are the top 5 products that were patronized the most by your customers for the <code class="highlight-text uk-text-bold">{{$moment(period.started_at).format('DD/MMM/YYYY')}} - {{$moment(period.ended_at).format('DD/MMM/YYYY')}} </code> Period.
													</p>

													<div class="uk-width-1-1 uk-margin-small-top">
														<template v-if="period.loved_products && period.loved_products.length > 0">
															<div class="uk-flex uk-width-1-1">
																<div class="uk-width-1-2">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Product
																	</span>
																</div>
																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Qty. Sold
																	</span>
																</div>
																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Frequency
																	</span>
																</div>
															</div>

															<div class="uk-flex uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal" v-for="(lp, i) in period.loved_products" :key="`lp-${lp.uuid}`" :class="i < period.loved_products.length - 1 ? 'border-bottom' : ''">
																<div class="uk-width-1-2 uk-flex uk-flex-column">
																	<span class="uk-text-capitalize uk-text-break">
																		{{lp.product_name}}
																	</span>
																	<span class="uk-text-capitalize uk-text-break text-small">
																		{{lp.variation_name}} - {{lp.code}}
																	</span>
																</div>
																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		{{lp.quantity | number('0,0') | pluralize('Unit' )}}
																	</span>
																</div>
																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		{{lp.frequency | number('0,0') | pluralize('Time' )}}
																	</span>
																</div>
															</div>
														</template>
														<template v-else>
															<div class="uk-flex">
																<div class="square-30 bordered uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-right">
																	<span class="mdi mdi-chart-line-variant"></span>
																</div>

																<p class="uk-width-expand uk-margin-remove">
																	Sorry. There is no report for "Products Your Customers Love" within the period under consideration.
																</p>
															</div>
														</template>
													</div>
												</div>
											</div>



											<div class="uk-width-1-2 uk-width-1-2@xl tiny-padding">
												<div class="tiny-padding bordered uk-border-rounded">
													<h5 class="uk-text-bold">
														Valuable Customers
													</h5>
													<p class="tiny-margin-bottom">
														These are the top 5 Customers that brought in the most value in terms of sale for the <code class="highlight-text uk-text-bold">{{$moment(period.started_at).format('DD/MMM/YYYY')}} - {{$moment(period.ended_at).format('DD/MMM/YYYY')}} </code> Period.
													</p>

													<div class="uk-width-1-1 uk-margin-small-top">
														<template v-if="period.valuable_customers && period.valuable_customers.length > 0">
															<div class="uk-flex uk-width-1-1">
																<div class="uk-width-expand uk-margin-small-right">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Customer
																	</span>
																</div>

																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Value
																	</span>
																</div>
															</div>

															<div class="uk-flex uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal" v-for="(vc, i) in period.valuable_customers" :key="`vc-${vc.uuid}`" :class="i < period.valuable_customers.length - 1 ? 'border-bottom' : ''">
																<div class="uk-width-expand uk-margin-small-right uk-flex uk-flex-column">
																	<span class="uk-text-capitalize uk-text-break">
																		{{vc.name}}
																	</span>
																</div>

																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		{{vc.amount | currency(`${emporium.currency} `) }}
																	</span>
																</div>
															</div>
														</template>
														<template v-else>
															<div class="uk-flex">
																<div class="square-30 bordered uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-right">
																	<span class="mdi mdi-chart-line-variant"></span>
																</div>

																<p class="uk-width-expand uk-margin-remove">
																	Sorry. There is no report for "Valuable Customers" within the period under consideration.
																</p>
															</div>
														</template>
													</div>
												</div>
											</div>

											<div class="uk-width-1-2 uk-width-1-2@xl tiny-padding">
												<div class="tiny-padding bordered uk-border-rounded">
													<h5 class="uk-text-bold">
														Loyal Customers
													</h5>
													<p class="tiny-margin-bottom">
														These are the top 5 Customers that brought in the most value in terms of sale for the <code class="highlight-text uk-text-bold">{{$moment(period.started_at).format('DD/MMM/YYYY')}} - {{$moment(period.ended_at).format('DD/MMM/YYYY')}} </code> Period.
													</p>

													<div class="uk-width-1-1 uk-margin-small-top">
														<template v-if="period.loyal_customers && period.loyal_customers.length > 0">
															<div class="uk-flex uk-width-1-1">
																<div class="uk-width-expand uk-margin-small-right">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Customer
																	</span>
																</div>

																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Transactions
																	</span>
																</div>
															</div>

															<div class="uk-flex uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal" v-for="(lyc, i) in period.loyal_customers" :key="`lyc-${lyc.uuid}`" :class="i < period.loyal_customers.length - 1 ? 'border-bottom' : ''">
																<div class="uk-width-expand uk-margin-small-right uk-flex uk-flex-column">
																	<span class="uk-text-capitalize uk-text-break">
																		{{lyc.name}}
																	</span>
																</div>

																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		{{lyc.frequency | number('0,0') | pluralize('Sale' )}}
																	</span>
																</div>
															</div>
														</template>
														<template v-else>
															<div class="uk-flex">
																<div class="square-30 bordered uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-right">
																	<span class="mdi mdi-chart-line-variant"></span>
																</div>

																<p class="uk-width-expand uk-margin-remove">
																	Sorry. There is no report for "Loyal Customers" within the period under consideration.
																</p>
															</div>
														</template>
													</div>
												</div>
											</div>
											<div class="uk-width-1-2 uk-width-1-2@xl tiny-padding">
												<div class="tiny-padding bordered uk-border-rounded">
													<h5 class="uk-text-bold">
														Favorite Suppliers
													</h5>
													<p class="tiny-margin-bottom">
														These are the top 5 Suppliers from whom you made the most purchase transactions for the <code class="highlight-text uk-text-bold">{{$moment(period.started_at).format('DD/MMM/YYYY')}} - {{$moment(period.ended_at).format('DD/MMM/YYYY')}} </code> Period.
													</p>

													<div class="uk-width-1-1 uk-margin-small-top">
														<template v-if="period.favourite_suppliers && period.favourite_suppliers.length > 0">
															<div class="uk-flex uk-width-1-1">
																<div class="uk-width-1-2">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Customer
																	</span>
																</div>
																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Purchases
																	</span>
																</div>

																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Units
																	</span>
																</div>
															</div>

															<div class="uk-flex uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal" v-for="(fvs, i) in period.favourite_suppliers" :key="`fvs-${fvs.uuid}`" :class="i < period.favourite_suppliers.length - 1 ? 'border-bottom' : ''">
																<div class="uk-width-1-2 uk-flex uk-flex-column">
																	<span class="uk-text-capitalize uk-text-break">
																		{{fvs.name}}
																	</span>
																</div>
																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		{{fvs.frequency | number('0,0') | pluralize('Purchase' )}}
																	</span>
																</div>

																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-capitalize uk-text-break text-small">
																		{{fvs.quantity | number('0,0') | pluralize('Unit' )}}
																		<!-- {{fvs.amount | currency(`${emporium.currency} `)}} -->
																	</span>
																</div>
															</div>
														</template>
														<template v-else>
															<div class="uk-flex">
																<div class="square-30 bordered uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-right">
																	<span class="mdi mdi-chart-line-variant"></span>
																</div>

																<p class="uk-width-expand uk-margin-remove">
																	Sorry. There is no report for "Favorite Suppliers" within the period under consideration.
																</p>
															</div>
														</template>
													</div>
												</div>
											</div>

											<div class="uk-width-1-2 uk-width-1-2@xl tiny-padding">
												<div class="tiny-padding bordered uk-border-rounded">
													<h5 class="uk-text-bold">
														Generous Suppliers
													</h5>
													<p class="tiny-margin-bottom">
														These are the top 5 Suppliers that gave you the biggest discount on your purchases <code class="highlight-text uk-text-bold">{{$moment(period.started_at).format('DD/MMM/YYYY')}} - {{$moment(period.ended_at).format('DD/MMM/YYYY')}} </code> Period.
													</p>

													<div class="uk-width-1-1 uk-margin-small-top">
														<template v-if="period.favourite_suppliers && period.favourite_suppliers.length > 0">
															<div class="uk-flex uk-width-1-1">
																<div class="uk-width-expand">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Customer
																	</span>
																</div>
																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-bold uk-text-uppercase text-small">
																		Discount
																	</span>
																</div>
															</div>

															<div class="uk-flex uk-flex-middle uk-width-1-1 grid-padding uk-padding-remove-horizontal" v-for="(gss, i) in period.favourite_suppliers" :key="`gss-${gss.uuid}`" :class="i < period.favourite_suppliers.length - 1 ? 'border-bottom' : ''">
																<div class="uk-width-expand uk-margin-small-right uk-flex uk-flex-column">
																	<span class="uk-text-capitalize uk-text-break">
																		{{gss.name}}
																	</span>
																</div>


																<div class="uk-width-1-4 uk-text-right">
																	<span class="uk-text-capitalize uk-text-break text-small">

																		{{gss.discount_received | currency(`${emporium.currency} `)}}
																	</span>
																</div>
															</div>
														</template>
														<template v-else>
															<div class="uk-flex">
																<div class="square-30 bordered uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-right">
																	<span class="mdi mdi-chart-line-variant"></span>
																</div>

																<p class="uk-width-expand uk-margin-remove">
																	Sorry. There is no report for "Generous Suppliers" within the period under consideration.
																</p>
															</div>
														</template>
													</div>
												</div>
											</div>

										</div>
									</div>
								</div>
							</div>
							<div class="border-right uk-margin-small-right uk-margin-small-left"></div>
							<div class="uk-width-medium grid-padding modal-content-full uk-overflow-auto">
								<h5 class="uk-text-bold uk-text-uppercase uk-margin-small-top">
									Income Statement
								</h5>

								<div class="uk-flex uk-flex-column">
									<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
										<div class="uk-width-1-1">
											<span class="uk-text-capitalize uk-text-break text-small">
												Cost of Sales
											</span>
										</div>

										<div class="uk-width-auto">
											<span class="uk-text-capitalize uk-text-break uk-text-bold">
												{{ period.cost_of_quantity_sold | currency(`${emporium.currency} `)}}
											</span>
										</div>
									</div>
								</div>

								<div class="uk-flex uk-flex-column">
									<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
										<div class="uk-width-1-1">
											<span class="uk-text-capitalize uk-text-break text-small">
												Income Before Taxes
											</span>
										</div>

										<div class="uk-width-auto">
											<span class="uk-text-capitalize uk-text-break uk-text-bold">
												{{ (period.gross_sales + period.total_tax) | currency(`${emporium.currency} `)}}
											</span>
										</div>
									</div>
								</div>

								<div class="uk-flex uk-flex-column">
									<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
										<div class="uk-width-1-1">
											<span class="uk-text-capitalize uk-text-break text-small">
												Value of Taxes
											</span>
										</div>

										<div class="uk-width-auto">
											<span class="uk-text-capitalize uk-text-break uk-text-bold">
												{{ period.total_tax | currency(`${emporium.currency} `)}}
											</span>
										</div>
									</div>
								</div>

								<div class="uk-flex uk-flex-column">
									<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
										<div class="uk-width-1-1">
											<span class="uk-text-capitalize uk-text-break text-small">
												Income After Taxes
											</span>
										</div>

										<div class="uk-width-auto">
											<span class="uk-text-capitalize uk-text-break uk-text-bold">
												{{ period.gross_sales | currency(`${emporium.currency} `)}}
											</span>
										</div>
									</div>
								</div>

								<div class="uk-flex uk-flex-column">
									<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal border-bottom">
										<div class="uk-width-1-1">
											<span class="uk-text-capitalize uk-text-break text-small">
												Profit
											</span>
										</div>

										<div class="uk-width-auto">
											<template v-if="period.gross_profit < 0">
												<span class="uk-text-capitalize uk-text-break uk-text-bold uk-text-danger">
													{{period.gross_profit | currency(`${emporium.currency} `)}}
												</span>
											</template>

											<template v-else>
												<span class="uk-text-capitalize uk-text-break uk-text-bold" :class="period.gross_profit > 0 ? 'uk-text-success' : ''">
													{{period.gross_profit | currency(`${emporium.currency} `)}}
												</span>
											</template>
										</div>
									</div>
								</div>

								<div class="uk-flex uk-flex-column uk-margin-large-bottom">
									<div class="uk-flex uk-flex-column uk-width-1-1 grid-padding uk-padding-remove-horizontal">
										<div class="uk-width-1-1">
											<span class="uk-text-capitalize uk-text-break text-small">
												Profit Margin
											</span>
										</div>

										<div class="uk-width-auto">
											<span class="uk-text-capitalize uk-text-break uk-text-bold uk-text-success" v-if="period.profit_margin > 0">
												{{(period.profit_margin / 100) | percent }}
											</span>

											<span class="uk-text-capitalize uk-text-break uk-text-bold uk-text-danger" v-else-if="period.profit_margin < 0">
												{{ period.profit_margin }}%
											</span>

											<span class="uk-text-capitalize uk-text-break uk-text-bold" v-else>
												{{ period.profit_margin }}%
											</span>
										</div>
									</div>
								</div>


							</div>
						</div>				
					</div>

				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps, close} from "@/mixins/periods/singleton"
export default {
	mixins : [bindProps, close],

	mounted(){
		this.$on('loaded', ()=>{
			this.loadModal = false
			this.showModal = true
		})
	}
}
</script>
