<template>
	<div >
		<div class="bordered background uk-border-rounded">
			<div class="tiny-padding border-bottom ">
				<div class="uk-width-1-1 uk-flex uk-flex-middle uk-flex-between">
					<div class="uk-width-expand uk-flex uk-flex-middle">
						<h5 class="uk-margin-remove">
							Purchases made from {{supplier.name}}
						</h5>
					</div>

					<nuxt-link :to="{name: 'inventory-purchases'}" class="chip uk-border-rounded uk-background-primary">
						<span class="text-small uk-text-white">
							Browse All Purchases
						</span>
					</nuxt-link>
				</div>
			</div>


			<div class="tiny-padding border-bottom">
				<div class="uk-width-1-1 uk-flex uk-flex-middle">
					<div class="uk-width-auto  uk-flex uk-flex-column">
						<span class="text-small tiny-margin-bottom">Filter By Status</span>
						<select class="uk-select uk-text-small uk-text-capitalize" v-model="state">
							<option value="" selected >All Purchases</option>
							<option :value="option.value" v-for="option in states" :key="option.value">
								{{option.text}}
							</option>
						</select>
					</div>

					<div class="uk-width-auto uk-margin-medium-left uk-margin-medium-right uk-flex uk-flex-column">
						<span class="text-small tiny-margin-bottom">Filter By Date</span>
						<partials-date-picker @date-set="applyDate"></partials-date-picker>
					</div>
				</div>
			</div>


			<div class="tiny-padding border-bottom">
				<headers-purchases></headers-purchases>
			</div>


			<div class="uk-width-1-1 uk-overflow-auto modal-content">
				<div v-if="loading" class="uk-padding-small uk-flex uk-flex-center uk-flex-middle uk-flex-column">
					<loaders-spinner></loaders-spinner>
				</div>

				<div v-else>

					<div v-if="failed && errData"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s uk-margin-auto uk-margin-top">
						<acl-parse-error :errorData="errData">
							<button class="uk-button uk-button-primary" slot="further-action" @click="getPurchases">
								Retry
							</button>
						</acl-parse-error>
					</div>
					<div v-else>
						<template v-if="purchases && purchases.length > 0">
							<purchase-card v-for="(purchase,i) in purchases" :key="purchase.uuid" :class="i < (purchases.length - 1) ? 'border-bottom' : ''" 
							@needs-to-refresh="getPurchases" :purchase="purchase">
						</purchase-card>
					</template>


					<div class="uk-width-1-1 uk-padding uk-padding-remove-top uk-margin-small-top" v-else>

						<div class="uk-width-2xlarge@m background rounded uk-padding uk-margin-auto">
							<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
								<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-package lni-extra-large uk-margin-bottom"></span>
									<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
										No purchase records found
									</h4>
									<p class="uk-text-center uk-margin-remove-top">
										Your purchase history will be displayed here when available
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
</div>
</template>
<script>
import purchases from "@/mixins/suppliers/purchases" 
export default{
	mixins : [purchases],
	async created(){
		await this.getPurchases()
	}
};
</script>
