<template>
	<form class="uk-width-1-1 uk-grid-collapse uk-flex uk-flex-wrap" uk-grid @submit.prevent="changePassword">
		<div class="grid-padding uk-width-1-1">
			<div class="uk-width-1-1">
				<span class="uk-text-small">
					Enter You Current Password
				</span>
				<input :type="showPassword ? 'text' : 'password'" class="uk-input uk-form-large uk-text-small" placeholder="Old Password" v-model="passwordFileds.current_password">
				<span class="uk-text-danger uk-text-small" v-if="errors && errors.current_password">
					{{errors.current_password[0]}}
				</span>
			</div>
		</div>

		<div class="grid-padding uk-width-1-1">
			<div class="uk-width-1-1">
				<span class="uk-text-small">
					Enter You New Password
				</span>
				<input :type="showPassword ? 'text' : 'password'" class="uk-input uk-form-large uk-text-small" placeholder="New Password" v-model="passwordFileds.password">
				<span class="uk-text-danger uk-text-small" v-if="errors && errors.password">
					{{errors.password[0]}}
				</span>
			</div>
		</div>

		<div class="grid-padding uk-width-1-1">
			<label class="click uk-flex uk-flex-middle uk-light">
				<input type="checkbox" class="uk-checkbox square-20 uk-border-circle tiny-margin-right bordered" v-model="showPassword">	
				<span class="uk-flex uk-flex-column uk-width-expand">
					Show Password
				</span>
			</label>
		</div>

		<div class="grid-padding uk-width-1-1">
			<button class="uk-button uk-button-primary uk-button-large uk-border-rounded" type="submit">
				<partials-loader v-if="loading"></partials-loader>
				<template v-else>
					Change My Password
				</template>
			</button>
		</div>
	</form>
</template>
<script>
import {updatePassword} from "@/mixins/profile"
export default{
	mixins : [updatePassword]
};
</script>
