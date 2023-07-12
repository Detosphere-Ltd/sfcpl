<template>
	<div class="background">
		
		<div class="tiny-padding border-bottom  uk-flex uk-flex-between uk-flex-middle">
			<div class="uk-width-auto uk-flex uk-flex-top">
				<div class="square-30 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="clearFilters();loadTransfers()">
					<span class="mdi uk-text-white" :class="loading ? 'mdi-loading spin' : 'mdi-reload'"></span>
				</div>


				<div class="uk-flex uk-flex-column">
					<h4 class="uk-margin-remove">Stock Transfers</h4>
					<tips-transfers class="uk-margin-remove">
						<template #action-button>
							<span class="text-small underlined">Learn More About Transfers</span>
						</template>
					</tips-transfers>
				</div>
			</div>

			<div class="uk-flex uk-flex-middle uk-margin-right">

				<div class="uk-width-medium uk-margin-small-right uk-inline">
					<input placeholder="Enter Reference Number to search" v-model="searchTerm" type="text" class="uk-input">
					<div class="chip uk-background-danger pill click uk-position-center-right uk-margin-small-right" @click="searchTerm = ''; loadTransfers()" v-if="searchTerm">
						<small class="uk-text-white">Clear</small>
					</div>
				</div>
				<button class="uk-button uk-button-primary uk-button-small" @click="searchData()" :disabled="searching || !searchTerm || loading || fetching" :class="{loading : searching}">
					Find
				</button>				
			</div>
		</div>

		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-flex uk-flex-middle">

				<div class="uk-width-auto tiny-margin-right uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom">Filter By Date</span>
					<partials-date-picker @date-set="applyDate"></partials-date-picker>
				</div>
				<div class="uk-width-auto  uk-flex uk-flex-column tiny-margin-right">
					<span class="text-small tiny-margin-bottom">Filter By Transfer Direction</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="direction">
						<option value="" selected >Transfers from All Sources</option>
						<option :value="option.value" v-for="option in directions" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>


				<div class="uk-width-auto  uk-flex uk-flex-column tiny-margin-right">
					<span class="text-small tiny-margin-bottom">Filter By Transfer Status</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="state">
						<option value="" selected >All Transfer Statuses</option>
						<option :value="option.value" v-for="option in states" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>



				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
					<span class="text-small tiny-margin-bottom">Filter By Type</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="type">
						<option :value="option.value" v-for="option in types" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-auto  uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom">Filter By Cause</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="origin">
						<option :value="option.value" v-for="option in origins" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>
				
				
			</div>
		</div>
		<div class="tiny-padding border-bottom">
			<headers-transfers></headers-transfers>
		</div>




		<div class="uk-width-1-1">
			<div v-if="loading" class="uk-padding-small uk-flex uk-flex-center uk-flex-middle uk-flex-column">
				<loaders-spinner></loaders-spinner>
			</div>

			<div v-else>

				<div v-if="failed && errData"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s  rounded uk-margin-auto uk-margin-top uk-margin-bottom">
					<acl-parse-error :errorData="errData">
						<button class="uk-button uk-button-primary" slot="further-action" @click="loadTransfers">
							Retry
						</button>
					</acl-parse-error>
				</div>
				<div v-else>
					<template v-if="transfers && transfers.length > 0">
						<div class="uk-width-1-1 uk-flex uk-flex-column">
							
							<template v-for="(transfer,i) in transfers">

								<transfer-to-branch  :key="transfer.uuid" :class="i < (transfers.length - 1) ? 'border-bottom' : ''" @needs-to-refresh="loadTransfers" :transfer="transfer" v-if="transfer.to === 'branch'">
								</transfer-to-branch>

								
								<transfer-from-branch  :key="transfer.uuid" :class="i < (transfers.length - 1) ? 'border-bottom' : ''" @needs-to-refresh="loadTransfers" :transfer="transfer" v-else>
								</transfer-from-branch>
							</template>

							<div class="border-top tiny-padding uk-flex uk-flex-center" v-if="pagination && pagination.total_pages > pagination.current_page">
								<button class="uk-button uk-button-primary uk-button-small" :disabled="fetching" @click="loadExtraData" :class="{loading : fetching}">
									Load More Records
								</button>
							</div>

						</div>
					</template>


					<div class="uk-width-1-1 uk-padding uk-padding-remove-top uk-margin-small-top" v-else>

						<div class="uk-width-2xlarge@m background rounded uk-padding uk-margin-auto">
							<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
								<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-package lni-extra-large uk-margin-bottom"></span>
									<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
										No transfer records found
									</h4>
									<template v-if="state || from || to">
										<p class="uk-text-center uk-margin-remove-top" >
											There are no transfers that match your filters. 
										</p>
										<button class="uk-button uk-button-primary" @click="clearFilters()">
											Get all transfers
										</button>
									</template>


									<p class="uk-text-center uk-margin-remove-top" v-else>
										Stock transfer history will be displayed here when available.
									</p>
									

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
import transfers from "@/mixins/transfers" 
export default{
	head(){
		return{
			title : `${this.$appName} | ${this.emporium.name} - Transfers`
		}
	},
	mixins : [transfers],
	async created(){
		await this.loadTransfers()
	}
};
</script>
