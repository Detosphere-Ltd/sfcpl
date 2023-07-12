<template>
	<div>
		<nav class="uk-flex border-bottom">

			<nuxt-link :to="{name: 'reports-compare'}" class="tab uk-width-auto highlight-text" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove">
				Compare Products

			</nuxt-link>

			<nuxt-link :to="{name: 'reports-compare-branches'}" class="tab uk-width-auto highlight-text" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove">
				Compare Branches
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
