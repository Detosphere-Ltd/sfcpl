<template>
	<div class="uk-width-1-1 uk-inline">
		<div class="tiny-padding">
			<small>
				Basic Store Details				
			</small>
		</div>
		<div class="uk-flex uk-flex-wrap">
			<div class="uk-width-1-2@m tiny-padding">
				<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Store Name" v-model="form.name" @focus="$store.dispatch('validation/clearErrors')">
				<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.email">
					{{errors.name[0]}}
				</span>
			</div>

			<div class="uk-width-1-2@m tiny-padding">
				<input type="email" class="uk-input uk-form-large uk-text-small" placeholder="Email Address" v-model="form.email" @focus="$store.dispatch('validation/clearErrors')">
				<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.email">
					{{errors.email[0]}}
				</span>
			</div>


			<div class="uk-width-1-2@m tiny-padding">
				<input type="text" class="uk-input uk-form-large uk-text-small" placeholder="Phone Number" v-model="form.phone" @focus="$store.dispatch('validation/clearErrors')">
				<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.phone">
					{{errors.phone[0]}}
				</span>
			</div>



			<div class="uk-width-1-2@m tiny-padding">
				<input type="url" class="uk-input uk-form-large uk-text-small" placeholder="Website" v-model="form.website" @focus="$store.dispatch('validation/clearErrors')">
				<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.website">
					{{errors.website[0]}}
				</span>
			</div>

			<div class="tiny-padding uk-flex uk-flex-right border-top uk-width-1-1">
				<button class="uk-button uk-button-primary uk-border-rounded" :disabled="updating" @click.prevent="updateInfo(form)">
					Apply Update				
				</button>
			</div>

			
		</div>

		<div class="background uk-position-cover center uk-position-z-index" v-if="updating">
			<partials-loader></partials-loader>
			<span class="uk-margin-top">
				Updating Basic Store Details...
			</span>
		</div>
	</div>
</template>
<script>
import { basic, performUpdate } from "@/mixins/customize"
export default{
	mixins: [basic, performUpdate],
	async mounted(){
		await Object.assign(this.form , ...Object.keys(this.form).map(k => k in this.application && { [k]: this.application[k] }))
	}
};
</script>
