<template>
	<div class="background">
		
		<div class="tiny-padding border-bottom ">
			<div class="uk-width-1-1 uk-flex uk-flex-middle uk-flex-between">
				<div class="uk-width-expand uk-flex uk-flex-middle">
					<div class="square-30 uk-border-circle uk-background-primary uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="fetchData(); clearFilters(); searchTerm = ''">
						<span class="mdi uk-text-white" :class="loading || searching ? 'mdi-loading spin' : 'mdi-reload'"></span>
					</div>
					<h4 class="uk-margin-remove">Warehouse</h4>
				</div>
				

				<div class="uk-width-expand uk-flex uk-flex-right uk-flex-middle">
					<purchase-actions-record-invoice class="uk-margin-small-right" v-if="can('record-purchases')" @completed="fetchData()"></purchase-actions-record-invoice>
				</div>
			</div>
		</div>
		<div class="tiny-padding border-bottom uk-flex uk-flex-bottom uk-flex-between">
			<div class="uk-flex uk-flex-bottom">

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
				
				<div class="uk-flex uk-flex-middle">
					<div class="uk-width-small@m uk-inline">
						<input type="text" class="uk-input" placeholder="Warehouse search" v-model="searchTerm">
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

			<div>
				<transfer-initialize @emptied="selectAll = false; selectedItems = []" @transfer-initiated="fetchData"  v-if="can('create-transfers')" :selection="selectedItems"></transfer-initialize>
			</div>
		</div>


		<section class="uk-width-1-1 horizontal-scroll ledger">

			
			<div class="tiny-padding border-bottom uk-width-1-1">
				<headers-warehouse-stock>
					<input type="checkbox" class="uk-checkbox square-20 uk-border-rounded bordered" v-model="selectAll">
				</headers-warehouse-stock>
			</div>


			<div class="uk-width-1-1">
				<div v-if="loading" class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center">
					<loaders-spinner></loaders-spinner>
				</div>

				<div class="uk-width-1-1" v-else>

					<div v-if="failed && errData"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s  rounded uk-margin-auto uk-margin-top">
						<error-parser :errorData="errData">
							<button class="uk-button uk-button-primary" slot="further-action" @click="fetchData()">
								Retry
							</button>
						</error-parser>
					</div>
					<div class="uk-width-1-1" v-else>
						<template v-if="allProducts && allProducts.length > 0">
							<product-stock class="tiny-padding" v-for="(product,i) in allProducts" :key="product.slug" :class="[i < (allProducts.length - 1) ? 'border-bottom' : '',  selectionArray.includes(product.uuid) ? 'uk-button-view' : '']"  :allSelected="selectedItems.includes(product) || selectAll"  :product="product" @remove="removeFromSelection" @select="addToSelection" @needs-to-refresh="fetchData()">
							</product-stock>

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
										<span class="mdi mdi-warehouse lni-extra-large uk-margin-bottom"></span>
										<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
											Your Warehouse is Empty
										</h4>
										<p class="uk-text-center uk-margin-remove-top">
											Your Warehouse stock will show up here when available.
										</p>

									</div>
									<div class="uk-flex uk-flex-center">
										<purchase-actions-record-invoice class="uk-margin-small-right" v-if="can('record-purchases')" @completed="fetchData()">
											<template #action-button>
												<button class="uk-button uk-button-view">
													Record Purchase
												</button>
											</template>
										</purchase-actions-record-invoice>
										<button class="uk-button uk-button-primary uk-margin-small-left" @click="fetchData(); clearFilters(); searchTerm = ''">
											Refresh Data
										</button>
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
import warehouseProducts from "@/mixins/loaders/warehouse"
export default{
	head(){
		return{
			title : `${this.$appName} | ${this.emporium.name} - Warehouse Stock`
		}
	},
	mixins : [parent, warehouseProducts],
	async mounted(){
		await this.fetchData()
		this.$on('fresh', ()=>{
			this.selectAll = false;
			this.selectedItems = []
		})
	}
};
</script>
