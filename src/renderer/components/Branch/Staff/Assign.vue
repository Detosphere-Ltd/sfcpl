<template>
	<div>
		<button class="uk-button uk-button-view" @click="showModal = true">
			Assign Staff from Directory
		</button>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="true" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s">

					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Assign Staff To Branch
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
							Close
						</a>
					</div>
					<div class="uk-padding-small uk-overflow-auto modal-content">


						<div class="uk-grid-collapse uk-flex uk-flex-wrap" uk-grid @keydown=" $store.dispatch('validation/clearErrors')"  v-if="$store.getters['staff/unAssignedStaff'] && $store.getters['staff/unAssignedStaff'].length > 0">
							<div class="grid-padding uk-width-1-1">
								<span class="uk-text-small">
									Select members from the staff list below to assign them to this branch. Only unassigned staff are shown here.
								</span>
							</div>

							<div class="grid-padding uk-width-1-1">
								<label v-for="member in $store.getters['staff/unAssignedStaff']" :key="member.uuid" class="grid-padding bordered uk-margin-small-bottom uk-border-rounded click uk-flex uk-flex-middle" :class="form.users.includes(member.uuid) ? 'uk-background-primary-op' : ''">
									<div class="uk-width-auto uk-light">
										<input type="checkbox" class="uk-checkbox uk-border-circle square-20 uk-margin-small-right uk-button-view bordered" :value="member.uuid" v-model="form.users">
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

										<div class="square-20 tiny-margin-right tiny-margin-left uk-border-circle uk-background-cover" :style="`background-image: url(${member.avatar.large})`" v-if="member.avatar && member.avatar.large !== undefined">
										</div>

										<div class="square-20 uk-border-circle expresso uk-flex uk-flex-column uk-flex-center uk-flex-middle tiny-margin-right tiny-margin-left" v-else>
											<span class="mdi mdi-account uk-text-white"></span>
										</div>
									</div>
								</label>
							</div>

							<div class="tiny-padding uk-flex uk-flex-center border-top uk-padding-remove-bottom uk-width-1-1">
								<button type="submit" class="uk-button uk-button-primary uk-border-rounded" :disabled="form.users.length < 1" @click.prevent="attachMembers">
									<template v-if="!loading">
										Assign Staff To Branch
									</template>
									<partials-loader v-if="loading"></partials-loader>
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
									There are no staff members that can be assigned to this branch at the moment.
								</p>

								<nuxt-link :to="{name : 'staff-new'}" class="uk-button uk-button-view uk-button-small">
									Add / Import staff to your business.
								</nuxt-link>
							</div>
						</template>
					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {mapGetters} from "vuex"
import {bindProps , branchStaff} from "@/mixins/branches/singleton"
export default{
	mixins : [bindProps],

	computed : {
		...mapGetters({
			branchRoles : "access/branchRoles"
		})
	},

	data(){
		return {
			showModal : false,
			loading : false,
			form : {
				users : []
			},
		}
	},


	methods : {
		async attachMembers(){
			this.loading = true
			await this.$axios.$post(`/branches/${this.branch.uuid}/users`, this.form)
			.then(async ()=>{
				this.$message.success(`Users assigned to branch`, 4)
				this.form = { users : [] }
				await this.$store.dispatch('staff/getStaff')
				this.showModal = false
				this.$emit('done')
			})
			.catch((err)=>{
				this.$message.error(`We were unable to add the selected user(s) to this branch. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	},
	mounted(){
		this.form.branch_id = this.branch.uuid
	}
};
</script>
