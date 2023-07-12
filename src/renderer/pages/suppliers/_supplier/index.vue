<template>
	<div>
		<supplier-purchases :supplier="supplier"></supplier-purchases>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/suppliers"
export default{
	mixins : [bindProps]
};
</script>
