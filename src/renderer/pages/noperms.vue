<template>
	<div class="uk-padding  uk-width-1-1 uk-flex uk-flex-column uk-flex-center">
		<partials-themer></partials-themer>
		<div class="uk-width-large@m  uk-width-1-1 uk-margin-auto uk-padding background rounded-lg bordered">
			<h2 class="uk-text-bold">
				Hey, {{$auth.user.name}}
			</h2>
			<p class="uk-margin-remove">
				You do not have any role / permissions assigned to you currently. 
			</p>
			<div class="border-top uk-margin-top uk-margin-bottom"></div>
			<p class="uk-margin-remove-bottom">
				Contact the person-in-charge of assigning roles within your store setting to grant you the necessary access rights.
			</p>


			<div class="uk-flex uk-flex-center uk-padding-small border-top uk-margin-top uk-padding-remove-bottom">

				<button class="uk-button uk-button-danger uk-border-rounded" @click="logout" :disabled="loading">
					<partials-loader v-if="loading"></partials-loader>
					<template v-else>
						Sign Me Out
					</template>
				</button>
			</div>
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
