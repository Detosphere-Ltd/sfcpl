<template>
	<main :class="colorMode">
		<div class="app content" v-if="$nuxt.isOnline">
			<nuxt />
		</div>
		<partials-offline v-else></partials-offline>
	</main>
</template>
<script>
export default{
};
</script>
