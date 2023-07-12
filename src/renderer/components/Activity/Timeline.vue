<template>
	<div>
		<!-- writing-mode: vertical-lr;transform: rotate(180deg); -->
		
		<slot name="timelineDay"></slot>
		<div class="uk-width-1-1 border-bottom tiny-padding uk-padding-remove-horizontal uk-padding-remove-top uk-flex uk-flex-column">
			<activity-card class="tiny-padding" v-for="(entry, key) in timeline" :key="key" :class="key < timeline.length -1 ? 'border-bottom' : ''" :activity="entry"></activity-card>
		</div>
	</div>
</template>
<script>
export default {
	props : {
		timeline : {
			type : Array,
			required : true
		}
	}	
}
</script>
