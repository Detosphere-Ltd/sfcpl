<template>
	<div>
		<div class="uk-width-1-1">

			<nav class="uk-flex border-bottom">

				<nuxt-link :to="{name: 'reports-stock'}" class="tab uk-width-auto highlight-text" exact-active-class="tabActive uk-text-bold">
					Store Stock Report
				</nuxt-link>

				<nuxt-link :to="{name: 'reports-stock-warehouse'}" class="tab uk-width-auto highlight-text" exact-active-class="tabActive uk-text-bold">
					Warehouse Stock Report
				</nuxt-link>


				<nuxt-link :to="{name: 'reports-stock-branch'}" class="tab uk-width-auto highlight-text" exact-active-class="tabActive uk-text-bold">
					Branches Stock Report
				</nuxt-link>

			</nav>
		</div>
		<div>
			<nuxt-child/>
		</div>
	</div>
</template>
<script>
export default {
	
}
</script>
