<template>
	<div>
		<div class="click" @click="showModal = true">
			<slot name="action-button">
				<button class="uk-button uk-button-primary uk-button-small">
					Setup New Branch 
				</button>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="true" overlay-class="uk-overlay-primary" attach=".app" @before-close="$emit('done'); state = 'FILLING'">
			<div class="uk-width-1-1 uk-margin-top uk-flex uk-flex-column uk-flex-middle">
				<div class="uk-width-1-1 uk-width-large@s  background bordered  rounded raised-deep uk-animation-scale-up uk-animation-fast uk-margin-auto-vertical">
					<div class="tiny-padding border-bottom">
						<h5 class="uk-text-center uk-margin-remove">
							Set Up A Branch
						</h5>
					</div>
					<div class="tiny-padding modal-content">
						
						<div class="uk-flex uk-flex-column uk-flex-middle uk-padding-small" v-if="state === 'SUCCESS'">
							<div class="square-80 uk-flex uk-flex-middle uk-flex-column uk-flex-center uk-border-circle">
								<span class="mdi mdi-check-circle lni-extra-large"></span>
							</div>
							<h4 class="uk-margin-small uk-text-center">
								Your branch was sucessfully set up!
							</h4>
							<p class="uk-margin-remove uk-text-center">
								You can proceed to manage your all branches or of your store or set up another.
							</p>
							
							<div class="uk-padding-small uk-width-1-1 uk-flex uk-flex-center ">
								<button class="uk-button uk-button-view uk-button-small" @click="initNew">
									Set Up Another Branch 
								</button>
							</div>
						</div>

						<div v-else>
							
							<div v-if="state === 'FAILED'" class="uk-background-danger uk-padding-small uk-flex uk-flex-wrap uk-flex-top rounded">
								<div class="uk-width-expand">
									<h5 class="uk-margin-remove uk-text-white uk-text-bold">
										Something went wrong!
									</h5>
									<p class="uk-text-small uk-margin-remove-bottom uk-text-white">
										We could not set up your branch. Please try again. 
									</p>
								</div>
							</div>

							<div class="uk-grid-collapse uk-flex uk-flex-wrap uk-child-width-1-1 uk-inline" @keydown="state = 'FILLING'; $store.dispatch('validation/clearErrors')">
								<div class="grid-padding uk-width-1-1 uk-flex uk-flex-column">
									<span class="text-small uk-margin-small-bottom">
										Branch Name
									</span>
									<input type="text" class="uk-input uk-form-large"  v-model="form.name" required placeholder="Name this Branch">
									<span class="text-small uk-text-danger tiny-margin-top" v-if="errors && errors.name">
										{{errors.name[0]}}
									</span>
								</div>
								<div class="grid-padding uk-width-1-1@m uk-flex uk-flex-column">
									<span class="text-small uk-margin-small-bottom">
										State / City / Region
									</span>
									<input type="text" class="uk-input uk-form-large"  v-model="form.city" placeholder="City location">
									<span class="text-small uk-text-danger tiny-margin-top" v-if="errors && errors.city">
										{{errors.city[0]}}
									</span>
								</div>

								<div class="grid-padding uk-width-1-1 uk-flex uk-flex-column uk-inline">
									<span class="text-small uk-margin-small-bottom">
										Branch Manager (Optional)
									</span>

									<div class="uk-width-1-1 uk-padding-small uk-background-muted uk-border-rounded uk-form-large click uk-text-small uk-flex uk-flex-middle uk-input" @click="staffModal = true">
										<div v-if="form.manager_id">
											<div class="square-30 uk-margin-small-right uk-background-primary raised uk-border-circle uk-background-cover" :style="`background-image: url(${selectedManager[0].avatar.large})`" v-if="selectedManager[0].avatar && selectedManager[0].avatar.large !== undefined">
											</div>
											<span class="square-30 uk-margin-small-right uk-background-primary raised uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle" v-else>
												<span class="uk-text-small uk-text-bold uk-text-uppercase uk-text-white">
													{{selectedManager[0].name.substring(0,1)}}
												</span>
											</span>
										</div>
										<span>
											{{form.manager_id ? selectedManager[0].name : 'Select a staff member to manage this branch'}}
										</span>
									</div>
									<span class="text-small uk-text-danger tiny-margin-top" v-if="errors && errors.manager_id">
										{{errors.manager_id[0]}}
									</span>

									<div class="chip uk-position-center-right uk-position-z-index uk-background-danger rounded uk-margin-right uk-margin-small-top uk-flex uk-flex-column uk-flex-center uk-flex-middle click" @click="form.manager_id = ''" v-if="form.manager_id">
										<small class="uk-text-white">Remove</small>
									</div>

								</div>

							</div>
						</div>
					</div>
					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger uk-margin-small-right" @click="showModal = false">
							Close
						</button>

						<button type="submit" class="uk-button uk-button-primary uk-border-rounded" :disabled="!form.name || !form.city" @click.prevent="setupBranch">
							<template v-if="!loading">
								Setup Branch
							</template>

							<partials-loader v-if="loading"></partials-loader>
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>

		<vue-final-modal v-model="staffModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-large-top" :esc-to-close="true" overlay-class="uk-overlay-primary rounded">
			<div class="uk-card rounded bordered background raised-deep uk-margin-auto uk-margin-auto-vertical uk-margin-remove-top uk-width-1-1 uk-inline uk-margin-auto uk-width-large@m uk-padding-remove">

				<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
					<h5 class="uk-margin-remove uk-text-bold">
						Select Branch Manager
					</h5>
					<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="staffModal = false">
						Close
					</a>
				</div>

				<div class="uk-width-1-1 uk-flex uk-flex-column uk-padding-remove-top modal-content uk-overflow-auto">

					<div class="uk-grid-collapse uk-child-width-1-1 uk-width-1-1 uk-flex uk-flex-column tiny-padding" uk-grid>
						<div class="grid-padding uk-padding-remove-horizontal uk-width-1-1" v-show="staff && staff.length > 0">
							<input type="text" class="uk-input uk-width-1-1 uk-text-small" placeholder="Search for staff member" v-model="searchTerm">
						</div>
						<div v-if="staff && staff.length > 0">
							<div v-if="filteredStaff.length > 0">
								<div v-for="member in filteredStaff" :key="member.uuid" class="grid-padding bordered uk-margin-small-bottom uk-border-rounded click" :class="member.uuid === $auth.user.uuid ? 'uk-background-view' : 'staff-member'"  @click="( () => {form.manager_id = member.uuid; staffModal = false; searchTerm = ''})">
									<div  class="uk-width-1-1 uk-flex">


										<div class="square-30 uk-margin-small-right tiny-margin-left uk-border-circle uk-background-cover" :style="`background-image: url(${member.avatar.large})`" v-if="member.avatar && member.avatar.large !== undefined">

										</div>

										<div class="square-30 uk-border-circle uk-background-primary uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right tiny-margin-left" v-else>
											<span class="mdi mdi-account uk-text-white"></span>
										</div>


										<div class="uk-width-expand uk-flex uk-flex-column">
											<h6 class="uk-margin-remove">
												{{member.name}}
											</h6>

											<span class="text-small">
												{{member.email}}
											</span>

											<span class="text-small uk-text-capitalize">
												{{member.role && member.role.name !== undefined ? member.role.name : 'No Role'}}
											</span>



											<span class="label bordered tiny-margin-top uk-margin-auto-right" v-if="member.uuid === $auth.user.uuid">
												<small>
													Selection Disabled
												</small>
											</span>
										</div>

										<div class="chip bordered uk-border-rounded uk-margin-auto-vertical">
											<span class="text-small">
												Select
											</span>
										</div>
									</div>
								</div>
							</div>

							<div v-else class="uk-padding-small uk-background-view uk-border-rounded">
								<h5 class="uk-text-bold uk-margin-remove">
									No Staff Found. 
								</h5>
								<p class="uk-margin-small">
									Your search query did not return any staff members
								</p>
								<button class="uk-button uk-button-small" @click="searchTerm = ''">
									Clear Search
								</button>
							</div>
						</div>

						<div class="uk-padding-small bordered uk-border-rounded" v-if="!hasCreatedOtherUsers">

							<h4>
								It looks lonely here.
							</h4>

							<p>
								Add members of your staff and start delegating them to perform specific actions within your business. 
							</p>

							<staff-actions-add-new @needs-to-refresh="$store.dispatch('staff/getStaff')" v-if="can('create-users')"></staff-actions-add-new>
						</div>

					</div>
				</div>
			</div>
		</vue-final-modal>



	</div>
</template>
<script>
import {mapGetters} from "vuex"
import { base , create } from "@/mixins/branches/actions"
import { searchStaff } from "@/mixins/staff/utils"
export default {
	data(){
		return {
			showModal : false,
			staffModal : false
		}
	},

	mixins : [create, base, searchStaff],

	computed:{
		...mapGetters({
			staff : 'staff/otherStaff'
		})
	},
}
</script>
