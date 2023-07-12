<template>
	<div class="rounded bordered background uk-width-1-1 uk-width-2xlarge@s">
		<div class="uk-padding-small">
			<div class="uk-width-1-1">
				<h5 class="uk-text-bold uk-margin-small-bottom uk-margin-remove-top">
					VAT Settings (%)
				</h5>
				<p class="uk-margin-remove-top uk-margin-small-bottom uk-text-small">
					Set Value Added Tax Percentage for your store. When configured, this value  can be applied at the point of sale.
				</p>
			</div>

			<div class="uk-width-1-1">
				<input type="number" class="uk-input uk-form-large uk-text-small" placeholder="Currency" v-model="vat_percent" @focus="$store.dispatch('validation/clearErrors')" max="100" maxlength="3">
				<span class="uk-text-small uk-text-danger" v-if="errors && errors.vat_percent">
					{{errors.vat_percent[0]}}
				</span>
			</div>

			<button class="uk-button uk-button-primary uk-border-rounded  uk-margin-small-top" :disabled="updating" @click.prevent="updateInfo({vat_percent:vat_percent})">
				<template v-if="!updating">
					Save Settings
				</template>
				<partials-loader v-else></partials-loader>
			</button>

			
		</div>
	</div>
</template>
<script>
import { VatPolicy, performUpdate } from "@/mixins/customize"
export default{
	mixins: [ VatPolicy, performUpdate ],
	mounted(){
		this.vat_percent = this.application.vat_percent ? this.application.vat_percent : ''
	}
};
</script>
