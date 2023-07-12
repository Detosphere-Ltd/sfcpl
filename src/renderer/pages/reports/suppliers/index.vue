<template>
	<div class="background">
		<div class="tiny-padding border-bottom ">
			<div class="uk-width-expand uk-flex uk-flex-middle">

				<div class="square-30 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="reset(); getStats()">
					<span class="mdi uk-text-white" :class="loading ? 'mdi-loading spin' : 'mdi-reload'"></span>
				</div>
				
				<h4 class="uk-margin-remove">Suppliers Report</h4>
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




		<div class="uk-width-1-1 uk-flex uk-flex-middle tiny-padding border-bottom">
			<div class="grid-gutter uk-width-medium">
				<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
					Supplier
				</h6>
			</div>


			<div class="grid-gutter uk-width-small">
				<div class="uk-width-1-1">
					<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
						Qty. Purchased
					</h6>
				</div>
			</div>


			<div class="grid-gutter uk-width-small">
				<div class="uk-width-1-1">
					<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
						Amount Payable
					</h6>
				</div>
			</div>

			<div class="grid-gutter uk-width-small">
				<div class="uk-width-1-1">
					<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
						Discount Received
					</h6>
				</div>
			</div>



			<div class="grid-gutter uk-width-small">
				<div class="uk-width-1-1">
					<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
						Outstanding
					</h6>
				</div>
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
							<div class="tiny-padding" v-for="(supplier, i) in stats" :key="supplier.uuid" :class="i < (stats.length - 1) ? 'border-bottom' : ''">
								

								<div class="uk-width-1-1 uk-flex uk-flex-middle">
									<div class="grid-gutter uk-width-medium">
										<nuxt-link v-if="can(['view-suppliers', 'view-purchases'])" class="underlined uk-text-primary" :to="{name: 'suppliers-supplier', params : {supplier : supplier.uuid}}">
											{{supplier.name}}
										</nuxt-link>
										<p class="uk-text-break uk-margin-remove uk-text-capitalize" v-else>
											{{supplier.name}}								
										</p>
									</div>

									

									<div class="grid-gutter uk-width-small">
										<div class="uk-width-1-1">
											<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
												{{supplier.quantity | number('0,0') | pluralize('Unit')}}
											</p>
										</div>
									</div>

									<div class="grid-gutter uk-width-small">
										<div class="uk-width-1-1">
											<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
												{{supplier.cost_price | currency(`${emporium.currency} `)}}
											</p>
										</div>
									</div>

									<div class="grid-gutter uk-width-small">
										<div class="uk-width-1-1">
											<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
												{{supplier.discount_received | currency(`${emporium.currency} `)}}
											</p>
										</div>
									</div>


									<div class="grid-gutter uk-width-small">
										<div class="uk-width-1-1">
											<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small" :class="supplier.amount_outstanding > 0 ? 'uk-text-danger' : ''">
												{{supplier.amount_outstanding | currency(`${emporium.currency} `)}}
											</p>
										</div>
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
										We could not find any supplier stats at the moment
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
</template>
<script>
import supplier_stats from "@/mixins/stats/suppliers" 
export default{
	head(){
		return {
			title : `${this.$appName} | ${this.emporium.name} - Suppliers Report`
		}
	},

	mixins : [supplier_stats],
	async created(){
		await this.getStats()
	}
};
</script>
