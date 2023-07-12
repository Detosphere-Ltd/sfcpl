<template>
	<div>
		<div class="chip bordered uk-border-rounded text-small click" @click="showModal = true">
			View Details 
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="resetData; show = 'log'"  @before-open="getTransferDetails()">
			<div class="uk-width-1-1 uk-margin-top">
				<div class="rounded bordered background raised-deep uk-width-1-1 uk-inline uk-margin-auto uk-width-xlarge@s">
					<template v-if="fetching">
						<div class="uk-padding uk-flex uk-flex-center uk-flex-middle uk-flex-column">
							<loaders-spinner></loaders-spinner>
							<p class="uk-margin-top">
								Loading Stock Request Details
							</p>
						</div>
					</template>
					<template v-else>

						<error-parser :errorData="errData" v-if="failed && errData" class="uk-padding">
							<template #further-action>
								<div>
									<button class="uk-button uk-button-danger"  @click="showModal = false">
										Cancel
									</button>
									<button class="uk-button uk-button-primary"  @click="getTransferDetails()">
										Retry
									</button>
								</div>
							</template>
						</error-parser>



						<template v-else>
							<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
								<h5 class="uk-margin-remove uk-text-bold">
									Stock Request Details
								</h5>
								<button class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="processing">
									Close
								</button>
							</div>
							<div class="uk-width-1-1 modal-content uk-overflow-auto">
								<div class="tiny-padding">
									<h5 class="tiny-margin-bottom uk-text-bold">
										Request for {{transfer.total_units | pluralize('unit')}} of {{transfer.total_products | pluralize('product')}} 
									</h5>

									<p class="uk-margin-remove-top tiny-margin-bottom">
										Requested by
										<template v-if="transfer.to === 'branch'">Warehouse</template>
										<template v-else>{{ transfer.branch.name | branchize}}</template>
									</p>

									<template v-if="transfer.status === 'submitted'">
										<div class="uk-flex uk-flex-middle uk-margin-small-top">
											<partials-avatar :size="25" :media="transfer.created_by.avatar" class="uk-margin-small-right"></partials-avatar>
											<p class="uk-margin-remove">
												{{transfer.current_state.responsible.name}} Submitted Transfer
											</p>
										</div>
									</template>

									<template v-else>
										<p class="uk-flex uk-flex-wrap uk-flex-top uk-margin-remove-bottom uk-margin-small-top
										uk-margin-small-top text-small">
										<span class="uk-width-expand uk-flex uk-flex-middle uk-flex-wrap">

											<span class="label status tiny-margin-right tiny-margin-left text-small uk-border-rounded uk-text-capitalize" :class="transfer.current_state.from">
												<span>{{transfer.current_state.from}}</span>
											</span> 

											&rarr;
											<span class="label status tiny-margin-right tiny-margin-left text-small uk-border-rounded uk-text-capitalize" :class="transfer.current_state.to">
												<span>{{transfer.current_state.to}} </span>
											</span>
											By {{transfer.current_state.responsible.name}} {{$moment(transfer.current_state.created_at).fromNow()}}
										</span>
									</p>
								</template>
							</div>

							<div class="uk-flex border-top">
								<div class="uk-width-1-2 tiny-padding click" @click="show = 'log'" :class="show === 'log' ? 'tabActive' : ''">
									<h6 class="uk-margin-remove uk-text-capitalize  uk-text-center">
										Transfer Activity Log
									</h6>
								</div>
								<div class="uk-width-1-2 tiny-padding click"  @click="show = 'products'" :class="show === 'products' ? 'tabActive' : ''">
									<h6 class="uk-margin-remove uk-text-capitalize  uk-text-center">
										Requested Products
									</h6>
								</div>
							</div>

							<div class="tiny-padding uk-padding-remove-horizontal uk-flex uk-flex-column border-top">
								<template v-if="show === 'log'">

									<div class="uk-width-1-1 uk-flex tiny-padding uk-padding-remove-bottom">
										<partials-avatar :media="originator.avatar" class="uk-margin-small-right" :size="45"></partials-avatar>
										<div class="uk-width-expand background bordered uk-border-rounded tiny-padding">
											<p class="text-small uk-margin-remove">
												{{originator.name}} submitted a stock request  at {{$moment(transfer.created_at).format('hh:mm A')}} on {{$moment(transfer.created_at).format('DD MMMM, YYYY')}}													


											</p>

											<div v-if="transfer.tags && transfer.tags.length > 0" class="uk-flex uk-flex-wrap uk-margin-small-top">
												<div class="background  uk-border-rounded bordered uk-label tiny-margin-right tiny-margin-bottom" v-for="tag in transfer.tags" :key="tag.slug">
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
														<div class="uk-width-1-1 background bordered uk-border-rounded tiny-padding">
															

															<div class="uk-flex uk-width-1-1 uk-flex uk-flex-wrap uk-flex-middle">
																<span class="label tiny-margin-right status" :class="state.from">
																	<span>{{state.from.split('_').join(' ')}}</span>
																</span>

																&rarr;
																<span class="label tiny-margin-left tiny-margin-right status" :class="state.to">
																	<span>{{state.to.split('_').join(' ')}}</span>
																</span>
															</div>

															<p class="text-small uk-margin-small-top uk-margin-remove-bottom">
																{{state.responsible.name}} at {{$moment(state.created_at).format('hh:mm A')}} on {{$moment(state.created_at).format('dddd, DD MMM, YYYY')}}
															</p>

															
															
															<div class="uk-width-1-1 uk-flex uk-flex-top tiny-padding uk-padding-remove-horizontal" v-if="state.custom_properties && state.custom_properties.comments">

																<span class="mdi mdi-message-settings-outline lni-large uk-margin-small-right"></span>
																<div class="uk-width-expand">
																	
																	<mark class="uk-button-view uk-border-rounded">
																		<span class="text-small">
																			{{state.custom_properties.comments}}
																		</span>
																	</mark>
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
									<div v-for="(product, i) in transferData.products" :key="i" class="uk-flex tiny-padding uk-padding-remove-top" :class="i < transferData.products.length - 1 ? 'border-bottom uk-margin-small-bottom' : ''">
										<div class="square-30 uk-button-view uk-border-rounded uk-margin-small-right uk-flex uk-flex-column uk-flex-center uk-flex-middle">
											{{i+1}}
										</div>
										<div class="uk-width-expand">
											<h6 class="uk-text-break uk-text-capitalize tiny-margin-bottom uk-margin-remove-top">
												{{product.name}}
											</h6>
											<p class="text-small uk-text-capitalize uk-text-truncate uk-margin-remove">
												{{product.variation_name | capitalize}} &bull; {{ product.boundary | pluralize('Unit')}} Requested
											</p>
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
import {base, bindProps} from "@/mixins/requests/singleton"
export default{
	mixins : [base, bindProps],
	data(){
		return {
			show : 'log'
		}
	}
};
</script>
