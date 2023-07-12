<template>
	<div class="uk-border-rounded background tiny-padding">
		<h4 class="tiny-padding uk-padding-remove-bottom uk-padding-remove-top uk-padding-remove-horizontal">
			Transfers
		</h4>
		<p class="uk-margin-small-bottom grid-padding uk-padding-remove-top">
			Your Store Transfer Statistics
		</p>
		<div class="border-bottom"></div>
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
					<span class="chip bordered uk-border-rounded click uk-text-small" @click="getStats()">
						<span class="tiny-margin-right tiny-margin-left">
							Failed to load stock stats. Click to retry
						</span>
					</span>
				</div>
			</template>
			<div class="uk-width-1-1 uk-flex uk-flex-column stats-list" v-else>
				
				
				<template v-for="(stat, key, index) in stats">
					
					<div class="uk-width-1-1 grid-padding stat-item" :key="index">
						<div class="uk-text-capitalize uk-flex uk-flex-between uk-flex-wrap uk-flex-top">
							<span>
								{{ stat.status.split('_').join(' ') }}
							</span>
							
							<span class="uk-text-capitalize">
								{{ stat.frequency | number('0,0') }}
							</span>


							
						</div>	
					</div>
				</template>

				<div class="stat-item tiny-padding uk-padding-remove-horizontal uk-flex uk-flex-middle">
					<nuxt-link :to="{name: 'inventory-transfers'}" class="uk-button uk-button-view uk-button-small tiny-margin-right" v-if="can('view-transfers')">
						Manage Transfers
					</nuxt-link>
				</div>
			</div>
		</template>
	</div>
</template>
<script>
import transferStats from "@/mixins/stats/store/transfers"
export default{
	mixins : [transferStats],
	async mounted(){
		await this.getStats()
	}
};
</script>
