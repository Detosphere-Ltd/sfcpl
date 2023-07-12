<template>
	<div class="background uk-padding-large uk-padding-remove-horizontal uk-padding-remove-top">
		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-flex uk-flex-middle uk-flex-between">
				<div class="uk-width-expand uk-flex uk-flex-middle">
					<div class="square-30 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="clearFilters();getInvoices()">
						<span class="mdi uk-text-white" :class="loading ? 'mdi-loading spin' : 'mdi-reload'"></span>
					</div>
					<h4 class="uk-margin-remove">Purchase Invoices</h4>
				</div>

				<div class="uk-width-expand uk-flex uk-flex-right uk-flex-middle">
					<purchase-actions-record-invoice class="uk-margin-small-right" v-if="can('record-purchases')" @completed="getInvoices()"></purchase-actions-record-invoice>
				</div>
			</div>
		</div>

		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-flex uk-flex-bottom">

				<div class="uk-width-auto uk-margin-small-right uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom uk-text-truncate">Purchases By Date</span>
					<partials-date-picker @date-set="applyDate"></partials-date-picker>
				</div>

				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
					<span class="text-small tiny-margin-bottom uk-text-truncate">Purchase Status</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="state">
						<option value="" selected >All Purchases</option>
						<option :value="option.value" v-for="option in states" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-small  uk-flex uk-flex-column uk-margin-small-right tags-input">
					<span class="text-small tiny-margin-bottom uk-text-truncate">Supplier</span>
					
					<a-select mode="default" v-model="supplier"  not-found-content="No supplier found" show-search filter-option option-filter-prop="name" show-arrow size="large">
						<a-select-option selected class="uk-text-truncate" name="All Suppliers" value="">
							All Suppliers
						</a-select-option>
						<a-select-option class="uk-text-truncate" v-for="supplier in $store.getters['suppliers/suppliers']" :key="supplier.uuid" :name="supplier.name" :value="supplier.uuid">
							{{supplier.name}}
						</a-select-option>
					</a-select>
				</div>

				
				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
					<span class="text-small tiny-margin-bottom uk-text-truncate">Filter By Payment Status</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="outstanding">
						<option value="" selected >All Purchases</option>
						<option :value="option.value" v-for="(option,key) in [{value : 'true', text:'Credit Purchases'}, {value : 'false', text:'Fully Paid Purchases'}]" :key="`payment${key}`">
							{{option.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-auto  uk-flex uk-flex-right uk-flex-middle uk-margin-auto-left">
					<div class="uk-width-expand uk-inline tiny-margin-right">
						<input type="text" class="uk-input" placeholder="Search Purchase Invoices" v-model="searchTerm">
						<div class="square-20 uk-border-circle uk-flex uk-flex-column uk-flex-middle uk-flex-center  uk-background-danger uk-position-center-right tiny-margin-right click" @click="searchTerm = ''; getInvoices()" v-if="searchTerm">
							<span class="mdi mdi-close uk-text-white"></span>
						</div>
					</div>
					<button class="uk-button uk-button-primary uk-button-small" :disabled="searching || !searchTerm || searchTerm.length < 3" @click="search()" :class="{loading : searching}">
						Search
					</button>
				</div>

			</div>
		</div>


		<div class="tiny-padding border-bottom">
			<headers-invoice-purchases></headers-invoice-purchases>
		</div>


		<div class="uk-width-1-1">
			<div v-if="loading" class="uk-padding-small uk-flex uk-flex-center uk-flex-middle uk-flex-column">
				<loaders-spinner></loaders-spinner>
			</div>

			<div v-else>

				<div v-if="failed && errData"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s bordered rounded uk-margin-auto uk-margin-top">
					<acl-parse-error :errorData="errData">
						<button class="uk-button uk-button-primary" slot="further-action" @click="clearFilters(); getInvoices()">
							Retry
						</button>
					</acl-parse-error>
				</div>
				<div v-else>
					<template v-if="invoices && invoices.length > 0">
						<purchase-invoice-card v-for="(invoice,i) in invoices" :key="invoice.uuid" :class="i < (invoices.length - 1) ? 'border-bottom' : ''" @needs-to-refresh="getInvoices()" :invoice="invoice">
						</purchase-invoice-card>
					</template>



					<div class="uk-width-1-1 uk-padding uk-padding-remove-top uk-margin-small-top" v-else>

						<div class="uk-width-2xlarge@m background rounded uk-padding uk-margin-auto">
							<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
								<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-receipt lni-extra-large uk-margin-bottom"></span>
									<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
										No purchase invoice records found
									</h4>
									<p class="uk-text-center uk-margin-remove-top">
										Your purchase invoices will be displayed here when available
									</p>

									<button class="uk-button uk-button-primary" @click="clearFilters(); getInvoices()">
										Retry
									</button>

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
import purchases from "@/mixins/purchases/invoices" 
export default{
	mixins : [purchases],
	async created(){
		await this.getInvoices()
	},
	head(){
		return{
			title : `${this.$appName} | ${this.emporium.name} - Purchases From Invoices`
		}
	},
};
</script>
