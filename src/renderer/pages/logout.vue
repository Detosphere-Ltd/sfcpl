<template>
	<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle uk-flex-center">
		<div class="uk-width-large@m uk-flex uk-flex-column uk-margin-large-top">
			<div class="uk-width-1-1 uk-width-large@m uk-flex uk-flex-column uk-flex-middle uk-padding">
				<partials-avatar :media="$auth.user.avatar" :size="80" class="uk-margin-bottom"></partials-avatar>

				<p>
					Hey there {{$auth.user.name}},
				</p>
				<h4 class="uk-text-bold uk-text-center">
					Are you sure you want to sign out?
				</h4>
				<p class="uk-text-dark uk-margin-remove uk-text-center">
					You will be required to enter your account credentials to sign back in.
				</p>
				

				<button class="uk-button uk-button-danger uk-border-rounded uk-button-large uk-margin-top" @click="logout" :disabled="loading">
					<partials-loader v-if="loading"></partials-loader>
					<template v-else>
						Yes. Sign Me Out.
					</template>
				</button>
			</div>
		</div>
	</div>
</template>
<script>
export default{
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
