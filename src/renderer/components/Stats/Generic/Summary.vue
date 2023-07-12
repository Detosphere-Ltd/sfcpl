<template>
	<div>
		<div class="uk-width-1-1 uk-flex uk-flex-center"  v-if="loading">
			<loaders-spinner></loaders-spinner>
		</div>
		<template v-else>
			<template v-if="failed">
				<div class="uk-width-1-1 uk-flex uk-flex-center">
					<span class="chip bordered pill click uk-text-small" @click="getStats">
						<span class="tiny-margin-right tiny-margin-left">
							Failed to load stats. Click to retry
						</span>
					</span>
				</div>
			</template>
			<div class="uk-width-1-1 uk-flex uk-flex-around" v-else>
				<template v-for="(stat, key, index) in stats">
					<div class="uk-padding-small uk-padding-remove-vertical" :key="index">
						{{stat}} {{key}} 
					</div>
				</template>
			</div>
		</template>
	</div>
</template>
<script>
import basic from "@/mixins/stats/basic"
export default{
	mixins : [basic],
	async mounted(){
		await this.getStats()
	}
};
</script>
