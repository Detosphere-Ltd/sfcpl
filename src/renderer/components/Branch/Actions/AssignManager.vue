<template>
	<div>
		<div @click="$uikit.modal($refs.modal).show()" class="click">
			<slot name="action-button">
				<button class="uk-button uk-button-small uk-button-view">
					Assign Branch Manager
				</button>
			</slot>
		</div>

		<div class="uk-width-1-1 uk-padding-remove"  uk-modal="esc-close: false; bg-close: false; sel-close: .close-assign-manager-modal; delay-hide: 0; delay-show: 0; stack: true" ref="modal" @beforeshow="$emit('opening'); staff.length > 0 ? '' :  getStaff() "  @beforehide="$emit('closing')">
			<div :class="colorMode" class="uk-modal-dialog transparent uk-padding-remove uk-width-large@s uk-margin-auto-vertical uk-animation-slide-top-small uk-animation-fast uk-width-1-1 uk-border-rounded">
				
				<div class="uk-width-1-1 background uk-inline uk-flex uk-flex-column uk-border-rounded no-radius-sm bordered no-border-sm">
					
					<div class="rounded background uk-position-cover uk-position-z-index center bordered uk-padding-small" v-if="processing">
						<loaders-spinner></loaders-spinner>
						<span class="uk-margin-small-top">
							Assigning Manager....
						</span>
					</div>

					<div class="tiny-padding border-bottom uk-flex uk-flex-middle">

						<div class="uk-width-expand">
							<div class="uk-flex uk-flex-column">
								<span class="uk-h5 uk-margin-remove uk-text-bold">
									Assign Manager
								</span>
								<span class="text-small">
									{{branch.name | branchize }}
								</span>
							</div>
						</div>

						<div class="uk-button uk-button-danger uk-button-small close-assign-manager-modal uk-text-white">
							Close
						</div>
					</div>
					<div class="tiny-padding uk-padding-remove-horizontal compact-sm">
						<div class="uk-width-1-1">
							<div class="modal-content" style="min-height: 400px">
								<div v-if="loading" class="uk-width-1-1 uk-flex uk-flex-column  uk-border-rounded uk-margin-small-top uk-padding-remove-top">
									<div class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center  uk-margin-small-top">
										<loaders-spinner></loaders-spinner>
									</div>
								</div>
								<div v-else>

									<div v-if="failed"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s bordered rounded uk-margin-auto uk-margin-top">
										<acl-parse-error :errorData="errData">
											<button class="uk-button uk-button-primary" slot="further-action" @click="getStaff">
												Retry
											</button>
										</acl-parse-error>
									</div>

									<div v-else>

										<div  class="uk-width-1-1"  v-if="staff && staff.length > 0">

											<div class="tiny-padding uk-padding-remove-top border-bottom uk-flex uk-flex-middle">
												<staff-actions-add-new @needs-to-refresh="getStaff" v-if="can('create-users')">
													<template #action-button>
														<div class="square-40 uk-margin-small-right uk-background-primary center rounded">
															<span class="mdi mdi-plus uk-text-large uk-text-white"></span>
														</div>
													</template>
												</staff-actions-add-new>
												<input type="text" class="uk-input" placeholder="Search Staff by Name" v-model="searchTerm">
												
											</div>

											<div class="uk-width-1-1 uk-flex uk-flex-column stripped-bottom"  v-if="filteredStaff.length > 0" uk-filter="target: .staff-filters">

												<template  v-for="(member, index) in filteredStaff">
													<div class="uk-flex tiny-padding" v-if="member.active">

														<partials-avatar :size="30" :media="member.avatar" class="uk-margin-small-right"></partials-avatar>

														<div class="uk-width-expand uk-flex uk-flex-column">
															<h5 class="tiny-margin-bottom uk-margin-remove-top uk-text-bold uk-text-truncate">{{member.name}}</h5>
															<small class="uk-text-truncate">
																{{member.role && member.role.name ? member.role.name : 'No Role Assigned'}}
															</small>
															<small class="uk-text-truncate" v-if="member.is_branch_user && member.branch && member.branch.name">
																{{member.branch.name | branchize }}
															</small>

															<small v-else>
																Corporate Staff
															</small>
														</div>
														<div class="uk-margin-auto-vertical">
															<button class="uk-button uk-button-small uk-button-primary" @click="assignManager(member.uuid)" :disabled="!member.is_branch_user && isOwnerRole(member.role)">
																Make Manager 
															</button>
														</div>
													</div>
												</template>
											</div>


											<div class="uk-padding uk-padding-remove-horizontal uk-padding-remove-top uk-width-1-1" v-else>

												<div v-if="searchTerm" class="uk-width-1-1">

													<div class="uk-width-1-1 uk-width-2xlarge@m uk-margin-top uk-flex uk-flex-column uk-flex-middle uk-flex-center rounded uk-padding uk-margin-auto background">
														<code class="uk-text-bold uk-margin-small-bottom">
															"{{searchTerm}}"
														</code>
														<h5 class="uk-text-center uk-margin-remove uk-text-bold">
															There are no staff members that match your search
														</h5>
														<p class="uk-text-center uk-margin-remove-top">
															Try a different search term or clear your search to continue
														</p>
														<button class="uk-button uk-background-danger-op uk-button-small" @click="searchTerm = ''">
															Clear Search
														</button>
													</div>
												</div>


												<div class="uk-padding-large uk-padding-remove-top uk-margin-top" v-else>
													<div class=" uk-width-1-1 uk-width-2xlarge@m uk-margin-auto uk-padding background">
														<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
															<div class="square-60 rounded  uk-margin-bottom uk-flex uk-flex-column uk-flex-center uk-flex-middle">
																<span class="mdi mdi-account-plus lni-extra-large"></span>
															</div>
															<h3 class="uk-text-center uk-margin-remove-bottom uk-text-bold">
																Add staff to your store.
															</h3>
															<p class="uk-text-center uk-margin-remove-top">
																We could not find any staff members for your store.
															</p>

															<staff-actions-add-new @needs-to-refresh="getStaff" v-if="can('create-users')"></staff-actions-add-new>

														</div>
													</div>
												</div>
											</div>

										</div>
										<div class="uk-padding-large uk-padding-remove-top uk-margin-top" v-else>
											<div class=" uk-width-1-1 uk-width-2xlarge@m uk-margin-auto uk-padding background">
												<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
													<div class="square-60 rounded  uk-margin-bottom uk-flex uk-flex-column uk-flex-center uk-flex-middle">
														<span class="mdi mdi-account-plus lni-extra-large"></span>
													</div>
													<h3 class="uk-text-center uk-margin-remove-bottom uk-text-bold">
														Add staff to your store.
													</h3>
													<p class="uk-text-center uk-margin-remove-top">
														We could not find any staff members for your store.
													</p>

													<staff-actions-add-new @needs-to-refresh="getStaff" v-if="can('create-users')"></staff-actions-add-new>

												</div>
											</div>
										</div>

									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {bindProps, manager} from "@/mixins/branches/singleton"
import staffLoader from "@/mixins/staff"
export default {
	mixins : [bindProps, manager, staffLoader],

	mounted(){
		this.$on('done', ()=>{
			this.$uikit.modal(this.$refs.modal).hide()
		})
	}
}
</script>
