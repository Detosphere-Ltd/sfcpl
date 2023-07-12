<template>
	<div class="background">
		<div class="tiny-padding border-bottom ">
			<div class="uk-width-1-1 uk-flex uk-flex-middle uk-flex-between">


				<div class="uk-width-expand uk-flex uk-flex-middle">
					<div class="square-30 uk-border-circle uk-background-primary uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="fetchData(); clearFilters(); searchTerm = ''">
						<span class="mdi uk-text-white" :class="loading || searching ? 'mdi-loading spin' : 'mdi-reload'"></span>
					</div>
					<h4 class="uk-margin-remove">Stock</h4>
				</div>

				

				<div class="uk-width-auto uk-margin-auto-left uk-flex uk-flex-right uk-flex-middle">
					<branch-actions-request-stock @emptied="selectedItems = []; selectAll = false;" :branch="branch"  @done="fetchData" v-if="can('submit-transfer-requests')" :selection="selectedItems"></branch-actions-request-stock>
				</div>
			</div>
		</div>

		<div class="tiny-padding border-bottom uk-flex uk-flex-bottom">
			<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
				<span class="text-small tiny-margin-bottom">Stock Availability</span>
				<select class="uk-select uk-text-small uk-text-capitalize" v-model="instock">
					<option :value="option.value" v-for="(option,key) in stockLevels" :key="`stock${key}`">
						{{option.text}}
					</option>
				</select>
			</div>


			<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
				<span class="text-small tiny-margin-bottom">Stock Level</span>
				<select class="uk-select uk-text-small uk-text-capitalize" v-model="alert_type">
					<option :value="stock_level.value" v-for="(stock_level,key) in stockAlerts" :key="`alert${key}`">
						{{stock_level.text}}
					</option>
				</select>
			</div>

			<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
				<span class="text-small tiny-margin-bottom">Stock Health</span>
				<select class="uk-select uk-text-small uk-text-capitalize" v-model="has_expired_items">
					<option :value="option.value" v-for="(option,key) in expiry" :key="`expiry${key}`">
						{{option.text}}
					</option>
				</select>
			</div>

			<div class="uk-width-auto uk-flex uk-flex-middle uk-margin-auto-left">
				<div class="uk-width-medium uk-inline">
					<input type="text" class="uk-input" placeholder="Search" v-model="searchTerm">
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
		</div>


		<div class="tiny-padding border-bottom">
			<headers-branch-stock>
				<input type="checkbox" class="uk-checkbox square-20 uk-border-rounded bordered" v-model="selectAll">
			</headers-branch-stock>
		</div>


		<div class="uk-width-1-1 uk-overflow-auto modal-content">
			<div v-if="loading" class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center">
				<loaders-spinner></loaders-spinner>
			</div>

			<div v-else>

				<div v-if="failed && errData"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s  rounded uk-margin-auto uk-margin-top">
					<error-parser :errorData="errData">
						<button class="uk-button uk-button-primary" slot="further-action" @click="fetchData()">
							Retry
						</button>
					</error-parser>
				</div>
				<div v-else>
					<template v-if="allProducts && allProducts.length > 0">
						<stock-card class="tiny-padding" v-for="(product,i) in allProducts" :key="product.slug" :class="i < (allProducts.length - 1) ? 'border-bottom' : ''"  :allSelected="selectedItems.includes(product) || selectAll"  :product="product" @remove="removeFromSelection(product)" @select="addToSelection(product)" @needs-to-refresh="fetchData()">
						</stock-card>

						<div class="border-top tiny-padding uk-flex uk-flex-center" v-if="pagination && pagination.total_pages > pagination.current_page">
							<button class="uk-button uk-button-primary uk-button-small" :disabled="fetching" @click="loadExtraData" :class="{loading : fetching}">
								Load More Records
							</button>
						</div>
					</template>


					<div class="uk-width-1-1 uk-padding uk-padding-remove-top uk-margin-small-top" v-else>

						<div class="uk-width-2xlarge@m uk-margin-auto" v-if="searchTerm">
							<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
								<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-package lni-extra-large uk-margin-bottom"></span>
									<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
										No Products found
									</h4>
									<p class="uk-text-center uk-margin-remove-top">
										Your search term did not matrch any stock records for {{branch.name | branchize}}
									</p>

								</div>
								<button class="uk-button uk-background-danger-op uk-button-small" @click="searchTerm = ''; clearFilters(); fetchData();">
									Clear Search
								</button>
							</div>
						</div>

						<div class="uk-width-2xlarge@m background rounded uk-padding uk-margin-auto" v-else>
							<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
								<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-package lni-extra-large uk-margin-bottom"></span>
									<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
										No Stock found
									</h4>
									<p class="uk-text-center uk-margin-remove-top">
										{{branch.name | branchize}} has no stock at the moment. 

										<br v-if="can('create-transfers')"> {{can('create-transfers') ? "You can transfer products from your warehouse to this branch" : ""}}
									</p>

								</div>
								<div class="uk-flex uk-flex-center">
									<button class="uk-button uk-button-view uk-margin-small-right" @click="searchTerm = ''; clearFilters(); fetchData();">
										Reload Stock
									</button>
									<nuxt-link class="uk-button uk-button-primary" :to="{name : 'inventory'}" v-if="can(['create-transfers', 'view-products'])">
										Transfer Stock to this Branch
									</nuxt-link>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import {bindProps} from "@/mixins/branches/singleton"
import {parent} from "@/mixins/product/controls"
import branchProducts from "@/mixins/loaders/branchStock"
export default{
	mixins : [parent, branchProducts , bindProps],
	async mounted(){
		await this.fetchData()

		this.$on('fresh', ()=>{
			this.selectAll = false;
			this.selectedItems = []
		})
	},

	head(){
		return {
			title : `${this.branch.name} | Stock`
		}
	}
};
</script>

