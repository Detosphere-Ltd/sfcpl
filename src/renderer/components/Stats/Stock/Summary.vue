<template>
	<div class="uk-border-rounded background tiny-padding">
		<h4 class="tiny-padding uk-padding-remove-bottom">
			Inventory
		</h4>
		<div class="border-bottom uk-margin-small-bottom"></div>
		<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle tiny-padding"  v-if="loading">
			<loaders-spinner></loaders-spinner>
			<p class="uk-margin-top">
				Loading stats...
			</p>
		</div>
		<template v-else>
			<template v-if="failed">
				<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle uk-padding">
					<span class="mdi mdi-alert-box uk-text-danger uk-margin-small-bottom lni-extra-large"></span>
					<span class="chip bordered uk-border-rounded click uk-text-small" @click="getStats('statistics/stock')">
						<span class="tiny-margin-right tiny-margin-left">
							Failed to load stock stats. Click to retry
						</span>
					</span>
				</div>
			</template>
			<div class="uk-width-1-1 uk-flex uk-flex-column stats-list" v-else>
				<template v-if="(stats && stats.length > 0 )|| (stats && Object.keys(stats).length > 0)  ">
					<template v-for="(stat, key, index) in stats">


						<div class="uk-width-1-1 tiny-padding uk-padding-remove-top stat-item" :key="index" v-if="!stat.hasOwnProperty('amount') && !stat.hasOwnProperty('number')">
							<div class="uk-text-capitalize uk-flex uk-flex-between uk-flex-wrap uk-flex-top uk-margin-small-bottom">
								<span class="uk-text-bold uk-text-capitalize">
									{{stat}} {{ key.split('_').join(' ') }} 
								</span> 
							</div>
							<div class="uk-flex" v-if="can('view-products')">
								<nuxt-link :to="{name: 'inventory-catalog'}" class="chip uk-background-primary uk-border-rounded">
									<span class="uk-text-white">
										Manage Catalog
									</span>
								</nuxt-link>
							</div>	
						</div>

						<template v-else>
							<div class="uk-flex uk-flex-column tiny-padding stat-item">
								<span class="uk-text-capitalize uk-margin-small-bottom uk-text-bold">
									{{ key.split('_').join(' ') }}  
								</span>

								<span>
									{{stat.number | number('0,0') }} {{stat.number | pluralize('Item') }} worth {{ stat.amount | currency(`${emporium.currency} `) }}
								</span>
							</div>
						</template>

					</template>

				</template>

				<div class="tiny-padding uk-flex uk-flex-top bordered uk-border-rounded" v-else>
					<div class="uk-width-auto tiny-margin-right tiny-margin-bottom uk-flex uk-flex-middle uk-flex-center uk-flex-middle">
						<span class="mdi mdi-package lni-mid-large"></span>
					</div>
					<div class="uk-width-expand uk-flex uk-flex-middle grid-padding uk-padding-remove-vertical">
						<div class="uk-width-expand uk-flex uk-flex-column">
							<h6 class="uk-text-bold uk-margin-remove">
								No statistics found.
							</h6>
							<p class="uk-margin-remove">
								There are no stats available yet for your inventory.
							</p>
						</div>

						<div class="square-30 bordered uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle click" @click="getStats('statistics/stock')">
							<span class="mdi mdi-reload"></span>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>
<script>
import basic from "@/mixins/stats/generic"
export default{
	mixins : [basic],
	async mounted(){
		await this.getStats('statistics/stock')
	}
};
</script>
