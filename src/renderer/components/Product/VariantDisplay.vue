<template>
	<div>

		<div class="uk-width-1-1 uk-flex uk-flex-middle">




			<div class="grid-gutter uk-width-expand">
				<div class="uk-width-auto">
					<p class="uk-text-break uk-margin-remove text-small">
						{{variant.variation.name}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-break uk-margin-remove text-small">
						{{variant.code}}
					</p>
				</div>
			</div>
			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-break uk-margin-remove text-small">
						{{ (variant.unit_selling_price) | currency(`${emporium.currency} `)}} / Unit
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-break uk-margin-remove text-small">
						{{variant.store_quantity | number('0,0') | pluralize('Unit')}}
					</p>
				</div>
			</div>

			<div class="grid-gutter uk-visible@xl">
				<div class="uk-width-small">
					<p class="uk-text-break uk-margin-remove text-small">
						{{variant.warehouse_quantity | number('0,0') | pluralize('Unit')}}
					</p>
				</div>
			</div>
			<div class="grid-gutter uk-visible@xl">
				<div class="uk-width-small">
					<p class="uk-text-break uk-margin-remove text-small">
						{{variant.branch_quantity | number('0,0') | pluralize('Unit')}}
					</p>
				</div>
			</div>
			<div class="grid-gutter uk-visible@xl">
				<div class="uk-width-small">
					<p class="uk-text-break uk-margin-remove text-small">
						{{variant.quantity_in_transition | number('0,0') | pluralize('Unit')}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-x-small uk-flex uk-flex-center">
					<stock-health :product="variant"></stock-health>
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