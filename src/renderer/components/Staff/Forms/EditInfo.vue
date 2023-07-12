<template>
	<div>
		<div class="uk-flex uk-flex-middle">
			<slot name="default"></slot>
			<h5 class="uk-text-bold tiny-margin-bottom uk-margin-remove">
				Edit Profile Info
			</h5>
		</div>
		<form class="uk-grid-collapse uk-flex uk-flex-wrap" uk-grid @submit.prevent="updateStaffInfo" @keydown="state = 'FILLING'; $store.dispatch('validation/clearErrors')">
			<div class="grid-padding uk-width-1-1">
				<span class="uk-text-small">
					Name
				</span>
				<input type="text" class="uk-input uk-text-small uk-form-large" v-model="form.name" placeholder="Enter staff full name" required>
				<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.name">
					{{errors.name[0]}}
				</span>
			</div>
			<div class="grid-padding uk-width-1-2@m">
				<span class="uk-text-small">
					Email Address
				</span>
				<input type="email" class="uk-input uk-text-small uk-form-large" v-model="form.email" required placeholder="Enter staff's email address">
				<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.email">
					{{errors.email[0]}}
				</span>
			</div>
			<div class="grid-padding uk-width-1-2@m" >
				<span class="uk-text-small">
					Phone Number
				</span>
				<input type="text" class="uk-input uk-text-small uk-form-large" v-model="form.phone"  placeholder="Enter staff's mobile number">
				<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.phone">
					{{errors.phone[0]}}
				</span>
			</div>

			<div class="grid-padding uk-width-1-1">
				<span class="uk-text-small">
					Gender
				</span>
				<select class="uk-select uk-form-large uk-text-small" v-model="form.gender">
					<option disabled selected>Select Gender</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
					<option value="other">Other</option>
				</select>
				<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.gender">
					{{errors.gender[0]}}
				</span>
			</div>

			<div class="grid-padding uk-width-1-1">
				<span class="uk-text-small">
					Date of birth
				</span>
				<input type="date" class="uk-input uk-form-large uk-text-small" v-model="form.date_of_birth">
				<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.date_of_birth">
					{{errors.date_of_birth[0]}}
				</span>
			</div>
			<div class="grid-padding uk-width-1-1">
				


				<button class="uk-button uk-button-danger" @click.prevent="$emit('cancel-update')">
					Cancel
				</button>

				<button type="submit" class="uk-button uk-button-primary">
					<template v-if="!loading">
						Update
					</template>

					<partials-loader v-if="loading"></partials-loader>
				</button>
			</div>
		</form>
	</div>
</template>
<script>
import { bindProps} from "@/mixins/staff/singleton"
import { base , update } from "@/mixins/staff/actions"
export default{
	mixins : [update, base, bindProps],
	data(){
		return {
			
		}
	},
};
</script>
