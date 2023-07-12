<template>
	<div>
		<h3>
			Stock Report
		</h3>
		<p>
			Stock report in your store.
		</p>
		{{stats}}
	</div>	
</template>
<script>
import store from "@/mixins/stats/stock/store"
export default {
	mixins : [store],
	async mounted(){
		await this.getData()
	}
}
</script>
