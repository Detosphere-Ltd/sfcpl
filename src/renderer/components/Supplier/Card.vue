<template>
	<div class="tiny-padding">
		<div class="uk-width-1-1 uk-flex uk-flex-middle">
			<div class="grid-gutter uk-width-expand uk-margin-auto-right">
				<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
					{{supplier.name}}
				</p>
			</div>

			<div class="grid-gutter uk-margin-right">
				<div class="uk-flex uk-flex-middle" v-if="can('change-supplier-active-status') || can('update-suppliers') || can('view-purchases')">
					<nuxt-link class="uk-margin-right highlight-text underlined text-small" :to="{name: 'suppliers-supplier', params : {supplier : supplier.uuid}}" v-if="can('view-purchases')">
						View Purchases
					</nuxt-link>
					<supplier-actions-edit class="uk-margin-small-right" :supplier="supplier" @supplier-updated="$emit('needs-to-refresh')" v-if="can('update-suppliers')"></supplier-actions-edit>

					<supplier-actions-toggle-status :supplier="supplier" @supplier-status-changed="$emit('needs-to-refresh')" v-if="can('change-supplier-active-status')"></supplier-actions-toggle-status>
					
				</div>
			</div>

			<div class="grid-gutter uk-width-small uk-margin-auto-left">
				<div class="uk-width-1-1">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						<template v-if="supplier.country || supplier.city">
							{{supplier.country ? `${supplier.country},` : ''}} 	{{supplier.city ? `${supplier.city}` : ''}}
						</template>
						<template v-else>
							---
						</template>
					</p>
				</div>
			</div>

			

			<div class="grid-gutter uk-width-small">
				<div class="uk-width-1-1">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small">
						{{supplier.phone ? supplier.phone : '---'}}
					</p>
				</div>
			</div>
			<div class="grid-gutter uk-width-small">
				<div class="uk-width-1-1">
					<p class="uk-text-truncate uk-margin-remove  uk-text-small">
						{{supplier.email ? supplier.email : '---'}}
					</p>
				</div>
			</div>
			<div class="grid-gutter uk-width-small  uk-visible@xl">
				<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-left">
					<span class="label uk-margin-auto-right" :class="supplier.active ? 'uk-background-success' : 'uk-background-danger'">
						<span class="uk-text-white">
							{{supplier.active ? "Active" : "Deactivated" }}
						</span>
					</span>
				</div>
			</div>



			<div class="grid-gutter uk-visible@xl uk-width-small">
				<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
					{{ supplier.created_by && supplier.created_by.name ? supplier.created_by.name : 'System Admin'  }}
				</p>
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
