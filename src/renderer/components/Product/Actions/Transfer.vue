<template>
	<div v-if="product.warehouse_quantity > 0 ">
		<div class="chip uk-border-rounded click uk-background-success" @click="showModal = true">
			<span class="text-small uk-text-white">
				Transfer Product
			</span>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="resetData">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-2xlarge@s uk-inline">


					<div class="uk-position-cover uk-position-z-index" v-if="loading">
						<div class="uk-height-1-1 uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered rounded">
							<partials-loader class="uk-margin-bottom"></partials-loader>
							<span>Initiating transfer...</span>
						</div>
					</div>

					<div class="uk-flex  uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold uk-text-truncate">
							Transfer {{product.name}}  {{selectedBranch && selectedBranch.name !== undefined ? 'to '+selectedBranch.name : '' | branchize}}
						</h5>
						
					</div>

					<div class="tiny-padding uk-flex uk-flex-wrap uk-overflow-auto modal-content ">
						<div class="uk-width-1-2">
							<div class="grid-padding uk-flex uk-flex-column tags-input">
								<span class="uk-text-small tiny-margin-bottom">
									Select a branch to continue
								</span>
								<a-select size="large" class="uk-width-1-1 text-small uk-text-capitalize" v-model="transferData.branch" notFoundContent="" option-label-prop="name" show-search filter-option option-filter-prop="name">

									<a-select-option disabled value="" key="select-branch" name="Select A Branch" class="uk-text-capitalize">
										Select A Branch
									</a-select-option>


									<a-select-option :value="branch.uuid" v-for="(branch, key) in branches" :key="branch.uuid" :name="branch.name">
										{{branch.name}} <small>{{branch.country ? `${branch.country}, ` : ''}} {{branch.city ? ` ${branch.city}` : ''}}</small>
									</a-select-option>
								</a-select>	
							</div>
							

							<template v-if="transferData.branch">
								<div class="grid-padding uk-flex uk-flex-column tags-input">


									<a-select defaultActiveFirstOption size="large" class="uk-width-1-1 text-small uk-text-capitalize" v-model="variation" notFoundContent="" option-label-prop="name" show-search filter-option option-filter-prop="name">
										<a-select-option disabled value="" key="select-variant" :name="`Select a variation of ${product.name}`" class="uk-text-capitalize">
											{{`Select a variation of ${product.name}`}}
										</a-select-option>
										<a-select-option :value="variant.uuid" v-for="variant in availableVariations" :key="variant.uuid" :name="variant.variation.name" class="uk-text-capitalize">
											{{variant.variation.name}}
										</a-select-option>
									</a-select>


								</div>
								<div class="grid-padding uk-flex uk-flex-column">
									<span class="text-small tiny-margin-bottom uk-text-warning" v-if="currentlySelectedVariant && currentlySelectedVariant.uuid !== undefined ">
										You can transfer up to {{currentlySelectedVariant.warehouse_quantity | pluralize('unit')}} of the selected variation.
									</span>
									<input type="number" class="uk-input uk-text-small" placeholder="Enter Quantity" v-model="quantity" min="1" :max="currentlySelectedVariant && currentlySelectedVariant.uuid !== undefined ? currentlySelectedVariant.warehouse_quantity : 0">
								</div>

								<div class="grid-padding">
									<button class="uk-button uk-button-primary uk-button-small" :disabled="!transferData.branch || !variation || !quantity || quantity < 1" @click="addToList">
										Add to list
									</button>
								</div>
							</template>
						</div>

						<div class="border-right tiny-margin-left tiny-margin-right"></div>

						<div class="uk-width-expand tiny-margin-left">
							<div class="bordered uk-border-rounded uk-padding-small">

								<template v-if="transferData.branch">

									<div class="grid-padding uk-padding-remove-horizontal border-bottom" v-for="(pr, index) in transferData.products" :key="`___${pr.variation}`">
										<p class="uk-text-truncate uk-text-capitalize tiny-margin-bottom">
											{{ product.variations.filter(item => {return item.uuid === pr.variation})[0] !== undefined ? product.variations.filter(item => {return item.uuid === pr.variation})[0].variation.name :  "" }}
										</p>
										<span>
											{{pr.quantity | pluralize('Unit')}}
										</span>
									</div>

									<div class="grid-padding uk-padding-remove-horizontal tags-input background uk-flex uk-flex-column uk-width-1-1" v-if="selectedVariations.length > 0">
										<span class="text-small uk-margin-small-bottom uk-margin-small-top">Enter your reason(s) for this transfer <br> (Eg: Routine branch restock)</span>
										<a-select mode="tags" :max-tag-count="2" class="uk-width-1-1 uk-text-small" notFoundContent="" :show-arrow="false" placeholder="Reason for transfer"></a-select>
									</div>
									<button class="uk-button uk-button-primary uk-margin-small-top" :disabled="selectedVariations.length < 1 || loading" @click="initiateTransfer">
										Initiate Transfer
									</button>

								</template>

								<div class="uk-flex uk-flex-column" v-else>
									<span class="mdi mdi-lightbulb lni-large uk-text-amber tiny-margin-bottom"></span>
									<h6>To transfer a product follow the process below</h6>
									<div class="uk-flex uk-flex-column">
										<div class="uk-width-1-1 uk-flex grid-padding uk-padding-remove-horizontal">
											<div class="square-25 bordered uk-border-circle uk-margin-small-right uk-flex uk-flex-column uk-flex-center uk-flex-middle">
												1
											</div>
											<div class="uk-width-expand">
												<p class="tiny-margin-bottom">
													Select branch from the list provided (on the left.)
												</p>
											</div>
										</div>

										<div class="uk-width-1-1 uk-flex grid-padding uk-padding-remove-horizontal">
											<div class="square-25 bordered uk-border-circle uk-margin-small-right uk-flex uk-flex-column uk-flex-center uk-flex-middle">
												2
											</div>
											<div class="uk-width-expand">
												<p class="tiny-margin-bottom">
													Select a product variation and enter quanity.
												</p>
											</div>
										</div>

										<div class="uk-width-1-1 uk-flex grid-padding uk-padding-remove-horizontal">
											<div class="square-25 bordered uk-border-circle uk-margin-small-right uk-flex uk-flex-column uk-flex-center uk-flex-middle">
												3
											</div>
											<div class="uk-width-expand">
												<p class="tiny-margin-bottom">
													Click "Add to list" to add items to transfer list. (Repeat this process as many times as necessary).
												</p>
											</div>
										</div>

										<div class="uk-width-1-1 uk-flex grid-padding uk-padding-remove-horizontal">
											<div class="square-25 bordered uk-border-circle uk-margin-small-right uk-flex uk-flex-column uk-flex-center uk-flex-middle">
												4
											</div>
											<div class="uk-width-expand">
												<p class="tiny-margin-bottom">
													Click "Initiate Transfer" when you are satisfied with your selection.
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="tiny-padding border-top">
						<button class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
							cancel
						</button>
					</div>


				</div>
			</div>
		</vue-final-modal>
	</div>

