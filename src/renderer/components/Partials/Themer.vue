<template>
	<div class="click" @click="$store.dispatch('theme/setTheTheme', (colorMode === 'uk-light' ? 'uk-dark' : 'uk-light'))">
		<slot>
			<div class="square-30">
				<span class="mdi lni-large color" :class="colorMode === 'uk-light' ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"></span>
			</div>
		</slot>
	</div>
</template>