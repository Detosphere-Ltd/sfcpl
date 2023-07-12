<template>
	<div class="uk-width-1-1 uk-flex">
		<div class="uk-width-1-2 uk-margin-right">
			<h5 class="uk-text-bold uk-margin-small-bottom uk-margin-remove-top">
				Expiry Policy	
			</h5>
			<div>
				<p class="uk-margin-remove uk-text-small">
					Customize when to automatically deactivate products with expiry dates across all your branches.
				</p>
				
			</div>
		</div>

		<div class="uk-width-expand uk-flex uk-flex-wrap">
			<div class="uk-width-1-1 uk-margin-small-bottom">
				<h6 class="uk-margin-remove">
					<span>
						Your currently setting is 
					</span>
					<span class="uk-text-capitalize uk-text-bold">
						{{`${$auth.user.store.expiry_interval.number} ${$auth.user.store.expiry_interval.unit}`}}
					</span>
				</h6>
			</div>
			<div class="uk-width-expand uk-flex uk-flex-column uk-margin-small-right">
				<span class="uk-text-small uk-margin-small-bottom">
					Enter Period Value
				</span>
				<input type="number" class="uk-input uk-form-large uk-text-small" placeholder="Value" v-model="expiry_interval.number" @focus="cleanup">
				<span class="uk-text-extra-small uk-text-danger" v-if="errors && errors['expiry_interval.number']">
					{{errors['expiry_interval.number'][0]}}
				</span>
			</div>

			<div class="uk-width-expand uk-flex uk-flex-column">
				<span class="uk-text-small uk-margin-small-bottom">
					Select Period Unit
				</span>

				<select class="uk-select uk-form-large uk-text-small" v-model="expiry_interval.unit" @focus="cleanup">
					<option value="" selected disabled>Select Duration Unit</option>
					<option value="days">Days</option>
					<option value="weeks">Weeks</option>
					<option value="months">Month(s)</option>
				</select>
				<span class="uk-text-extra-small uk-text-danger" v-if="errors && errors['expiry_interval.unit']">
					{{errors['expiry_interval.unit'][0]}}
				</span>
			</div>
			<div class="uk-width-1-1 uk-flex uk-flex-right" v-if="expiry_interval.number !== $auth.user.store.expiry_interval.number || $auth.user.store.expiry_interval.unit !==  expiry_interval.unit">
				<button class="uk-button uk-button-primary uk-border-rounded  uk-margin-small-top" :disabled="updating" @click.prevent="updateInfo({expiry_interval : expiry_interval })">
					<template v-if="!updating">
						Save Settings
					</template>
					<partials-loader v-else></partials-loader>
				</button>
			</div>
		</div>

		
	</div>
</template>
<script>
import { updateExpirySettings, performUpdate } from "@/mixins/customize"
export default{
	mixins: [ updateExpirySettings, performUpdate],
	mounted(){
		this.expiry_interval.unit = this.$auth.user.store.expiry_interval && this.$auth.user.store.expiry_interval.unit  ? this.$auth.user.store.expiry_interval.unit  : ''

		this.expiry_interval.number = this.$auth.user.store.expiry_interval && this.$auth.user.store.expiry_interval.number  ? this.$auth.user.store.expiry_interval.number  : ''
	}
};
</script>
