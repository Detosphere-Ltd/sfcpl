<template>
	<div>
		<div class="tiny-padding uk-flex uk-flex-column click"  @click="initModal = true">
			<span class="uk-text-bold uk-h5 tiny-margin-bottom">
				Manual Transfer
			</span>
			<span class="text-small">
				Manually select purchases for your transfer. This way you are completetly in control of which batch of purchases are tranferred to your branches.
			</span>
		</div>

		<vue-final-modal :key="initModal" v-model="initModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="resetData">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large">
					<div class="uk-flex uk-flex-middle uk-flex-between tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold uk-text-truncate">
							Initialize A New Transfer
						</h5>

						<a class="uk-button uk-button-small uk-button-danger" @click="initModal = false">
							Close
						</a>
						
					</div>

					<div class="tiny-padding modal-content uk-overflow-auto uk-width-1-1">
						<div class="grid-padding uk-flex uk-flex-column tags-input">
							<span class="uk-text-small tiny-margin-bottom">
								Select a branch to continue
							</span>
							<a-select size="large" class="uk-width-1-1 text-small uk-text-capitalize" v-model="transferData.branch" notFoundContent="No branch found" option-label-prop="name" show-search filter-option option-filter-prop="name">

								<a-select-option disabled value="" key="select-branch" name="Select A Branch" class="uk-text-capitalize">
									Select A Branch
								</a-select-option>


								<a-select-option :value="branch.uuid" v-for="(branch, key) in branches" :key="branch.uuid" :name="branch.name">
									{{branch.name | branchize}} <small>{{branch.country ? `${branch.country}, ` : ''}} {{branch.city ? ` ${branch.city}` : ''}}</small>
								</a-select-option>
							</a-select>	
						</div>
						<div class="grid-padding uk-flex uk-flex-column tags-input">
							<div class="uk-width-1-1 uk-flex uk-flex-top uk-margin-small-bottom uk-margin-small-top uk-inline">
								<div class="uk-width-expand uk-margin-small-right">
									<p class="uk-text-small uk-margin-remove">Enter/Select reasons for this transfer <span class="text-small">Eg: Branch Restock)</span>
									</p>
								</div>
								<tips-transfer-reasons class="uk-position-z-index"></tips-transfer-reasons>
							</div>
							<a-select mode="tags" :filter-option="true" optionFilterProp="name" show-search class="uk-width-1-1 uk-text-small" notFoundContent="" :show-arrow="true" placeholder="Enter or Select reason(s) for this transfer" size="large" v-model="transferData.tags">
								<a-select-option :value="tag.name" v-for="(tag, key) in availableTags" :key="tag.name" :name="tag.name" class="uk-text-capitalize">
									{{ tag.name }}
								</a-select-option>
							</a-select>

						</div>
					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-view uk-margin-small-right" @click="initModal = false">
							Back
						</button>
						<button class="uk-button uk-button-primary" :disabled="!transferData.branch" @click="init">
							Next
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>

		<vue-final-modal v-model="selectProductsModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" @before-open="setProductsData">
			<div class="uk-width-1-1 uk-margin-small-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast  uk-flex uk-flex-column uk-width-1-1 un-inline uk-width-xlarge@m">

					<div class="uk-position-cover uk-position-z-index background rounded uk-flex uk-flex-column uk-flex-middle uk-flex-center" v-if="submitting">
						<loaders-spinner class="uk-margin-bottom"></loaders-spinner>
						<span>Creating transfer... Please wait</span>
					</div>
					<div class="tiny-padding border-bottom uk-flex uk-flex-between uk-flex-top">
						<div class="uk-width-expand uk-margin-right">
							<h5 class="tiny-margin-bottom uk-text-bold">
								Transfer Products<template v-if="transferData && transferData.custom_properties !== undefined"> to {{transferData.custom_properties.branch.name | branchize}}</template>
							</h5>
							
							<div class="uk-flex uk-flex-wrap" v-if="transferData && transferData.tags && transferData.tags.length > 0">
								<div class="tag  tiny-margin-right tiny-margin-top uk-border-rounded" v-for="(tag, tagIndex) in transferData.tags" :key="tag">
									<span class="text-small tiny-margin-right uk-text-capitalize">
										{{tag}}<template v-if="tagIndex < transferData.tags.length - 1">&nbsp;,</template>
									</span>
								</div>
							</div>
							

						</div>
						<div class="uk-width-auto">
							<button class="uk-button uk-button-small text-small uk-button-danger" @click="selectProductsModal = false; cancelPrompt = true">
								Cancel
							</button>
						</div>
					</div>

					<div class="uk-width-1-1 uk-overflow-auto modal-content">

						<div class="tiny-padding background tiny-margin-bottom uk-flex uk-flex-between" v-for="( product , productIndex) in products" :class="productIndex < products.length-1 ? 'border-bottom' : ''" :key="product.uuid">


							<div class="square-30 uk-background-danger uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-border-rounded click uk-margin-small-right tiny-margin-top" @click="removeProduct(product.variation)">
								<span class="mdi mdi-minus uk-text-white uk-text-large"></span>
							</div>


							<div class="uk-width-expand">
								<div class="uk-width-1-1 uk-flex uk-flex-top">
									<div class="uk-width-expand uk-margin-right">
										<h5 class="tiny-margin-bottom uk-text-break">
											{{product.product_name | capitalize}}
										</h5>
										<p class="text-small uk-text-truncate uk-margin-remove-bottom">
											{{product.variation_name | capitalize }}  &bull; {{product.code}}
										</p>
										<p class="text-small uk-text-truncate uk-margin-remove-bottom">
											{{ getTotal(productIndex) | number('0,0') }} {{ getTotal(productIndex) | pluralize('Unit') }} to be Tranferred &bull; {{product.boundary | pluralize("Unit")}} Available
										</p>


									</div>

									<div class="uk-flex uk-flex-middle uk-width-auto">
										<div class="label tiny-margin-right" :class="checkValidity(productIndex) ? 'label-success' : 'label-danger'">
											<small>{{checkValidity(productIndex) ? 'All Good' : 'Incomplete'}}</small>
										</div>
										<div class="square-30 uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-button-view uk-border-rounded click"  @click="visibleIndex === productIndex ? visibleIndex = undefined : visibleIndex = productIndex">
											<span class="mdi uk-text-large" :class="visibleIndex === productIndex ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
										</div>
									</div>
								</div>


								

								<div v-show="visibleIndex === productIndex">
									<div class="uk-flex uk-flex-column tiny-padding uk-padding-remove-horizontal" v-for="(instance, key) in product.items" :key="key" :class="key < product.items.length - 1 ? 'border-bottom' : ''">
										<div class="uk-width-1-1 uk-flex">

											<div class="uk-width-auto uk-margin-small-right tiny-margin-top">
												<div class="label uk-background-danger uk-text-white tiny-margin-bottom click" @click.prevent="removePurchase(productIndex, instance.purchase)">
													<small>Remove</small>
												</div>
											</div>
											<div class="uk-width-expand uk-margin-small-right uk-flex uk-flex-column">


												<span v-if="instance.original && instance.original.created_at">
													Recorded on {{$moment(instance.original.created_at).format('DD MMM, YYYY')}}
												</span>
												<span class="uk-text-warning" v-if="instance.original && instance.original.expires_at">
													Expires on {{$moment(instance.original.expires_at).format('DD MMM, YYYY')}}
												</span>
												<span v-if="instance.original && instance.original.quantity">
													{{ instance.original.quantity | number('0,0') | pluralize('Unit') }} Available
												</span>

												<span v-if="instance.original && instance.original.supplier && instance.original.supplier.name !== undefined">
													{{ instance.original.supplier.name }}
												</span>
											</div>

											<div style="width: 100px">
												<a-input-number :max="instance.original.quantity" :step="1" :min="0" v-model.number="product.items[key].quantity" :key="visibleIndex">
												</a-input-number>
											</div>
										</div>
									</div>


									<div class="tags-input purchase-selection uk-margin-auto-right tiny-padding uk-padding-remove-horizontal">
										<a-select mode="multiple" v-model="product.purchases" class="uk-width-1-1" placeholder="Select Purchases for this transfer" size="large" notFoundContent="No Purchases available for selection" @select="(val)=>{addPurchase(productIndex, val)}" show-arrow option-label-prop="title" :max-tag-count="0" :maxTagPlaceholder="`${product.purchases.length} purchases selected`">
											<template v-for="(purchase, purchaseIndex) in product.availablePurchases">
												<a-select-option :key="purchase.uuid" v-if="!product.purchases.includes(purchase.uuid)" :value="purchase.uuid" :title="$moment(purchase.created_at).format('DD MMMM, YYYY')">
													Recorded on {{$moment(purchase.created_at).format('DD MMMM, YYYY')}} 

													<template v-if="purchase.expires_at">
														<br> Expires on {{$moment(purchase.expires_at).format('DD MMMM, YYYY')}}
													</template>
													<br> {{purchase.quantity | number('0,0') | pluralize('Unit') }} Available 

													<template v-if="purchase.supplier && purchase.supplier.name !== undefined">
														<br> {{purchase.supplier.name}}
													</template> 
													<hr class="tiny-margin-top uk-margin-remove-bottom">

												</a-select-option>
											</template>

										</a-select>
									</div>
								</div>

							</div>
							<!-- <div style="width: 100px">
								<a-input-number :step="1" :max="product.boundary" :min="0" disabled v-model.number="product.quantity"></a-input-number>
							</div> -->
						</div>



					</div>

					<div class="tiny-padding border-top uk-flex uk-flex-middle uk-flex-center">
						<button class="uk-button uk-button-view uk-margin-small-right" @click="selectProductsModal = false; initModal = true">
							Go Back
						</button>
						<button class="uk-button uk-button-primary" :disabled="submitting || !filled" @click.prevent="submitTransfer">
							Submit Transfer
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>

		<vue-final-modal v-model="cancelPrompt" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium uk-flex uk-flex-column">

					<div class="uk-padding-small uk-flex uk-flex-column uk-flex-middle uk-flex-center">
						<h5 class="tiny-margin-bottom uk-text-bold uk-text-center">
							Cancel Transfer?
						</h5>
						<p class="uk-text-small uk-text-center">
							Are you sure you want to cancel this transfer and discard all progress? You will have to start over if you confirm this action.
						</p>


						<div>
							<button class="uk-button uk-button-small uk-background-pinkey uk-text-white" @click="cancelPrompt = false; selectProductsModal = true">
								Go Back
							</button>
							<button class="uk-button uk-button-small uk-button-danger" @click="destroyTransfer">
								Confirm Cancelation.
							</button>
						</div>
					</div>

				</div>
			</div>
		</vue-final-modal>



		<vue-final-modal v-model="successModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" @before-open="selectProductsModal = false">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large uk-flex uk-flex-column uk-padding uk-padding-remove-horizontal">

					<div class="uk-padding uk-flex uk-flex-column uk-flex-middle uk-flex-center">

						<div class="square-60 uk-border-rounded uk-margin-bottom uk-button-view uk-flex uk-flex-column uk-flex-center uk-flex-middle">
							<span class="mdi lni-mid-large mdi-checkbox-multiple-marked"></span>
						</div>

						<p class="uk-text-small uk-text-center">
							Your transfer has been created. You may now dispatch this transfer to notify relevant staff  <template v-if="transferData && transferData.custom_properties !== undefined"> at {{transferData.custom_properties.branch.name | branchize}}</template> of this action. 
						</p>


						<div class="uk-width-1-1 uk-padding-small border-top uk-flex uk-flex-center uk-padding-remove-bottom">
							<button class="uk-button uk-background-danger-op tiny-margin-right" @click="destroyTransfer">
								I'll do it later
							</button>
							<nuxt-link :to="{name: 'inventory-transfers'}" class="uk-button uk-button-primary">
								Dipatch Now
							</nuxt-link>
						</div>
					</div>

				</div>
			</div>
		</vue-final-modal>

	</div>
</template>
<script>
import manual from "@/mixins/transfer/manually"
export default{
	mixins : [manual]
};
</script>
