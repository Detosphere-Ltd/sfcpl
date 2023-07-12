<template>
	<div>
		<div class="uk-padding-small uk-padding-remove-horizontal uk-flex uk-flex-wrap">
			<div class="grid-gutter uk-width-expand">
				<div class="uk-width-1-1">
					<p class="uk-text-truncate uk-margin-remove">
						<nuxt-link :to="{name: 'suppliers-supplier', params:{supplier: supplier.uuid}}" class="highlight-text underlined" v-if="can('view-suppliers')">
							{{supplier.name}}
						</nuxt-link>
						<template v-else>
							{{supplier.name}}
						</template>
					</p>
				</div>
			</div>
			<div class="grid-gutter uk-width-small">
				<div class="uk-width-1-1">
					<p class="uk-text-truncate uk-margin-remove">
						<template v-if="supplier.email">
							{{supplier.email}}
						</template>
						<template v-else-if="supplier.phone">
							{{supplier.phone}}
						</template>
						<template v-else>
							N/A
						</template>
					</p>
				</div>
			</div>

			<div class="grid-gutter uk-width-small">
				<div class="uk-width-1-1">
					<p class="uk-text-truncate uk-margin-remove">
						{{ supplier.total_cost_price | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>

			<div class="grid-gutter uk-width-small">
				<div class="uk-width-1-1">
					<p class="uk-text-truncate uk-margin-remove" :class="{ 'uk-text-danger uk-text-bold' : supplier.total_amount_outstanding}">
						{{supplier.total_amount_outstanding | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>

			<div class="grid-gutter uk-width-small">
				<div class="uk-width-1-1">
					<p class="uk-text-truncate uk-margin-remove">
						{{ supplier.total_discount_received | currency(`${emporium.currency} `)}}
					</p>
				</div>
			</div>

		</div>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/suppliers"
export default{
	mixins : [bindProps]
};
</script>
