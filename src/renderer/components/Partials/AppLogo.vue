<template>
	<div class="uk-border-circle uk-background-center-center" :class="`square-${size}`">
		<img :src="logo" class="uk-width-1-1 uk-height-1-1 uk-object-cover uk-border-circle">
	</div>
</template>
<script>
import app from "@/mixins/app"
export default{
	mixins: [app],
	props : {
		size : {
		default : 50,
		}
	},
	computed:{
		logo(){
			if (this.application && this.application.logo && this.application.logo.large) {
				return this.application.logo.large
			}
			return `/logo.svg`
		}
	}
};
</script>
