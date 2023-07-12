<template>
	<div :style="{width : dimension, height: dimension}" class="uk-cover-container uk-background-top-center uk-border-circle background">
		<img :src="media && media.medium !== undefined ? media.medium : '/avatar.png'" alt="Avatar Image" uk-cover class="uk-border-circle">
	</div>
</template>
<script>
export default{
	props : {
		size : {
			default : 40,
		},

		media : undefined
	},

	computed : {
		dimension(){
			return `${this.size}px`
		}
	}
};
</script>
