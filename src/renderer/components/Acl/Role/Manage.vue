<template>
	<div>
		<div @click="showModal = true">
			<slot name="action-button">
				<div class="square-30  uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle click uk-margin-small-left">
					<span class="mdi mdi-cog lni-large"></span>
				</div>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="false" overlay-class="uk-overlay-primary" :click-to-close="false" @before-open="tab = state">
			<div class="uk-width-1-1 uk-margin-auto-vertical" v-if="role.editable">
				<div class="uk-width-1-1  background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom uk-width-1-1">
						<h5 class="uk-margin-remove uk-text-bold">
							Manage Role
						</h5>
						<a class="uk-button uk-button-small uk-button-danger" @click="showModal = false">
							Close
						</a>
					</div>
					

					<div class="uk-flex uk-width-1-1 border-bottom grid-padding uk-child-width-expand">
						<div class="tab uk-text-center click" :class="tab === 'MANAGE_ROLE_INFO' ? 'uk-background-primary-op uk-border-rounded' : ''" @click="tab = 'MANAGE_ROLE_INFO'">
							<span class="uk-text-bold">
								Role Info
							</span>
						</div>

						<div class="tab uk-text-center click"  :class="tab === 'MANAGE_ROLE_STATUS' ? 'uk-background-primary-op uk-border-rounded' : ''" @click="tab = 'MANAGE_ROLE_STATUS'" v-if="can('change-role-active-status')">
							<span class="uk-text-bold">
								{{role.active ? 'Deactivate' : 'Activate'}} Role
							</span>
						</div>

						<div class="tab uk-text-center click"  :class="tab === 'MANAGE_ROLE_PERMISSIONS' ? 'uk-background-primary-op uk-border-rounded' : ''" @click="tab = 'MANAGE_ROLE_PERMISSIONS'">
							<span class="uk-text-bold">
								Role Permissions
							</span>
						</div>
						
					</div>

					



					<div class="uk-padding-small" v-if="tab === 'MANAGE_ROLE_INFO'">

						<div  :key="updating" v-if="can('update-roles')">
							<div class="modal-content uk-overflow-auto uk-flex uk-flex-column">
								<div class="grid-padding uk-flex uk-flex-column">
									<span class="uk-text-small tiny-margin-bottom">
										Role Name
									</span>
									<input type="text" class="uk-input uk-form-large uk-text-small uk-text-bold uk-text-dark" v-model="roleForm.name">
									<span class="text-small uk-text-danger" v-if="errors && errors.name">
										{{errors.name[0]}}
									</span>
								</div>

								<div class="grid-padding uk-width-1-1 uk-flex uk-flex-column">
									<span class="uk-margin-small-bottom">
										Describe what the bearer of this role can do (Optional)
									</span>
									<textarea  cols="5" rows="5" class="uk-textarea" v-model="roleForm.description" placeholder="Description (Optional)">
									</textarea>
									<span class="text-small uk-text-danger" v-if="errors && errors.description">
										{{errors.description[0]}}
									</span>
								</div>

								<div class="grid-padding uk-flex uk-flex-column">
									<span class="uk-text-small tiny-margin-bottom">
										Role Level
									</span>
									<select class="uk-select uk-form-large uk-width-1-1 uk-text-small" v-model="roleForm.level">
										<option value="corporate">Corporate Level</option>
										<option value="branch">Branch Level</option>
									</select>

									<span class="text-small uk-text-danger" v-if="errors && errors.level">
										{{errors.level[0]}}
									</span>
								</div>
							</div>
							<div class="tiny-padding uk-flex uk-flex-center uk-margin-small-top border-top">

								<button class="uk-button uk-button-primary" :disabled="updating" @click="updateRole">
									<partials-loader v-if="updating"></partials-loader>
									<template v-else>
										Update Role
									</template>
								</button>
							</div>
						</div>

						<acl-access-denied v-else></acl-access-denied>
					</div>





					<div class="uk-padding-small" v-else-if="tab === 'MANAGE_ROLE_STATUS'">
						<div v-if="$auth.user.role.uuid === role.uuid">
							<div class="uk-flex uk-flex-middle uk-flex-column uk-padding uk-border-rounded uk-background-muted-dark">
								<span class="mdi mdi-lock-alert lni-extra-large"></span>
								<h4 class="uk-text-center uk-margin-remove">Permission Denied</h4>

								<hr class="uk-width-small uk-margin-auto uk-margin-small-top uk-margin-small-bottom hr-black">

								<p class="uk-text-center">
									You cannot activate / deactivate this role because doing so may lock you out of the application.
								</p>

								
							</div>
						</div>

						<div v-else>

							<template v-if="can('change-role-active-status')">

								<h5 class="uk-text-bold uk-text-center">
									Are you sure you want to {{role.active ? 'deactivate' : 'activate'}} the role of 
									<code class="underlined">{{role.name}}?</code>
								</h5>

								
								<p class="tiny-padding uk-text-center">
									This action will {{role.active ? 'prevent' : 'enable'}} all staff assigned this role {{role.active ? 'from' : 'to'}} {{role.active ? 'performing' : 'perform'}} actions permitted by the role. Check the "Role Permissions Tab" to see permissions under this role.
								</p>
								
								<div class="uk-flex uk-flex-center border-top tiny-padding uk-padding-remove-bottom">
									<button class="uk-button uk-button-view tiny-margin-right" @click.prevent="showModal = false">
										No
									</button>

									<button class="uk-button" :disabled="loadstate" @click="toggleActiveStatus" :class="[role.active ? 'uk-button-danger' : 'uk-button-primary']">
										<partials-loader v-if="loadstate"></partials-loader>
										<template v-else>
											{{role.active ? 'Deactivate' : 'Activate'}} Role
										</template>
									</button>

								</div>
							</template>

							<acl-access-denied v-else></acl-access-denied>


						</div>
					</div>

					<div class="uk-width-1-1 uk-padding-small" v-else>
						<div class="uk-width-expand">
							<h5 class="uk-text-dark uk-text-bold uk-margin-remove">
								Role Permissions
							</h5>
							<p class="uk-margin-remove">
								Add or remove permissions from this role.
							</p>

							<div class="modal-content uk-overflow-auto uk-width-1-1">
								<div class="uk-flex uk-flex-wrap uk-child-width-1-1 uk-grid-collapse uk-width-1-1" uk-grid>
									<div class="grid-padding"  v-for="(tl, key) in permissions" :key="`1${key}`" v-if="permissions[key].some(item => { return item.level === role.level || item.level === 'both' })">
										<div class="uk-flex uk-flex-column" >
											<h5 class="uk-text-bold">
												{{key}}
											</h5>

											<div v-for="perm in tl" :key="perm.slug" class="uk-flex click" @click.prevent="syncSelected(perm.slug)" v-if="perm.level === role.level || perm.level === 'both'">
												<div class="square-25  uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle" :class="permissionIsSelected(perm.slug) ? 'uk-background-primary' : 'bordered'">
													<span class="mdi mdi-check uk-text-white" v-if="permissionIsSelected(perm.slug)"></span>
												</div>
												<div class="uk-width-expand grid-padding uk-padding-remove-vertical">
													<p class="uk-text-capitalize uk-text-truncate">
														{{perm.name}}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>



						<div class="tiny-padding uk-flex uk-flex-center border-top uk-padding-remove-bottom">

							<button class="uk-button uk-button-danger tiny-margin-right" @click.prevent="showModal = false" :disabled="saving">
								Cancel
							</button>

							<button class="uk-button uk-button-primary" :disabled="saving" @click.prevent="updateRolePermissions">
								<partials-loader v-if="saving"></partials-loader>
								<template v-else>
									Update Permissions
								</template>
							</button>
						</div>

					</div>
				</div>
			</div>
			<div v-else class="uk-width-1-1 uk-margin-auto-vertical">
				<div class="uk-width-1-1  uk-padding uk-flex uk-flex-column uk-flex-middle background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium@s">
					<span class="mdi mdi-alert uk-text-danger lni-mid-large uk-margin-small-bottom"></span>
					<h5 class="uk-text-center uk-margin-bottom">
						Sorry. <br> This role cannot be modified.
					</h5>
					<button @click="showModal = false" class="uk-button uk-button-danger">
						Close
					</button>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import { bindProps, update, toggleActiveState, managePermissions } from "@/mixins/acl/role"
export default{
	mixins : [ bindProps, update, toggleActiveState, managePermissions ],
	props : {
		state : {
			type : String,
		default : 'MANAGE_ROLE_INFO'
		}
	},
	data(){
		return {
			showModal : false,
			tab : 'MANAGE_ROLE_INFO'
		}
	},
};
</script>


