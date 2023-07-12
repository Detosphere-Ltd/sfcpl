<template>
	<div class="background">
		<div class="tiny-padding border-bottom ">
			<div class="uk-width-1-1 uk-flex uk-flex-middle uk-flex-between">
				<div class="uk-width-expand uk-flex uk-flex-middle">
					<h4 class="uk-margin-remove">Customers</h4>
				</div>


				<div class="uk-width-expand uk-flex uk-flex-right uk-flex-middle">
					<import-excel :resource="{name: 'Customers', path : 'customers'}" class="uk-margin-small-right" @import-completed="fetchData()" v-if="can('import-customers')"></import-excel>
					<customer-actions-add @customer-created="fetchData()" v-if="can('create-customers')"></customer-actions-add>
				</div>
			</div>
		</div>

		<div class="tiny-padding border-bottom uk-flex uk-flex-between uk-flex-middle">
			<div class="uk-width-1-1 uk-flex uk-flex-middle">
				<div class="square-40 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-right click" @click="clearFilters();fetchData()">
					<span class="mdi uk-text-white lni-large" :class="loading ? 'mdi-loading spin' : 'mdi-reload'"></span>
				</div>
				<div class="uk-width-auto uk-flex uk-flex-column">
					<span class="text-small">
						Filter by Status
					</span>
					<select class="uk-select uk-text-small" v-model="state">
						<option :value="state.value" v-for="(state, key) in states" :key="`debt-${key}`">{{state.text}}</option>
					</select>
				</div>


				<div class="uk-width-auto uk-margin-small-left uk-flex uk-flex-column">
					<span class="text-small">
						Debt Status
					</span>
					<select class="uk-select uk-text-small" v-model="has_debt">
						<option :value="item.value" v-for="(item, index) in debtors" :key="`debt-${index}`">{{item.text}}</option>
					</select>
				</div>

				<div class="uk-width-auto uk-margin-small-left uk-flex uk-flex-column">
					<span class="text-small">
						Customer Type
					</span>
					<select class="uk-select uk-text-small" v-model="type">
						<option :value="item.value" v-for="(item, index) in types" :key="`type-${index}`">{{item.text}}</option>
					</select>
				</div>
			</div>

			<div class="uk-flex uk-flex-middle">
				<div class="uk-width-medium">
					<input type="text" class="uk-input" placeholder="Search Customers" v-model="searchTerm">
				</div>

				<button class="uk-button uk-button-small uk-margin-small-left uk-button-primary" :disabled="!searchTerm || searchTerm.length < 3 || searching" :class="{loading : searching}" @click.prevent="searchData">
					Search
				</button>
			</div>
		</div>

		<div class="tiny-padding border-bottom">
			<headers-customers></headers-customers>
		</div>


		<div class="uk-width-1-1 uk-overflow-auto modal-content">
			<div v-if="loading" class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center">
				<loaders-spinner></loaders-spinner>
			</div>

			<div v-else>

				<div v-if="failed && errData"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s bordered rounded uk-margin-auto uk-margin-top uk-margin-bottom">
					<acl-parse-error :errorData="errData">
						<button class="uk-button uk-button-primary" slot="further-action" @click="fetchData()">
							Retry
						</button>
					</acl-parse-error>
				</div>
				
				<div v-else>
					<div  class="uk-width-1-1"  v-if="allCustomers && allCustomers.length > 0">


						<div class="uk-width-1-1"  v-if="allCustomers.length > 0">

							<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-child-width-1-1  uk-grid-collapse uk-grid-match" uk-grid>
								<customer-card v-for="(customer, key) in allCustomers" :key="customer.uuid" :customer="customer" @needs-to-refresh="fetchData()" @status-changed="fetchData()" :class="key < (allCustomers.length - 1) ? 'border-bottom' : ''" >									
								</customer-card>
							</div>
						</div>

						<div class="uk-padding uk-padding-remove-horizontal uk-padding-remove-top uk-width-1-1" v-else>

							<div v-if="searchTerm" class="uk-width-1-1">

								<div class="uk-width-1-1 uk-width-2xlarge@m uk-margin-top uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-border-rounded uk-padding background uk-margin-auto">
									<code class="uk-text-bold uk-margin-small-bottom">
										"{{searchTerm}}"
									</code>
									<h5 class="uk-text-center uk-margin-remove uk-text-bold">
										There were no customers that matched your search
									</h5>
									<p class="uk-text-center uk-margin-remove-top">
										Try a different search term or clear your search to continue
									</p>
									<button class="uk-button uk-background-danger-op uk-button-small" @click="searchTerm = ''">
										Clear Search
									</button>
								</div>
							</div>

						</div>

						<div class="border-top tiny-padding uk-flex uk-flex-center" v-if="pagination && pagination.total_pages > pagination.current_page">
							<button class="uk-button uk-button-primary uk-button-small" :disabled="fetching" @click="loadExtraData" :class="{loading : fetching}">
								Load More Records
							</button>
						</div>
					</div>



					<div class="uk-width-1-1 uk-padding uk-padding-remove-top uk-margin-small-top" v-else>

						<div class="uk-width-2xlarge@m background rounded uk-padding uk-margin-auto">
							<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding-large">
								<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-drama-masks lni-extra-large uk-margin-bottom"></span>
									<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
										No customer found
									</h4>
									<p class="uk-text-center uk-margin-remove-top">
										Customers in your store will show up here.
									</p>

								</div>
								<div class="uk-flex uk-flex-middle">
									<customer-actions-add v-if="can('create-customers')" class="uk-margin-small-right" @customer-created="fetchData()"></customer-actions-add>
									<button class="uk-button uk-button-primary uk-button-small" @click="fetchData(); clearFilters()">
										Load All Customers
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
import customers from "@/mixins/customers"
export default{
	mixins : [customers],
	async mounted(){
		await this.fetchData()
	}
};
</script>

