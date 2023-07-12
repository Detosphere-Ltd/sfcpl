<template>
	<div class="uk-border-rounded background tiny-padding">
		<h4 class="tiny-padding uk-padding-remove-bottom">
			Top Products By Sales
		</h4>

		<!-- <div class="tiny-padding border-top border-bottom uk-padding-remove-horizontal uk-padding-remove-bottom"></div> -->
		<div class="border-bottom"></div>

		<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle uk-padding"  v-if="loading">
			<loaders-spinner></loaders-spinner>
			<p class="uk-margin-top">
				Loading stats...
			</p>
		</div>
		<template v-else>
			<template v-if="failed">
				<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle">
					<span class="mdi mdi-alert-box uk-text-danger uk-margin-small-bottom lni-extra-large"></span>
					<span class="chip bordered uk-border-rounded click uk-text-small" @click="getStats()">
						<span class="tiny-margin-right tiny-margin-left">
							Failed to load stock stats. Click to retry
						</span>
					</span>
				</div>
			</template>
			<div class="uk-width-1-1 uk-flex uk-flex-column stats-list" v-else>
				
				<template v-if="stats && stats.length > 0">
					<div class="uk-overflow-auto stat-item">
						<table class="uk-table uk-table-small uk-table-divider">
							<thead>
								<tr>
									<th class="uk-table-expand">Product</th>
									<th>Frequency</th>
									<th>Quantity</th>
									<th>Value</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(stat, key, index) in stats" :key="index">
									<td class="uk-flex uk-flex-column">
										<span class="uk-text-bold">
											{{stat.product_name | capitalize}}
										</span>
										<span>
											{{stat.variation_name}} - {{stat.code}}
										</span>
									</td>


									<td>
										{{ stat.frequency | pluralize('Time')}}
									</td>
									<td>
										{{ stat.quantity | pluralize('Unit')}}
									</td>
									<td>
										{{ stat.amount | currency(`${emporium.currency} `)}}
									</td>
								</tr>

							</tbody>
						</table>
					</div>
					<div class="stat-item tiny-padding uk-padding-remove-horizontal uk-flex uk-flex-center">
						<nuxt-link :to="{name: 'branches-branch-sales', params :{branch : branch.uuid }}" class="uk-button uk-button-primary" v-if="can(['view-branches', 'view-sales'])">
							View Sales Records
						</nuxt-link>
					</div>
				</template>

				<div class="tiny-padding uk-flex uk-flex-top bordered uk-border-rounded uk-margin-top" v-else>
					<div class="uk-width-auto tiny-margin-right tiny-margin-bottom uk-flex uk-flex-middle uk-flex-center uk-flex-middle">
						<span class="mdi mdi-package lni-mid-large"></span>
					</div>
					<div class="uk-width-expand uk-flex uk-flex-middle grid-padding uk-padding-remove-vertical">
						<div class="uk-width-expand uk-flex uk-flex-column">
							<h6 class="uk-text-bold uk-margin-remove">
								No statistics found.
							</h6>
							<p class="uk-margin-remove">
								There are no product sale statistics to show at this moment.
							</p>
						</div>

						<div class="square-30 bordered uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle click" @click="getStats">
							<span class="mdi mdi-reload"></span>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>
<script>
import product_stats from "@/mixins/stats/branch/topProducts"
export default{
	mixins : [product_stats],
	async mounted(){
		await this.getStats()
	}
};
</script>
