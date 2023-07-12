<template>
	<div>
		
		<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle tiny-padding background bordered"  v-if="loading">
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
			
			<div class="uk-width-1-1 " v-else>

				<div class="uk-padding-small uk-background-primary-op uk-border-rounded">
					
					<h3 class="uk-margin-remove uk-text-bold">
						{{ stats['Total Number of Sales Made'] | number('0,0')}}  
					</h3>
					<span class="text-small">
						Total Sales Processed
					</span>
				</div>
			</div>
		</template>
	</div>
</template>
<script>
import basic from "@/mixins/stats/store"
export default{
	mixins : [basic],
	async created(){
		await this.getStats()
	}
};
</script>
