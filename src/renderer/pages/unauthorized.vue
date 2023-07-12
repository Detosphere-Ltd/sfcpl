<template>
	<div class="uk-padding-small uk-margin-medium-top">

		<div class="uk-width-1-1 uk-width-large@m uk-margin-auto uk-padding   uk-flex uk-flex-column uk-flex-middle">
			<img src="/illustrations/unauthorized.png" alt="">
			<img src="/unauthorized.svg" class="uk-margin-bottom">
			<h3 class="uk-text-bold uk-text-center uk-margin-remove-top">
				Unauthorized Access
			</h3>
			<p class="uk-text-center uk-margin-remove-top">
				We have detected that you are a corporate level user but you are accessing your account from a branch application. Please logout and use the control panel application that comes with {{$appName}} instead.
			</p>

			<button class="uk-button uk-button-danger uk-border-rounded" @click="logout" :disabled="loading">
				<partials-loader v-if="loading"></partials-loader>
				<template v-else>
					Logout
				</template>
			</button>

		</div>
	</div>
</template>
<script>
export default{
	layout : 'noperms',
	data(){
		return {
			loading : false
		}
	},

	methods : {
		async logout(){
			this.loading = true
			await this.$auth.logout()
			.finally(()=>{
				this.loading = false
			})
		}
	}
};
</script>
