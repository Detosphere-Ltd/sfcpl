<template>
	<div class="uk-width-1-1">
		<div class="uk-flex uk-flex-column uk-flex-middle uk-margin-auto uk-padding-large" v-if="state === 'SUCCESS'">
			<div class="square-80 uk-flex uk-flex-middle uk-flex-column uk-flex-center uk-border-circle">
				<span class="mdi mdi-check-circle lni-extra-large"></span>
			</div>
			<h4 class="uk-margin-small">
				Your branch was sucessfully set up!
			</h4>
			<p class="uk-margin-remove">
				You can proceed to manage your all branches or of your store or set up another.
			</p>
			<hr class="uk-width-1-1 border-color">
			<div class="uk-padding-small uk-padding-remove-top">
				<nuxt-link class="uk-button uk-button-view" :to="{name: 'branches'}">			
					Manage Branches
				</nuxt-link>
				<button class="uk-button uk-button-primary" @click="initNew">
					Set Up New Branch 
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
			<form class="uk-grid-collapse uk-flex uk-flex-wrap uk-child-width-1-1 uk-inline" uk-grid @submit.prevent="setupBranch" @keydown="state = 'FILLING'; $store.dispatch('validation/clearErrors')">
				<div class="grid-padding uk-width-1-1">
					<span class="uk-text-small">
						Branch Name
					</span>
					<input type="text" class="uk-input uk-text-small uk-form-large"  v-model="form.name" required>
					<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.name">
						{{errors.name[0]}}
					</span>
				</div>
				<div class="grid-padding uk-width-1-1@m">
					<span class="uk-text-small">
						State / City / Region
					</span>
					<input type="text" class="uk-input uk-text-small uk-form-large"  v-model="form.city">
					<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.city">
						{{errors.city[0]}}
					</span>
				</div>

				<div class="grid-padding uk-width-1-1 uk-inline">
					<span class="uk-text-small">
						Branch Manager (Optional)
					</span>
					<div class="uk-width-1-1 uk-padding-small uk-background-muted uk-border-rounded uk-form-large click uk-text-small uk-flex uk-flex-middle uk-input" @click="showModal = true">
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
					<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.manager_id">
						{{errors.manager_id[0]}}
					</span>

					<div class="chip uk-position-center-right uk-position-z-index uk-background-danger rounded uk-margin-right uk-margin-small-top uk-flex uk-flex-column uk-flex-center uk-flex-middle click" @click="form.manager_id = ''" v-if="form.manager_id">
						<small class="uk-text-white">Clear</small>
					</div>

				</div>
				
				<div class="grid-padding uk-width-1-1">
					<button type="submit" class="uk-button uk-button-large uk-button-primary uk-border-rounded" :disabled="!form.name || !form.city">
						<template v-if="!loading">
							Setup Branch
						</template>

						<partials-loader v-if="loading"></partials-loader>
					</button>
				</div>
			</form>
		</div>

		<div>
			<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-large-top" :esc-to-close="true" overlay-class="uk-overlay-primary rounded">
				<div class="uk-card rounded bordered background raised-deep uk-margin-auto uk-margin-auto-vertical uk-margin-remove-top uk-width-1-1 uk-inline uk-margin-auto uk-overflow-auto uk-width-large@m uk-padding-remove modal-content">

					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Select Branch Manager
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
							Close
						</a>
					</div>

					<div class="uk-padding-small uk-width-1-1 uk-flex uk-flex-column uk-padding-remove-top">
						
						<div class="uk-grid-collapse uk-child-width-1-1 uk-width-1-1 uk-flex uk-flex-column tiny-padding" uk-grid>
							<div class="grid-padding uk-padding-remove-horizontal uk-width-1-1" v-show="staff && staff.length > 0">
								<input type="text" class="uk-input uk-width-1-1 uk-text-small" placeholder="Search for staff member" v-model="searchTerm">
							</div>
							<div v-if="staff && staff.length > 0" class="max-height-large uk-overflow-auto">
								<div v-if="filteredStaff.length > 0">
									<div v-for="member in filteredStaff" :key="member.uuid" class="grid-padding bordered uk-margin-small-bottom rounded click" :class="member.uuid === $auth.user.uuid ? 'uk-background-view' : 'staff-member'"  @click="( () => {form.manager_id = member.uuid; showModal = false})">
										<div  class="uk-width-1-1 uk-flex">
											

											<div class="square-30 tiny-margin-right tiny-margin-left uk-border-circle uk-background-cover" :style="`background-image: url(${member.avatar.large})`" v-if="member.avatar && member.avatar.large !== undefined">
												
											</div>

											<div class="square-30 uk-border-circle uk-background-primary uk-flex uk-flex-column uk-flex-center uk-flex-middle tiny-margin-right tiny-margin-left" v-else>
												<span class="mdi mdi-account uk-text-white"></span>
											</div>


											<div class="uk-width-expand uk-flex uk-flex-column">
												<h6 class="uk-margin-remove">
													{{member.name}}
												</h6>
												<span class="uk-text-small">
													{{member.email}}
												</span>

												<span class="label bordered tiny-margin-top uk-margin-auto-right" v-if="member.uuid === $auth.user.uuid">
													<small>
														Selection Disabled
													</small>
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

								<!-- <button class="uk-button uk-button-view uk-border-rounded uk-button-small" @click="$router.push({name: 'staff-new'})">	
									Add Staff Now
								</button> -->

								<staff-actions-add-new @needs-to-refresh="$store.dispatch('staff/getStaff')" v-if="can('create-users')"></staff-actions-add-new>
							</div>
							
						</div>
					</div>
				</div>
			</vue-final-modal>
		</div>
	</div>
</template>
<script>
import {mapGetters} from "vuex"
import { base , create } from "@/mixins/branches/actions"
import { searchStaff } from "@/mixins/staff/utils"
export default{

	data(){
		return {
			showModal : false,
		}
	},


	mixins : [create, base, searchStaff],

	computed:{
		...mapGetters({
			staff : 'staff/otherStaff'
		})
	},
};
</script>
