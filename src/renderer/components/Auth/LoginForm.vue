<template>
	<form class="uk-width-1-1 uk-grid-collapse uk-preserve-color uk-flex uk-flex-wrap" uk-grid @submit.prevent="loginUser">
		<div class="uk-width-1-1 grid-padding">
			<h5 class="uk-text-bold">
				Enter a email and password combination to continue.
			</h5>
		</div>
		<div class="uk-width-1-1 grid-padding">
			<!-- <span class="uk-text-meta uk-text-dark">
				Email Address
			</span> -->
			<input type="email" class="uk-input uk-form-large uk-text-small" required v-model="form.email"  @focus="$store.dispatch('validation/clearErrors')" placeholder="Email Address">
			<span class="uk-text-danger uk-text-small" v-if="errors && errors.email">
				{{errors.email[0]}}
			</span>
		</div>

		<div class="uk-width-1-1 grid-padding uk-inline">
			<!-- <span class="uk-text-meta uk-text-dark">
				Password
			</span> -->
			
			
			<input :type="passwordFieldType" class="uk-input uk-form-large uk-text-small" required v-model="form.password" @focus="$store.dispatch('validation/clearErrors')" placeholder="Password">

			<a @click="passwordFieldType === 'password' ? passwordFieldType = 'text' : passwordFieldType = 'password'  " class="uk-position-center-right uk-margin-right  uk-label background pill uk-border-rounded">
				<small>
					{{ passwordFieldType === 'password' ? 'Show' : 'Hide'}}
				</small>
			</a>



			<span class="uk-text-danger uk-text-small" v-if="errors && errors.password">
				{{errors.password[0]}}
			</span>
		</div>

		<div class="uk-width-1-1 grid-padding">
			<button class="uk-button uk-button-primary uk-button-large uk-width-1-1 uk-border-rounded" :disabled="loading">
				<template v-if="!loading">
					Clock In
				</template>

				<partials-loader v-if="loading"></partials-loader>
			</button>
		</div>
		<div class="uk-width-1-1 grid-padding">
			<hr>
		</div>

		<div class="uk-width-1-1 grid-padding">
			<nuxt-link :to="{name: 'reset-password'}">
				<span class=" underlined">
					I forgot my password.
				</span>
			</nuxt-link>
		</div>

	</form>			
</template>
<script>
import login from "@/mixins/auth/login"
import {showHidePass} from "@/mixins/utils"
export default{
	mixins : [login, showHidePass]
};
</script>
