<template>
	<div>
		<nav class="uk-flex border-bottom">

			<nuxt-link :to="{name: 'reports-sales'}" class="tab uk-width-auto highlight-text" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove">
				Product Sales Report
			</nuxt-link>

			<nuxt-link :to="{name: 'reports-sales-branches'}" class="tab uk-width-auto highlight-text" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove">
				Branch Sales Report
			</nuxt-link>

		</nav>
		<div>
			<nuxt-child/>
		</div>
	</div>
</template>
<script>
export default {
	
}
</script>
