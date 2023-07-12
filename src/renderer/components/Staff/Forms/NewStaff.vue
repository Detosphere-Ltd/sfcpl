<template>
	<div class="uk-width-1-1">

		<div class="uk-grid-collapse uk-flex uk-flex-wrap" uk-grid @keydown=" $store.dispatch('validation/clearErrors')">
			<div class="grid-padding uk-width-1-1 uk-flex uk-flex-column">
				<span class="uk-text-small tiny-margin-bottom">
					Full Name
				</span>
				<input type="text" class="uk-input uk-text-small uk-form-large" v-model="form.name" placeholder="Enter staff full name" required>
				<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.name">
					{{errors.name[0]}}
				</span>
			</div>
			<div class="grid-padding uk-width-1-2@m uk-flex uk-flex-column">
				<span class="uk-text-small tiny-margin-bottom">
					Email Address
				</span>
				<input type="email" class="uk-input uk-text-small uk-form-large" v-model="form.email" required placeholder="Enter staff's email address">
				<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.email">
					{{errors.email[0]}}
				</span>
			</div>
			<div class="grid-padding uk-width-1-2@m uk-flex uk-flex-column">
				<span class="uk-text-small tiny-margin-bottom">
					Phone Number (International Format)
				</span>
				<!-- <input type="text" class="uk-input uk-text-small uk-form-large" v-model="form.phone"  placeholder="Enter staff's mobile number"> -->
				<vue-tel-input v-model="form.phone"  placeholder="Enter staff's mobile number"></vue-tel-input>
				<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.phone">
					{{errors.phone[0]}}
				</span>
			</div>

			<div class="grid-padding uk-width-1-2@m uk-flex uk-flex-column uk-inline">
				<span class="uk-text-small tiny-margin-bottom">
					Role
				</span>
				<div class="uk-width-1-1 uk-padding-small uk-border-rounded uk-form-large click uk-text-small uk-flex uk-flex-middle uk-input" @click="roleModal = true">
					<span class="square-30 uk-margin-small-right uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle" v-if="form.role_id">
						<span class="uk-text-uppercase uk-text-small uk-text-bold mdi mdi-lock-alert uk-text-white"></span>
					</span>
					<span>
						{{form.role_id ? selectedRole[0].name : 'Assign a role to this user'}}
					</span>
				</div>


				<!--  -->
				<span class="uk-position-center-right square-20 uk-background-danger uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-position-z-index uk-margin-small-right uk-margin-small-top uk-border-circle click" v-if="form.role_id && selectedRole" @click="form.role_id = ''">
					<span class="mdi mdi-close uk-text-white"></span>
				</span>
				<!--  -->

				<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.role">
					{{errors.role[0]}}
				</span>

			</div>


			<div class="grid-padding uk-width-1-2@m uk-flex uk-flex-column uk-inline">
				<span class="uk-text-small tiny-margin-bottom">
					Branch (Optional)
				</span>
				<div class="uk-width-1-1 uk-padding-small uk-border-rounded uk-form-large click uk-text-small uk-flex uk-flex-middle uk-input" @click="branchModal = true">
					<span class="square-30 uk-margin-small-right uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle" v-if="form.branch_id">
						<span class="uk-text-uppercase uk-text-small uk-text-bold mdi mdi-domain uk-text-white"></span>
					</span>
					<span>
						{{form.branch_id ? selectedBranch[0].name : 'Assign this user to a branch'}}
					</span>

				</div>


				<!--  -->
				<span class="uk-position-center-right square-20 uk-background-danger uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-position-z-index uk-margin-small-right uk-margin-small-top uk-border-circle click" v-if="form.branch_id && selectedRole" @click="form.branch_id = ''">
					<span class="mdi mdi-close uk-text-white"></span>
				</span>
				<!--  -->

				<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.branch_id">
					{{errors.branch_id[0]}}
				</span>

			</div>

			<div class="grid-padding uk-width-1-2@m uk-flex uk-flex-column">
				<span class="uk-text-small tiny-margin-bottom">
					Gender
				</span>
				<select class="uk-select uk-form-large uk-text-small" v-model="form.gender">
					<option value="" disabled selected>Select Gender</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
					<option value="other">Other</option>
				</select>
				<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.gender">
					{{errors.gender[0]}}
				</span>
			</div>

			<div class="grid-padding uk-width-1-2@m uk-flex uk-flex-column">
				<span class="uk-text-small tiny-margin-bottom">
					Date of birth
				</span>
				<input type="date" class="uk-input uk-form-large uk-text-small" v-model="form.date_of_birth">
				<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.date_of_birth">
					{{errors.date_of_birth[0]}}
				</span>
			</div>
			<div class="tiny-padding uk-width-1-1 uk-flex uk-flex-center border-top uk-margin-small-top">
				<button type="submit" class="uk-button uk-button-primary uk-border-rounded uk-button-large uk-width-medium"  @click.prevent="addStaffMember">
					<template v-if="!loading">
						Add Staff
					</template>

					<partials-loader v-if="loading"></partials-loader>
				</button>
			</div>
		</div>

		<vue-final-modal v-model="branchModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-large-top" :esc-to-close="true" overlay-class="uk-overlay-primary">
			<div class="uk-card rounded background bordered raised uk-margin-auto uk-margin-auto-vertical uk-margin-remove-top uk-width-1-1 uk-margin-auto uk-overflow-auto uk-width-large@m uk-padding-remove modal-content">
				<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
					<h5 class="uk-margin-remove uk-text-bold">
						Select A Branch
					</h5>
					<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="branchModal = false">
						Close
					</a>
				</div>

				<div class="uk-padding-small uk-width-1-1">
					
					<div class="uk-grid-collapse uk-child-width-1-1 uk-width-1-1 uk-flex uk-flex-column" uk-grid>
						<div class="grid-padding uk-padding-remove-horizontal" v-if="branches && branches.length > 0">
							<input type="text" class="uk-input uk-width-1-1 uk-text-small" placeholder="Search for Branches" v-model="branchSearchTerm">
						</div>
						<div v-if="branches.length > 0">
							<div v-if="filteredBranches.length > 0">
								<div v-for="branch in filteredBranches" :key="branch.uuid" class="grid-padding bordered uk-margin-small-bottom uk-border-rounded click" v-if=" branch.active" @click="form.branch_id = branch.uuid; branchModal = false">
									<div  class="uk-width-1-1 uk-flex">
										<div class="square-30 uk-background-primary-op uk-border-circle uk-margin-small-right uk-flex uk-flex-column uk-flex-middle uk-flex-center">
											<span class="uk-h4 uk-margin-remove mdi mdi-domain"></span>
										</div>
										<div class="uk-width-expand uk-flex uk-flex-column">
											<h6 class="uk-text-bold uk-margin-remove">
												{{branch.name}}
											</h6>

											<span class="uk-text-small" v-if="branch.country && branch.city">
												{{ branch.country }}, {{ branch.city}}
											</span>
										</div>
									</div>
								</div>
							</div>

							<div v-else class="uk-padding-small bordered uk-border-rounded">
								<h5 class="uk-text-bold uk-margin-remove">
									Sorry. 
								</h5>
								<p class="uk-margin-small">
									No branches found for your search
								</p>
								<button class="uk-button uk-button-primary uk-button-small uk-border-rounded" @click="branchSearchTerm = ''">
									Clear Search
								</button>
							</div>
						</div>

						<div class="uk-padding-small bordered rounded" v-else>
							<h4>
								No Branches Found
							</h4>

							<p>
								You will be able to assign branches to staff after you set up your first branch. 
							</p>

							<button class="uk-button uk-button-primary uk-button-small uk-border-rounded" @click="$router.push({name: 'branches-new'})" v-if="can('create-branches')">
								Set Up Branch
							</button> 
						</div>


					</div>
				</div>
			</div>
		</vue-final-modal>

		<vue-final-modal v-model="roleModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-large-top" :esc-to-close="true" overlay-class="uk-overlay-primary">
			<div class="uk-card rounded background bordered raised uk-margin-auto uk-margin-auto-vertical uk-margin-remove-top uk-width-1-1 uk-margin-auto uk-overflow-auto modal-content uk-width-large@m uk-padding-remove">

				<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
					<h5 class="uk-margin-remove uk-text-bold">
						Select Role
					</h5>
					<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="roleModal = false">
						Close
					</a>
				</div>

				<div class="uk-padding-small uk-width-1-1">
					<h4 class="uk-margin-remove uk-text-bold">

					</h4>
					<div class="uk-width-1-1">
						<p class="uk-text-small uk-margin-remove-bottom">
							Select a role to assign to this user. <br>You  can see a list of
							<nuxt-link :to="{name: 'access'}" class="uk-text-warning">
								available roles here
							</nuxt-link>
						</p>

						
					</div>
					<div class="uk-grid-collapse uk-child-width-1-1 uk-width-1-1 uk-flex uk-flex-column uk-margin-small-top" uk-grid>
						<div class="grid-padding uk-padding-remove-horizontal">
							<input type="text" class="uk-input uk-width-1-1 uk-text-small" placeholder="Search for Role" v-model="searchTerm">
						</div>
						<div v-if="roles.length > 0">
							<div v-if="filteredRoles.length > 0">
								<div v-for="role in filteredRoles" :key="role.uuid" class="grid-padding bordered uk-margin-small-bottom uk-border-rounded click" v-if=" role.active" @click="form.role_id = role.uuid; roleModal = false">
									<div  class="uk-width-1-1 uk-flex uk-flex-middle">
										<div class="square-30 uk-background-primary-op uk-border-circle uk-margin-small-right uk-flex uk-flex-column uk-flex-middle uk-flex-center">
											<span class="mdi mdi-account-key-outline"></span>
										</div>
										<div class="uk-width-expand uk-flex uk-flex-column">
											<h6 class="uk-margin-remove">
												{{role.name}}
											</h6>
										</div>
									</div>
								</div>
							</div>

							<div v-else class="uk-padding-small uk-background-view uk-border-rounded">
								<h5 class="uk-text-bold uk-margin-remove">
									Sorry. 
								</h5>
								<p class="uk-margin-small">
									Your search query did not return any users
								</p>
								<button class="uk-button uk-button-view uk-button-small uk-border-rounded" @click="searchTerm = ''">
									Clear Search
								</button>
							</div>
						</div>


					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {mapGetters, mapActions} from "vuex"
import { base , create } from "@/mixins/staff/actions"
import {searchBranch} from "@/mixins/branches/utils"
export default{
	mixins : [create, base, searchBranch],
	data(){
		return {
			roleModal : false,
			branchModal : false,
			searchTerm : ""
		}
	},


	computed:{
		...mapGetters({
			branches : 'branches/branches',
			roles : 'access/roles'
		}),

		filteredRoles(){
			return this.roles.filter( role => {
				return role.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			})
		}
	},};
	</script>
