<template>
	<div class="uk-flex">
		<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered tiny-margin-right click" @click="$router.go(-1)">
			<span class="mdi mdi-chevron-left lni-large"></span>
		</div>

		<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered tiny-margin-right click" @click="$router.go(1)">
			<span class="mdi mdi-chevron-right lni-large"></span>
		</div>
		<!-- <div class="square-35 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-background-white click" @click="$router.go(+1)">
			<span class="mdi mdi-chevron-right lni-large"></span>
		</div> -->
	</div>
</template>
<script>
export default {

}
</script>