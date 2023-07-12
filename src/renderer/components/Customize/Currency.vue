<template>
	<div class="uk-width-1-1">
		<div class="uk-width-1-1">
			<h5 class="uk-text-bold uk-margin-small-bottom uk-margin-remove-top">
				Currency		
			</h5>
			<p class="uk-margin-remove-top uk-margin-small-bottom uk-text-small">
				Set the default currency for your store. This setting applies to all connected branches and is used to format all amounts in your store.
			</p>
		</div>

		<div class="uk-width-1-1">
			<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Currency" v-model="currency" @focus="$store.dispatch('validation/clearErrors')">
			<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.currency">
				{{errors.currency[0]}}
			</span>
		</div>

		<button class="uk-button uk-button-primary uk-border-rounded  uk-margin-small-top" :disabled="updating" @click.prevent="updateInfo({currency:currency})">
			<template v-if="!updating">
				Set Currency
			</template>
			<partials-loader v-else></partials-loader>
		</button>
	</div>
</template>
<script>
import { updateCurrency, performUpdate } from "@/mixins/customize"
export default{
	mixins: [ updateCurrency, performUpdate],
	mounted(){
		this.currency = this.application.currency ? this.application.currency : ''
	}
};
</script>
