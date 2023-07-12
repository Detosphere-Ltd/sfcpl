<template>
	<div class="background">
		<div class="tiny-padding border-bottom ">
			<div class="uk-width-1-1 uk-flex uk-flex-middle uk-flex-between">
				<div class="uk-width-expand uk-flex uk-flex-middle">
					<div class="square-30 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="clearFilters();loadTransfers()">
						<span class="mdi uk-text-white" :class="loading ? 'mdi-loading spin' : 'mdi-reload'"></span>
					</div>
					<h4 class="uk-margin-remove">Stock Requests</h4>
				</div>
			</div>
		</div>

		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-flex uk-flex-middle">

				<div class="uk-width-auto uk-margin-small-right uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom">Filter By Date</span>
					<partials-date-picker @date-set="applyDate"></partials-date-picker>
				</div>
				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-right">
					<span class="text-small tiny-margin-bottom">Filter By Direction</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="direction">
						<option value="" selected >Requests From All Sources &nbsp;&nbsp;</option>
						<option :value="option.value" v-for="option in directions" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>


				<div class="uk-width-auto uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom">Filter By Status</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="state">
						<option value="" selected >All Request Statuses &nbsp;&nbsp;</option>
						<option :value="option.value" v-for="option in states" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>
				
			</div>
		</div>




		<div class="uk-width-1-1">
			<div v-if="loading" class="uk-padding uk-flex uk-flex-center uk-flex-middle uk-flex-column">
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
							<template  v-for="(transfer,i) in transfers">

								<request-to-branch :key="transfer.uuid" :class="i < (transfers.length - 1) ? 'border-bottom' : ''" @needs-to-refresh="loadTransfers(); successModal = true" :transfer="transfer" v-if="transfer.to === 'branch'">
								</request-to-branch>
								<request-from-branch :key="transfer.uuid" :class="i < (transfers.length - 1) ? 'border-bottom' : ''" @needs-to-refresh="loadTransfers(); successModal = true" :transfer="transfer" v-else></request-from-branch>
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

		<vue-final-modal v-model="successModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large uk-flex uk-flex-column uk-padding">

					<div class="uk-flex uk-flex-column uk-flex-middle uk-flex-center">

						<div class="square-60 uk-border-rounded uk-margin-bottom uk-button-view uk-flex uk-flex-column uk-flex-center uk-flex-middle">
							<span class="mdi lni-mid-large mdi-checkbox-multiple-marked"></span>
						</div>

						<h4 class="uk-text-center">
							Stock Request Accepted
						</h4>

						<p class="uk-text-small uk-text-center">
							A transfer has been generated from this request. Head over the "Transfers" section to dispatch it now
						</p>


						<div class="uk-width-1-1 uk-padding-small border-top uk-flex uk-flex-center uk-padding-remove-bottom">
							<button class="uk-button uk-background-danger-op tiny-margin-right" @click="successModal = false;">
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
import transfer_request from "@/mixins/requests" 
export default{
	head(){
		return{
			title : `${this.$appName} | ${this.emporium.name} - Transfer Requests`
		}
	},
	mixins : [transfer_request],
	async created(){
		await this.loadTransfers()
	},


	data(){
		return {
			successModal : false
		}
	}
};
</script>
