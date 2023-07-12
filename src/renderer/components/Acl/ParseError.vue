<template>
	<div>
		<div v-if="errorData.response.status === 403"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle">
			<span class="mdi mdi-lock-alert uk-heading-large uk-margin-remove-top uk-margin-small-bottom"></span>

			<h4 class="uk-text-center uk-margin-remove uk-text-uppercase light-font">Access Denied</h4>

			<hr class="uk-width-small uk-margin-auto uk-margin-small-top uk-margin-small-bottom hr-black">

			<p class="uk-text-center">
				{{ errorMessages[errorData.response.status] ? errorMessages[errorData.response.status] : 'Something went wrong' }}.
			</p>

			<slot name="further-action">
				<nuxt-link :to="{name: 'home'}" class="uk-button uk-button-primary">
					Goto Dashboard
				</nuxt-link>
			</slot>
		</div>

		<div v-else class="uk-flex uk-flex-column uk-flex-middle">
			<h1 class="uk-text-center uk-text-bold uk-margin-remove">
				{{errorData.response.status}}
			</h1>
			<p class="uk-text-center">
				{{ errorMessages[errorData.response.status] ? errorMessages[errorData.response.status] : 'Something went wrong' }}.
			</p>
			<slot name="further-action">
				<nuxt-link :to="{name: 'home'}" class="uk-button uk-button-primary">
					Goto Dashboard
				</nuxt-link>
			</slot>
		</div>

	</div>
</template>
<script>
const messages = {
	"403" : `You do not have the right permissions to access this page.`,
	"404" : `The resource you were looking for could not be found`,
	"500" : `There was an error on the server. Please try again or report the issue.`
}
export default{
	props:{
		errorData : {
			required : true,
			type : Error
		}
	},

	computed : {
		errorMessages(){
			return messages
		}
	}
};
</script>
