<template>
	<div class="background">
		<div class="tiny-padding border-bottom ">
			<div class="uk-width-expand uk-flex uk-flex-middle">

				<div class="square-30 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="reset(); getStats()">
					<span class="mdi uk-text-white" :class="loading ? 'mdi-loading spin' : 'mdi-reload'"></span>
				</div>
				
				<h4 class="uk-margin-remove">Customers Report</h4>
			</div>
		</div>
		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-flex uk-flex-bottom uk-flex-wrap">
				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-right">
					<span class="text-small tiny-margin-bottom">Order By</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="order_by">
						<option :value="option.value" v-for="option in orderables" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>

				<div class="uk-width-auto  uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom">Sort By</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="direction">
						<option :value="option.value" v-for="option in sortables" :key="option.value">
							{{option.text}}
						</option>
					</select>
				</div>
			</div>
		</div>



		<div class="uk-width-1-1 uk-flex uk-flex-column horizontal-scroll">
			<div class="uk-width-1-1 uk-flex uk-flex-middle tiny-padding border-bottom">
				<div class="grid-gutter uk-width-medium">
					<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
						Customer
					</h6>
				</div>

				<div class="grid-gutter uk-width-small">
					<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
						Items (Qty)
					</h6>
				</div>


				<div class="grid-gutter uk-width-small">
					<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
						Amount Payable
					</h6>
				</div>



				<div class="grid-gutter uk-width-small">
					<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
						Discount Given
					</h6>
				</div>


				<div class="grid-gutter uk-width-small">
					<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
						Amount Paid
					</h6>
				</div>



				<div class="grid-gutter uk-width-small">
					<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
						Outstanding
					</h6>
				</div>
			</div>




			<div class="uk-width-1-1">
				<div v-if="loading" class="uk-padding-small uk-flex uk-flex-center uk-flex-middle uk-flex-column">
					<loaders-spinner></loaders-spinner>
				</div>

				<div v-else>

					<div v-if="failed && errData"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s  rounded uk-margin-auto uk-margin-top uk-margin-bottom">
						<acl-parse-error :errorData="errData">
							<button class="uk-button uk-button-primary" slot="further-action" @click="getStats()">
								Retry
							</button>
						</acl-parse-error>
					</div>
					<div v-else>
						<template v-if="stats && stats.length > 0">
							<div class="uk-width-1-1 uk-flex uk-flex-column">
								<div class="tiny-padding" v-for="(customer, i) in stats" :key="customer.uuid" :class="i < (stats.length - 1) ? 'border-bottom' : ''">

									<div class="uk-width-1-1 uk-flex uk-flex-middle">
										<div class="grid-gutter uk-width-medium">
											

											<nuxt-link v-if="can(['view-customers', 'view-purchases'])" class="underlined uk-text-primary" :to="{name: 'customers-customer', params : {customer : customer.uuid}}">
												{{customer.name}}
											</nuxt-link>

											<p v-else class="uk-text-break uk-margin-remove uk-text-capitalize">
												{{customer.name}}								
											</p>
										</div>


										<div class="grid-gutter uk-width-small">
											<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
												{{customer.quantity | number('0,0') | pluralize('Item')}}
											</p>
										</div>

										<div class="grid-gutter uk-width-small">
											<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
												{{customer.amount | currency(`${emporium.currency} `)}}
											</p>
										</div>

										<div class="grid-gutter uk-width-small">
											<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
												{{customer.discount_given | currency(`${emporium.currency} `)}}
											</p>
										</div>


										<div class="grid-gutter uk-width-small">
											<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
												{{customer.amount_paid | currency(`${emporium.currency} `)}}
											</p>
										</div>


										<div class="grid-gutter uk-width-small">
											<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small" :class="customer.amount_outstanding > 0 ? 'uk-text-danger' : ''">
												{{customer.amount_outstanding | currency(`${emporium.currency} `)}}
											</p>
										</div>
									</div>
								</div>

							</div>
						</template>


						<div class="uk-width-1-1 uk-padding uk-padding-remove-top uk-margin-small-top" v-else>

							<div class="uk-width-2xlarge@m background rounded uk-padding uk-margin-auto">
								<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
										<span class="mdi mdi-cart-arrow-down lni-extra-large uk-margin-bottom"></span>
										<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
											No records found
										</h4>
										<p class="uk-text-center uk-margin-remove-top" >
											We could not find any customer stats at the moment
										</p>

										<button class="uk-button uk-button-primary" @click="reset(); getStats();">
											Reset All Filters
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
import customer_report from "@/mixins/stats/customers" 
export default{
	head(){
		return {
			title : `${this.$appName} | ${this.emporium.name} - Customers Report`
		}
	},

	data(){
		return {
			showLedger : true
		}
	},
	mixins : [customer_report],
	async created(){
		await this.getStats()
	}
};
</script>
