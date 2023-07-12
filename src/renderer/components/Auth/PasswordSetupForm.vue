<template>
	<div class="uk-width-1-1 uk-grid-collapse" uk-grid>
		<div class="uk-width-1-1 grid-padding">
			<h4>
				Setup Your Password.
			</h4>
			<p>
				Hi there {{$auth.user.name}}. You are required to setup a password for future account access.
			</p>
		</div>
		

		<div class="uk-width-1-1 grid-padding uk-flex">
			<a @click="passwordFieldType === 'password' ? passwordFieldType = 'text' : passwordFieldType = 'password'  " class="chip background  uk-border-rounded bordered">
				<span class="text-small">
					{{ passwordFieldType === 'password' ? 'Show' : 'Hide'}} Password
				</span>
			</a>
		</div>

		<div class="uk-width-1-1 grid-padding">
			<input :type="passwordFieldType" class="uk-input uk-form-large uk-border-rounded" required v-model="form.password" @focus="$store.dispatch('validation/clearErrors')" placeholder="New Password">
			<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.password">
				{{errors.password[0]}}
			</span>
		</div>


		<div class="uk-width-1-1 grid-padding">
			<input :type="passwordFieldType" class="uk-input uk-form-large uk-border-rounded" required v-model="form.password_confirmation" @focus="$store.dispatch('validation/clearErrors')" placeholder="Confirm New Password">
			<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.password_confirmation" >
				{{errors.password_confirmation[0]}}
			</span>
		</div>


		<div class="uk-width-1-1 grid-padding">
			<button class="uk-button uk-button-primary uk-button-large uk-width-1-1 uk-border-rounded" :disabled="loading" @click.prevent="setupPassword">
				<partials-loader v-if="loading"></partials-loader>
				<template v-else>
					Setup Password
				</template>
			</button>
		</div>

	</div>			
</template>
<script>
import {showHidePass} from "@/mixins/utils"
import {password} from "@/mixins/setup"
export default{
	mixins : [password , showHidePass]
};
</script>
