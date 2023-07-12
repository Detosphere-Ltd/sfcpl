<template>
	<div>
		<div class="uk-flex uk-flex-middle uk-flex-between">
			<p class="uk-text-truncate uk-text-bold uk-margin-remove-vertical uk-margin-small-right uk-text-capitalize">
				{{tag.name}}
			</p>

			<div class="uk-flex uk-flex-middle">
				<tag-actions-edit class="tiny-margin-right" :tag="tag" @updated="$emit('needs-to-refresh')"></tag-actions-edit>
				<tag-actions-purge :tag="tag" @purged="$emit('needs-to-refresh')"></tag-actions-purge>
			</div>
		</div>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/productTag"
export default{
	mixins : [bindProps]
};
</script>
