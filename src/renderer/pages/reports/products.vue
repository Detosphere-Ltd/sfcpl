<template>
	<div>
		<nav class="uk-flex border-bottom">

			<nuxt-link :to="{name: 'reports-products'}" class="tab uk-width-auto" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove">

				<span>
					Overview
				</span>

			</nuxt-link>

			<nuxt-link :to="{name: 'reports-performance-products'}" class="tab uk-width-auto" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove">

				<span>
					Product Performance
				</span>

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
