<template>
	<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center">
		<div v-if="stage === 'CHANGE'">
			<div class="grid-padding">
				<p class="uk-margin-remove">
					Enter the code that was sent to <span class="uk-text-bold uk-text-dark underlined">{{form.email}}</span> and enter a new password to continue. 
				</p>
			</div>
			<form class="uk-width-1-1 uk-grid-collapse" uk-grid @submit.prevent="changePassword">
				<div class="uk-width-1-1 grid-padding">
					<input type="text" class="uk-input uk-form-large uk-text-small" required v-model="form.token" placeholder="Code / Token">
					<span class="uk-text-meta uk-text-danger uk-margin-small-left" v-if="errors && errors.token">
						{{errors.token[0]}}
					</span>
				</div>

				<div class="uk-width-1-1 grid-padding uk-inline">
					<a @click="passwordFieldType === 'password' ? passwordFieldType = 'text' : passwordFieldType = 'password'  " class="uk-position-center-right uk-margin-right  uk-label background pill uk-border-rounded">
						<small>
							{{ passwordFieldType === 'password' ? 'Show' : 'Hide'}}
						</small>
					</a>
					<input :type="passwordFieldType" class="uk-input uk-form-large uk-text-small" required v-model="form.password" placeholder=" Enter A New Password">
					<span class="uk-text-meta uk-text-danger uk-margin-small-left" v-if="errors && errors.password">
						{{errors.password[0]}}
					</span>
				</div>


				<div class="uk-width-1-1 grid-padding">
					<button class="uk-button uk-button-primary uk-button-large uk-width-1-1 uk-border-rounded" type="submit" :disabled="loading">
						<partials-loader v-if="loading"></partials-loader>
						<template v-else>
							Reset Password
						</template>
					</button>
				</div>
				<div class="uk-width-1-1 grid-padding">
					<hr>
				</div>
				<div class="uk-width-1-1 grid-padding">
					<nuxt-link :to="{name: 'login'}">
						<span class=" underlined">
							Clock In
						</span>
					</nuxt-link>
				</div>
			</form>	
		</div>


		<div class="uk-width-1-1 uk-margin-top uk-width-1-1 uk-flex uk-flex-column uk-flex-center" v-else-if="stage === 'SENT'">
			<div class="uk-padding uk-background-primary-op rounded bordered">
				<p class="uk-margin-remove">
					A code has been sent to <span class="uk-text-bold uk-text-dark underlined">{{form.email}}</span>. <br>
					Check your spam folder if you cannot find the code in your inbox. Click on "I have  a code" when you find it.
				</p>
				<button class="uk-button uk-button-primary uk-border-rounded uk-margin-top" @click="stage = 'CHANGE'">
					
					I have the code

				</button>
			</div>

			<a @click="stage = 'START'" class="uk-margin-small-top chip bordered-dark uk-border-rounded uk-flex-middle">
				<span class="mdi mdi-chevron-left lni-large "></span>
				<span class=" grid-padding">
					Change Email Address / Resend Code
				</span>
			</a>
		</div>


		<form class="uk-width-1-1 uk-grid-collapse" uk-grid @submit.prevent="requestPasswordChange" v-else>
			<div class="uk-width-1-1 grid-padding">
				<h5 class="uk-text-bold">
					Enter your email address to request a token and recover your password.
				</h5>
			</div>

			<div class="uk-width-1-1 grid-padding">
				<input type="email" class="uk-input uk-form-large uk-text-small" required v-model="form.email" placeholder="Email Address" @focus="$store.dispatch('validation/clearErrors')">
				<span class="uk-text-meta uk-text-danger uk-margin-small-left" v-if="errors && errors.email">
					{{errors.email[0]}}
				</span>
			</div>


			<div class="uk-width-1-1 grid-padding">
				<button class="uk-button uk-button-primary uk-button-large uk-width-1-1 uk-border-rounded" type="submit" :disabled="loading">
					<partials-loader v-if="loading"></partials-loader>
					<template v-else>
						Request Reset Token
					</template>
				</button>
			</div>
			<div class="uk-width-1-1 grid-padding">
				<hr>
			</div>
			<div class="uk-width-1-1 grid-padding">
				<nuxt-link :to="{name: 'login'}">
					<span class=" underlined">
						Clock In
					</span>
				</nuxt-link>
			</div>
		</form>	
	</div>		
</template>
<script>
import { bindProps, resetPassword} from "@/mixins/auth/password"
import {showHidePass} from "@/mixins/utils"
export default{
	mixins : [bindProps,resetPassword,showHidePass]
};
</script>

<style>
.resetForms {
	min-height: 350px;
}
</style>