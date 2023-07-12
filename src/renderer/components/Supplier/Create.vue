<template>
	<div>
		<div class="uk-margin-small-top">
			
			<div class="tiny-margin-bottom">
				<span class="uk-text-small">
					Supplier Name
				</span>
				<input type="text" class="uk-input uk-form-large uk-text-small uk-text-bold" placeholder="Supplier name" v-model="supplierForm.name" :disabled="loading" @focus="$store.dispatch('validation/clearErrors')">
				<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.name">
					{{errors.name[0]}}
				</span>
			</div>

			<div class="tiny-margin-bottom">
				<span class="uk-text-small">
					Email Address
				</span>
				<input type="text" class="uk-input uk-form-large uk-text-small uk-text-bold" placeholder="Email Address" v-model="supplierForm.email" :disabled="loading" @focus="$store.dispatch('validation/clearErrors')">
				<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.email">
					{{errors.email[0]}}
				</span>
			</div>

			<div class="tiny-margin-bottom">
				<span class="uk-text-small">
					Phone Number
				</span>
				<input type="text" class="uk-input uk-form-large uk-text-small uk-text-bold" placeholder="Phone Number" v-model="supplierForm.phone" :disabled="loading" @focus="$store.dispatch('validation/clearErrors')">
				<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.phone">
					{{errors.phone[0]}}
				</span>
			</div>

			<div class="tiny-margin-bottom">
				<span class="uk-text-small">
					Country
				</span>
				<input type="text" class="uk-input uk-form-large uk-text-small uk-text-bold" placeholder="Country" v-model="supplierForm.country" :disabled="loading" @focus="$store.dispatch('validation/clearErrors')">
				<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.country">
					{{errors.country[0]}}
				</span>
			</div>	

			<div class="tiny-margin-bottom">
				<span class="uk-text-small">
					City
				</span>
				<input type="text" class="uk-input uk-form-large uk-text-small uk-text-bold" placeholder="City" v-model="supplierForm.city" :disabled="loading" @focus="$store.dispatch('validation/clearErrors')">
				<span class="uk-text-extra-small uk-text-danger uk-margin-small-left" v-if="errors && errors.city">
					{{errors.city[0]}}
				</span>
			</div>


			<hr class="uk-margin-small-bottom uk-margin-small-top">
			<div>
				<slot></slot>
				<button class="uk-button uk-border-rounded uk-button-success-deep" :disabled="loading" @click.prevent="createManufacturer">
					<partials-loader v-if="loading"></partials-loader>
					<span class="uk-text-small uk-text-bold" v-else>Record Supplier</span>
				</button>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	data(){
		return {
			loading : false,
			supplierForm:{
				name : '',
				country : '',
				phone : '',
				city : '',
				email : ''
			}
		}
	},


	methods : {
		async createManufacturer(){
			this.loading = true
			if (!this.supplierForm.phone) {
				this.supplierForm.phone = null
			}
			await this.$axios.$post('/suppliers', this.supplierForm)
			.then(async ()=>{
				await this.$store.dispatch('partners/getSuppliers')
				await this.$emit('supplier-created')
			})
			.catch(()=>{
			// fail silently				
		})
			.finally(()=>{
				this.loading = false
			})
		}
	}

};
</script>
