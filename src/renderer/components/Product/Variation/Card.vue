<template>
	<div>

		<div class="uk-width-1-1 uk-flex uk-flex-middle">
			<div class="grid-gutter uk-width-medium uk-margin-auto-right">
				<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
					{{variant.name | variationize}}
				</p>
			</div>

			<div class="uk-flex uk-width-auto uk-margin-small-right" v-if="variant.name !== 'default'">
				<product-variation-actions-toggle-status :variant="variant" @status-changed="$emit('needs-to-refresh')" class="uk-margin-small-right" v-if="can('change-variation-active-status')"></product-variation-actions-toggle-status>
				<product-variation-actions-edit :variant="variant" @updated="$emit('needs-to-refresh')" v-if="can('update-variations')"></product-variation-actions-edit>
			</div>

			<div class="grid-gutter uk-width-small uk-margin-auto-left">
				<p class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					{{variant.code}}
				</p>
			</div>

			<div class="grid-gutter  uk-width-small uk-flex">
				<span class="label uk-margin-auto-right" :class="variant.active ? 'label-success' : 'label-danger'">
					<span>
						{{variant.active ? "Active" : "Deactivated" }}
					</span>
				</span>
			</div>


			<div class="grid-gutter uk-width-small uk-visible@l">
				<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
					{{$moment(variant.created_at).format('DD MMM, YYYY')}}
				</p>
			</div>

			<div class="grid-gutter uk-width-small uk-visible@xl">
				<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
					{{ variant.created_by && variant.created_by.name ? variant.created_by.name : 'System Admin'  }}
				</p>
			</div>

		</div>	

	</div>
</div>
</template>
<script>
import {bindProps} from "@/mixins/product/variant"
export default{
	mixins : [bindProps]
};
</script>
