<template>
	<div>
		<button class="uk-button uk-button-primary uk-button-small" @click="showModal = true">
			Transfer Ownership
		</button>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="false" overlay-class="uk-overlay-primary" @before-open="$fetch" attach=".app"  :click-to-close="false">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s uk-inline">
					<div class="uk-position-cover bordered uk-border-rounded uk-position-z-index uk-flex uk-flex-column uk-flex-middle uk-flex-center background" v-if="loading">

						<loaders-spinner></loaders-spinner>
						<p class="uk-margin-small-top uk-text-center">
							Transferring Ownership... 
						</p>
						
					</div>
					<div v-if="$fetchState.pending" class="uk-padding uk-flex uk-flex-column uk-flex-middle">
						<loaders-spinner></loaders-spinner>
						<p class="uk-margin-top uk-text-center">
							Loading Staff...
						</p>
					</div>
					<div v-else>
						<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
							<h5 class="uk-margin-remove uk-text-bold">
								Transfer Ownership
							</h5>
							<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
								Close
							</a>
						</div>
						<div>



							<div v-if="$store.getters['staff/otherCorporateStaff'] && $store.getters['staff/otherCorporateStaff'].length > 0">
								<form class="uk-grid-collapse uk-flex uk-flex-wrap" v-if="!confirm">
									<div class="grid-padding uk-width-1-1">
										<span class="uk-text-small">
											Transfer Ownership to A Staff Member
										</span>
									</div>

									<div class="grid-padding uk-width-1-1">
										<label v-for="member in $store.getters['staff/otherCorporateStaff']" :key="member.uuid" class="grid-padding bordered uk-margin-small-bottom uk-border-rounded click uk-flex uk-flex-middle">
											<div class="uk-width-auto uk-light">
												<input type="radio" class="uk-radio uk-border-circle square-20 uk-margin-small-right uk-button-view bordered" :value="member.uuid" v-model="form.user">
											</div>
											<div  class="uk-width-1-1 uk-flex uk-width-expand uk-flex-between uk-flex-middle">
												<div class="uk-width-expand uk-flex uk-flex-column">
													<h6 class="uk-margin-remove uk-text-truncate">
														{{member.name}}
													</h6>
													<span class="uk-text-small">
														{{member.email}}
													</span>
												</div>

												<partials-avatar class="tiny-margin-right tiny-margin-left" :size="20" :media="member.avatar"></partials-avatar>

											</div>
										</label>
									</div>
								</form>

								<div class="uk-padding-small uk-flex uk-flex-column" v-else>
									<div class="uk-background-danger uk-border-rounded uk-padding-small uk-text-white uk-margin-small-bottom">
										<h5>
											Proceed with Caution
										</h5>
										<ol>
											<li>You cannot reverse this action.</li>
											<li>You will not have any roles until the new owner / someone else who has the rights to assign you a role does so.
											</li>
											<li>You will be signed out after this operation.</li>
										</ol>
									</div>
									<span class="uk-margin-small-bottom">
										Enter your Password to confirm Transfer
									</span>
									<input type="password" v-model="form.password" class="uk-input">
									<span class="text-small uk-text-danger" v-if="errors && errors.password">
										{{errors.password[0]}}
									</span>
								</div>

								<div class="tiny-padding border-top uk-flex uk-flex-center">
									<button v-if="!confirm" class="uk-button uk-button-primary" :disabled="!form.user" @click="confirm = true">
										Next
									</button>

									<button v-else class="uk-button uk-button-primary" :disabled="loading || !form.password || form.password.length < 6" @click.prevent="transferOwnership">
										Transfer Ownership
									</button>
								</div>
							</div>
							<template v-else>
								<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding">
									<span class="mdi mdi-account-group-outline lni-extra-large uk-margin-bottom"></span>
									<h6 class="uk-text-center uk-margin-small-bottom">
										Sorry! No staff found.
									</h6>
									<p class="uk-text-center">
										There are no staff members that can be promoted to the Owner role. Only Corporate Level Staff Members can be assigned this role.
									</p>

									<nuxt-link :to="{name : 'staff-new'}" class="uk-button uk-button-view uk-button-small" v-if="can('create-users')">
										Add / Import staff to your business.
									</nuxt-link>
								</div>
							</template>
						</div>
					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>	
</template>
<script>
export default {
	fetchOnServer : false,
	async fetch(){
		await this.$store.dispatch('staff/getStaff')
	},
	data(){
		return {
			showModal : false,
			form : { 
				user : '',
				password : ''
			},
			confirm : false,
			loading : false
		}
	},

	methods : {
		async transferOwnership(){
			this.loading = true,
			this.$axios.$post(`/profile/transfer-ownership`, this.form)
			.then(async ()=>{
				this.$message.success(`Ownership Transfer. Signing you out...`, 5)
				this.showModal = false
				await this.$auth.logout()
				await this.$router.push({name: 'login'})
			})
			.catch(err => {
				this.$message.error(`Failed to transfer ownership. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 5)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
}
</script>