</template>
<script>
import {mapGetters} from "vuex"
import {bindProps} from "@/mixins/product/singleton"
export default{
	mixins : [bindProps],
	data(){
		return {
			showModal : false,
			variation : '',
			quantity : '',
			loading : false,
			transferData : {
				branch : '',
				products : [],
				tags : ["Routine Restock"]
			}
		}
	},

	computed : {
		...mapGetters({
			branches : 'branches/activeBranches'
		}),

		selectedVariations(){
			return [...new Set(this.transferData.products.map( item => item.variation ))] 
		},
		availableVariations(){
			return this.product.variations.filter(variant => { return !this.selectedVariations.includes(variant.uuid)})
		},

		selectedBranch(){
			return this.branches.filter(branch => { return branch.uuid === this.transferData.branch})[0]
		},
		currentlySelectedVariant(){
			return this.product.variations.filter(item => {return item.uuid === this.variation})[0]
		}
	},

	methods : {
		async addToList(){
			await this.transferData.products.push({variation : this.variation, quantity : this.quantity })
			this.quantity = ''
			this.variation = ''
		},

		resetData(){
			this.variation = ''
			this.quantity = ''
			this.loading = false
			this.transferData = {
				branch : '',
				products : [],
				tags : ["Routine Restock"]
			}
		},

		async initiateTransfer(){
			this.loading = true
			await this.$axios.$post(`/transfers`, this.transferData)
			.then(()=>{
				this.$message.success('Transfer of products initiated', 4)
				this.showModal = false
				this.$emit('transfer-initiated')
			})

			.catch( err =>{
				this.$message.error(`Failed to initiate transfer. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 5)
			})
			.finally(()=>{
				this.loading = false
			})
		}

	},

	watch : {
		quantity(){
			if (this.currentlySelectedVariant && this.currentlySelectedVariant.warehouse_quantity !== undefined) {
				if (this.quantity > this.currentlySelectedVariant.warehouse_quantity) {
					this.quantity = this.currentlySelectedVariant.warehouse_quantity
					return
				}
			}
		}
	}
};
</script>
