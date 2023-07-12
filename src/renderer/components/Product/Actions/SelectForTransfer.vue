<template>
	<div v-if="product.warehouse_quantity > 0 ">
		<div class="chip uk-border-rounded click uk-background-success" @click="showModal = true">
			<span class="text-small uk-text-white">
				Add To Transfer
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

					<div class="uk-flex  uk-flex-middle tiny-padding border-bottom uk-flex-between">
						<h5 class="uk-margin-remove uk-text-bold uk-text-truncate">
							Transfer {{product.name}}   BRANCH
						</h5>


						<button class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
							cancel
						</button>
						
					</div>

					<div class="tiny-padding uk-flex uk-flex-wrap uk-overflow-auto modal-content ">
						<div class="uk-width-1-2">

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
									Enter Quantity. Maximum is {{currentlySelectedVariant.warehouse_quantity | pluralize('unit')}}.
								</span>
								<a-input-number size="large" v-model="quantity" @focus="$store.dispatch('validation/clearErrors')" class="input-number" :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/\D/g, '')" :min="1" :max="currentlySelectedVariant && currentlySelectedVariant.uuid !== undefined ? currentlySelectedVariant.warehouse_quantity : 0">
								</a-input-number>
							</div>

							<div class="grid-padding">
								<button class="uk-button uk-button-primary uk-button-small" :disabled="!variation || !quantity || quantity < 1" @click="addToList">
									Add Variation to list
								</button>
							</div>
						</div>

						<div class="border-right tiny-margin-left tiny-margin-right"></div>

						<div class="uk-width-expand tiny-margin-left uk-flex uk-flex-column">
							

							<div class="bordered uk-border-rounded uk-padding-small" v-if="products && products.length > 0">

								<div class="grid-padding uk-padding-remove-horizontal border-bottom" v-for="(pr, index) in products" :key="`___${pr.variation}`">
									<div class="uk-width-1-1">
										<div class="uk-flex">
											<div class="uk-width-expand uk-text-capitalize" uk-leader>
												<span>{{ product.variations.filter(item => {return item.uuid === pr.variation})[0] !== undefined ? product.variations.filter(item => {return item.uuid === pr.variation})[0].variation.name :  "" | variationize}}</span>
											</div>
											<div>
												<span class="text-small"> &nbsp; &nbsp;{{pr.quantity | pluralize('Unit')}}</span>
											</div>
										</div>
									</div>
								</div>



								<button class="uk-button uk-button-success uk-text-white uk-button-small uk-margin-small-top" @click="addVariationToTransfer">
									Add Selected {{products.length | pluralize("Items")}}
								</button>
							</div>

							<div class="uk-flex uk-flex-column uk-flex-middle uk-margin-auto-vertical" v-else>

								<span class="mdi mdi-package lni-mid-large uk-margin-small-bottom"></span>
								<p class="uk-text-center">
									No variations of {{product.name}} selected for transfer. Please add a varition to continue.
								</p>

							</div>


						</div>
					</div>


				</div>
			</div>
		</vue-final-modal>
	</div>

</template>
<script>
import {bindProps} from "@/mixins/product/singleton"
export default{
	mixins : [bindProps],
	data(){
		return {
			showModal : false,
			variation : '',
			quantity : '',
			loading : false,
			products : []
		}
	},

	computed : {
		selectedVariations(){
			return [...new Set(this.products.map( item => item.variation ))] 
		},
		availableVariations(){
			return this.product.variations.filter(variant => { return !this.selectedVariations.includes(variant.uuid)})
		},

		// selectedBranch(){
		// 	return this.branches.filter(branch => { return branch.uuid === this.transferData.branch})[0]
		// },
		currentlySelectedVariant(){
			return this.product.variations.filter(item => {return item.uuid === this.variation})[0]
		}
	},

	methods : {
		async addToList(){
			let payload = {
				variation : this.variation,
				quantity : this.quantity,
				variation_name : this.currentlySelectedVariant.variation.name,
				product_name : this.product.name,
				product_uuid : this.product.uuid
			}

			await this.products.push(payload)
			this.quantity = ''
			this.variation = ''
		},

		resetData(){
			this.variation = ''
			this.quantity = ''
			this.loading = false
			this.products = []
		},

		async addVariationToTransfer(){
			await this.$store.dispatch('transfer/addVariation', this.products)
			.then(()=>{
				this.showModal = false
				this.$message.success(`Selection added to transfer`, 4)
			})
			.catch(err => {
				this.$message.error(`Failed to add selecetion to transfer. Please try again. ${err && err.message !== undefined ? err.message : ''}`, 4)
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
