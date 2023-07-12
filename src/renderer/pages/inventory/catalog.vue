<template>
	<div class="background">
		<div class="tiny-padding border-bottom ">
			<div class="uk-width-1-1 uk-flex uk-flex-middle uk-flex-between">
				<div class="uk-width-expand uk-flex uk-flex-middle">
					<div class="square-30 uk-border-circle uk-background-primary uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="fetchData(); clearFilters(); searchTerm = ''">
						<span class="mdi uk-text-white" :class="loading || searching ? 'mdi-loading spin' : 'mdi-reload'"></span>
					</div>
					<h4 class="uk-margin-remove">Product Catalog</h4>
				</div>
				

				<div class="uk-width-expand uk-flex uk-flex-right uk-flex-middle">
					<import-excel :resource="{name: 'Products', path : 'products'}" class="uk-margin-small-right" @import-completed="fetchData" v-if="can('import-products')"></import-excel>
					<product-actions-add @needs-to-refresh="fetchData" v-if="can('create-products')"></product-actions-add>
				</div>
			</div>
		</div>

		<div class="tiny-padding border-bottom uk-flex uk-flex-middle uk-flex-between">
			<div class="uk-flex uk-flex-middle">
				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="instock">
						<option :value="option.value" v-for="(option,key) in stockLevels" :key="`stock${key}`">
							{{option.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="has_expired_items">
						<option :value="option.value" v-for="(option,key) in expiry" :key="`expiry${key}`">
							{{option.text}}
						</option>
					</select>
				</div>
				
				<div class="uk-width-medium@m uk-inline">
					<input type="text" class="uk-input" placeholder="Product search" v-model="searchTerm">
					<div class="uk-flex uk-flex-middle uk-width-auto uk-position-z-index uk-position-center-right" v-if="searchTerm || searching">
						<a class="square-20 background uk-border-circle bordered uk-flex uk-flex-column uk-flex-center uk-flex-middle click uk-margin-small-right" v-if="searchTerm && !searching" @click="fetchData(); searchTerm = ''">
							<span class="mdi mdi-close"></span>
						</a>
					</div>
				</div>
				<button class="uk-button uk-button-small uk-button-primary uk-margin-small-left" :disabled="!searchTerm || searching || searchTerm.length < 3"  @click.prevent="debouncedSearch" :class="{loading : searching}">
					Search
				</button>
			</div>

			<div class="uk-width-auto uk-margin-auto-left tiny-padding uk-padding-remove-horizontal">
				<product-actions-update-bulk-product-stock-alert :selection="selectionArray" @done="fetchData"></product-actions-update-bulk-product-stock-alert>
			</div>

		</div>

		<section class="uk-width-1-1 horizontal-scroll ledger">
			<div class="tiny-padding border-bottom">
				<headers-catalog>
					<input type="checkbox" class="uk-checkbox square-20 uk-border-rounded bordered" v-model="selectAll">
				</headers-catalog>
			</div>


			<div class="uk-width-1-1">
				<div v-if="loading" class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center">
					<loaders-spinner></loaders-spinner>
				</div>

				<div v-else>

					<div v-if="failed && errData"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s  rounded uk-margin-auto uk-margin-top">
						<error-parser :errorData="errData">
							<button class="uk-button uk-button-primary" slot="further-action" @click="fetchData">
								Retry
							</button>
						</error-parser>
					</div>
					<div class="uk-margin-large-bottom" v-else>
						<template v-if="allProducts && allProducts.length > 0">
							<product-catalog v-for="(product,i) in allProducts" :key="product.slug" :class="[i < (allProducts.length - 1) ? 'border-bottom' : '' , selectionArray.includes(product.uuid) ? 'uk-button-view' : '']"  :allSelected="selectAll"  :product="product" @remove="removeFromSelection" @select="addToSelection" @needs-to-refresh="fetchData">
							</product-catalog>

							<div class="border-top tiny-padding uk-flex uk-flex-center" v-if="pagination && pagination.total_pages > pagination.current_page">
								<button class="uk-button uk-button-primary uk-button-small" :disabled="fetching" @click="loadExtraData" :class="{loading : fetching}">
									Load More Records
								</button>
							</div>
						</template>


						<div class="uk-width-1-1 uk-padding uk-padding-remove-top uk-margin-small-top" v-else>

							<div class="uk-width-2xlarge@m background rounded uk-padding uk-margin-auto">
								<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
										<span class="mdi mdi-package lni-extra-large uk-margin-bottom"></span>
										<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
											No Products found
										</h4>
										<p class="uk-text-center uk-margin-remove-top">
											Your products catalog will show up here
										</p>

									</div>
									<div class="uk-flex uk-flex-center">
										<button class="uk-button uk-button-primary uk-button-small uk-margin-small-right" @click="clearFilters(); fetchData(); searchTerm = ''">
											Reload Products
										</button>
										<product-actions-add @needs-to-refresh="fetchData" v-if="can('create-products')"></product-actions-add>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</section>
	</div>
</div>
</template>
<script>
import {parent} from "@/mixins/product/controls"
import productCatalog from "@/mixins/loaders/catalog"
export default{
	head(){
		return{
			title : `${this.$appName} | ${this.emporium.name} - Products Catalog`
		}
	},
	mixins : [parent, productCatalog],
	async mounted(){
		await this.fetchData()
		this.$on('fresh', ()=>{
			this.selectAll = false;
			this.selectedItems = []
		})
	}
};
</script>
