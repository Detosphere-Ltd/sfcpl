<template>

	<div class="tiny-padding uk-flex uk-flex-middle">
		<div class="grid-gutter uk-width-medium uk-margin-auto-right">
			<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small uk-text-truncate">

				<nuxt-link class="highlight-text underlined" :to="{name: 'suppliers-supplier', params : {supplier : stat.uuid}}">
					{{ stat.name }}
				</nuxt-link>
			</p>
		</div>

		<div class="grid-gutter uk-width-medium">
			<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small uk-text-truncate">
				{{ stat.total_cost_price | currency(`${emporium.currency} `)}}
			</p>
		</div>

		<div class="grid-gutter  uk-width-small">
			<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small uk-text-truncate">
				{{ stat.total_discount_received | currency(`${emporium.currency} `)}}
			</p>
		</div>


		<div class="grid-gutter uk-width-small uk-visible@l">
			<p class="uk-text-truncate uk-margin-remove uk-text-capitalize uk-text-small uk-text-truncate">
				{{ stat.total_amount_outstanding | currency(`${emporium.currency} `)}}
			</p>
		</div>
	</div>

</template>
<script>
export default{
	props : {
		stat : {
			type : Object,
			required : true
		}
	}
};
</script>
