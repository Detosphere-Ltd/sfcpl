<template>
	<div>
		<div class="chip bordered uk-border-rounded text-small click" @click="showModal = true">
			<slot name="action-button">
				Details 
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="resetData" @before-open="getTransferDetails()">
			<div class="uk-width-1-1 uk-margin-top">
				<div class="rounded bordered background raised-deep uk-width-1-1 uk-inline uk-margin-auto uk-width-xlarge@s">
					<template v-if="fetching">
						<div class="uk-padding uk-flex uk-flex-center uk-flex-middle uk-flex-column">
							<loaders-spinner></loaders-spinner>
							<p class="uk-margin-top">
								Loading Transfer Details
							</p>
						</div>
					</template>
					<template v-else>

						<error-parser :errorData="errData" v-if="failed && errData" class="uk-padding">
							<button class="uk-button uk-button-small uk-button-primary" slot="further-action" @click="getTransferDetails()">
								Retry
							</button>
						</error-parser>
						<template v-else>
							<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
								<h5 class="uk-margin-remove uk-text-bold">
									Transfer Details
								</h5>
								<button class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="processing">
									Close
								</button>
							</div>
							<div>
								<div class="tiny-padding">
									<h5 class="tiny-margin-bottom uk-text-bold">
										Transfer of {{transfer.total_units | pluralize('unit')}} of {{transfer.total_products | pluralize('product')}} 
									</h5>

									<p class="uk-margin-remove-top uk-margin-small-bottom"> 
										<template v-if="transfer.to === 'branch'">From Warehouse to {{ transfer.branch.name | branchize}} </template>
										<template v-else>From {{ transfer.branch.name | branchize}} to Warehouse</template> with REF NO: {{transfer.reference_no}}
									</p>


									

									<transfer-actions-download-slip :transfer="transfer"></transfer-actions-download-slip>

								</div>

								<div class="uk-flex border-top">
									<div class="uk-width-1-2 tiny-padding click" @click="show = 'log'" :class="show === 'log' ? 'tabActive' : ''">
										<h6 class="uk-margin-remove uk-text-capitalize  uk-text-center">
											Transfer Activity Log
										</h6>
									</div>
									<div class="uk-width-1-2 tiny-padding click"  @click="show = 'products'" :class="show === 'products' ? 'tabActive' : ''">
										<h6 class="uk-margin-remove uk-text-capitalize  uk-text-center">
											Transferred Products
										</h6>
									</div>
								</div>

								<div class="tiny-padding uk-padding-remove-horizontal uk-flex uk-flex-column border-top modal-content uk-overflow-auto">
									<template v-if="show === 'log'">

										<div class="uk-width-1-1 uk-flex tiny-padding uk-padding-remove-bottom">
											<partials-avatar :media="originator.avatar" class="uk-margin-small-right" :size="45"></partials-avatar>
											<div class="uk-width-expand background bordered uk-border-rounded tiny-padding">
												<p class="text-small uk-margin-remove">
													Transfer Created by {{originator.name}} at {{$moment(transfer.created_at).format('hh:mm A')}} on {{$moment(transfer.created_at).format('DD MMM, YYYY')}}
												</p>

												<div v-if="transfer.tags && transfer.tags.length > 0" class="uk-flex uk-flex-wrap uk-margin-small-top">
													<div class="background  uk-border-rounded bordered tiny-margin-right tiny-margin-bottom" v-for="tag in transfer.tags" :key="tag.slug">
														<span class="text-small uk-text-capitalize">
															{{tag.name}}
														</span>
													</div>
												</div>

											</div>
										</div>
										<div v-if="stateHistories && stateHistories.length > 0" class="tiny-padding uk-padding-remove-top">
											<template  v-for="state in stateHistories">
												<div class="transfer-status" :key="state.created_at">
													<div class="uk-flex">
														<partials-avatar :media="state.responsible.avatar" class="uk-margin-small-right" :size="45"></partials-avatar>

														<div class="uk-width-expand">
															<div class="uk-width-1-1 text-small uk-flex uk-flex-column background bordered uk-border-rounded tiny-padding">
																<span class="uk-margin-auto-right uk-margin-small-bottom label status" :class="state.to">
																	<small>{{state.to.split('_').join(' ')}}</small>
																</span>

																<div class="uk-width-1-1">
																	<p class="uk-margin-remove">
																		{{state.responsible.name}} at {{$moment(state.created_at).format('hh:mm A')}} on {{$moment(state.created_at).format('dddd, DD MMM, YYYY')}} 
																	</p>

																	<div class="uk-width-1-1 uk-flex uk-flex-top tiny-padding uk-padding-remove-horizontal" v-if="state.custom_properties && state.custom_properties.comments">
																		<div class="uk-width-expand">
																			<span class="text-small">
																				- {{state.custom_properties.comments}}
																			</span>
																		</div>
																	</div>
																</div>



															</div>
														</div>
													</div>
												</div>
											</template>
										</div>
									</template>
									<template v-else>
										<div v-for="(product, productIndex) in transferData.products" :key="productIndex" class="uk-flex uk-flex-middle uk-flex-wrap tiny-padding uk-padding-remove-top" :class="productIndex < transferData.products.length - 1 ? 'border-bottom uk-margin-small-bottom' : ''">
											<div class="uk-width-1-1 uk-flex">
												<div class="square-30 uk-button-view uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle">
													{{productIndex+1}}
												</div>

												<div class="uk-width-expand uk-margin-small-left">
													<h5 class="uk-text-break uk-text-capitalize tiny-margin-bottom uk-margin-remove-top">
														{{product.name}}
													</h5>
													<p class="text-small uk-text-truncate uk-margin-remove-top tiny-margin-bottom">
														{{product.variation_name | capitalize }} &bull; {{product.code}}
													</p>

													<p class="text-small uk-text-truncate uk-margin-remove">
														{{ product.quantity | pluralize('Total Unit') }} {{transfer.status === 'confirmed' ? '' : 'To Be'}} Transferred
													</p>
													
												</div>

												<div class="uk-width-auto uk-flex uk-flex-right uk-margin-auto-vertical uk-margin-remove-top click" @click="visibleIndex === productIndex ? visibleIndex = undefined : visibleIndex = productIndex">
													<div class="chip bordered uk-border-rounded text-small click">
														{{visibleIndex === productIndex ? 'Hide' : 'Show'}} {{transfer.to === 'branch' ? 'Purchases' : 'Batches'}}
													</div>
												</div>

											</div>

											<div class="uk-flex" v-show="visibleIndex === productIndex">
												<div class="square-30 uk-margin-small-right"></div>
												<div class="uk-width-expand">
													


													<table class="uk-table uk-table-middle uk-table-justify uk-table-small uk-table-divider">
														<thead>
															<tr class="border-bottom">
																<th>
																	<span class="text-small-spaced uk-text-uppercase">			
																		Purchase Date
																	</span>
																</th>
																<th>
																	<span class="text-small-spaced uk-text-uppercase">			
																		Expiry Date
																	</span>
																</th>
																<th>
																	<span class="text-small-spaced uk-text-uppercase">			
																		Transfer Qty.
																	</span>
																</th>
																<th class="uk-table-expand">
																	<span class="text-small-spaced uk-text-uppercase">			
																		Supplier
																	</span>
																</th>
															</tr>
														</thead>

														<template v-if="transfer.to === 'branch'">
															<tbody>
																<tr v-for="(instance, instanceIndex) in product.purchases" :key="instance.uuid" :class="instanceIndex < product.purchases ? 'border-bottom' : ''">
																	<td>
																		<span class="text-small">
																			{{$moment(instance.model.created_at).format('D-MMM-YYYY')}}
																		</span>
																	</td>
																	<td>
																		<span class="text-small">
																			{{ instance.model.expires_at ? $moment(instance.model.expires_at).format('D-MMM-YYYY') : ' - - -' }}
																		</span>
																	</td>
																	<td>
																		<span class="text-small">
																			{{instance.quantity_transferred | number('0,0') | pluralize('Unit')}}
																		</span>
																	</td>

																	<td>
																		<span class="text-small">
																			{{instance.model.supplier && instance.model.supplier.name ? instance.model.supplier.name : 'Unknown Supplier' }}
																		</span>
																	</td>

																</tr>
															</tbody>
														</template>

														<template v-else>
															<tbody>
																<tr v-for="(instance, instanceIndex) in product.purchases" :key="instance.uuid" :class="instanceIndex < product.purchases ? 'border-bottom' : ''">
																	<td>
																		<span class="text-small">
																			{{$moment(instance.model.purchase.created_at).format('D-MMM-YYYY')}}
																		</span>
																	</td>
																	<td>
																		<span class="text-small">
																			{{ instance.model.purchase.expires_at ? $moment(instance.model.purchase.expires_at).format('D-MMM-YYYY') : ' - - -' }}
																		</span>
																	</td>
																	<td>
																		<span class="text-small">
																			{{instance.quantity_transferred | number('0,0') | pluralize('Unit')}}
																		</span>
																	</td>

																	<td>
																		<span class="text-small">
																			{{instance.model.purchase.supplier && instance.model.purchase.supplier.name ? instance.model.purchase.supplier.name : 'Unknown Supplier' }}
																		</span>
																	</td>

																</tr>
															</tbody>
														</template>
													</table>


												</div>
											</div>

										</div>
									</template>
								</div>
							</div>

						</template>

					</template>

				</div>
			</div>
		</vue-final-modal>
	</div>
</template>

<script>
import {base, bindProps} from "@/mixins/transfer/singleton"
export default{
	mixins : [base, bindProps],
	props : {
		tab : {
			type : String,
		default : 'log'
		}
	},
	data(){
		return {
			show : 'log',
			visibleIndex : undefined
		}
	},

	created(){
		this.show = this.tab
	}
};
</script>
