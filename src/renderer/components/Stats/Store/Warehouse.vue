<template>
	<div class="uk-border-rounded background tiny-padding">
		<h4 class="tiny-padding uk-padding-remove-bottom">
			Warehouse Statistics
		</h4>
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
				{{stats}}
				<!-- <template v-for="(stat, key, index) in stats">
					
					<div class="uk-width-1-1 grid-padding stat-item" :key="index">
						<div class="uk-text-capitalize uk-flex uk-flex-column uk-flex-wrap uk-flex-top">
							<h4 class="uk-text-capitalize tiny-margin-bottom uk-text-bold">
								{{stat | currency(`${emporium.currency} `)}}  
							</h4> 
							<span>
								{{ key.split('_').join(' ') }}
							</span>
						</div>	
					</div>
				</template> -->

				<!-- <div class="stat-item tiny-padding uk-padding-remove-horizontal uk-flex uk-flex-middle">
					<nuxt-link :to="{name: 'branches'}" class="chip uk-background-primary uk-border-rounded tiny-margin-right" v-if="can('view-branches')">
						<span class="uk-text-white">
							Manage Branches
						</span>
					</nuxt-link>

					<nuxt-link :to="{name: 'staff'}" class="chip background bordered uk-border-rounded tiny-margin-right" v-if="can('view-users')">
						<span>
							Manage Staff
						</span>
					</nuxt-link>
				</div> -->
			</div>
		</template>
	</div>
</template>
<script>
import {warehouse} from "@/mixins/stats/warehouse"
export default{
	mixins : [warehouse],
	async mounted(){
		await this.getStats()
	}
};
</script>
