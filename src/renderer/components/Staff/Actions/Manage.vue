<template>
	<div class="uk-width-1-1">
		

		<div  @click="showModal = true">
			<slot name="action-button">
				<a class="uk-button uk-button-small background bordered">
					<span>
						Manage Staff
					</span>
				</a>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @closed="$emit('needs-to-refresh')">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1  background rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s bordered">
					<div class="uk-padding-small  uk-background-success-op rounded-top uk-width-1-1 uk-flex uk-flex-column">
						<div class="uk-width-1-1 uk-flex uk-flex-top uk-margin-bottom grid-padding uk-padding-remove-bottom">
							<div class="uk-width-expand uk-margin-small-right uk-flex uk-flex-top">
								<div class="square-60 uk-background-contain uk-border-circle uk-cover-container uk-margin-right" v-if="staff.avatar && staff.avatar.large !== undefined">
									<img :src="staff.avatar.large">
								</div>

								<div class="square-60 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-right" v-else>
									<h3 class="uk-margin-remove uk-text-bold uk-text-uppercase uk-text-white">
										{{staff.name.substring(0,2)}}
									</h3>
								</div>
								<div class="uk-width-expand uk-flex uk-flex-column">
									<span class="uk-text-bold" v-if="staff.role && staff.role.name !== undefined">

										{{staff.role.name}}

									</span>
									<h4 class="uk-margin-remove uk-text-bold">
										{{staff.name}}
									</h4>
									<span v-if="staff.email" class="tiny-margin-bottom">
										{{staff.email}}
									</span>
									<span class="uk-text-small">
										Added on {{$moment(staff.created_at).format("DD MMMM YYYY")}} by {{staff.created_by && staff.created_by.name !== undefined ? staff.created_by.name : 'System Admin'}}
									</span>
								</div>
							</div>

							
						</div>

					</div>
					<div class="uk-padding uk-flex uk-flex-column">
						<div class="label background bordered uk-margin-auto-right uk-margin-small-bottom uk-border-rounded">
							<span class="uk-text-capitalize uk-text-bold uk-text-small">
								Actions
							</span>
						</div>

						<template v-if="can('create-users') && staff.change_password">
							<staff-actions-resend-credentials  :staff="staff" @success="showModal = false">
							</staff-actions-resend-credentials>
							<div class="uk-margin-small-bottom uk-margin-small-top border-bottom"></div>
						</template>



						<staff-actions-transfer v-if="can('transfer-users') && staff.role.editable" :staff="staff" @success="showModal = false">
						</staff-actions-transfer>

						
						<staff-actions-detach v-if="can('transfer-users') && staff.is_branch_user" :staff="staff" @done="showModal = false">
						</staff-actions-detach>


						<staff-actions-view-info v-if="can('update-users') || can('manage-user-profile-photos')" :staff="staff" @success="showModal = false">
						</staff-actions-view-info>


						<staff-actions-assign-role :staff="staff" @staff-role-changed="showModal = false" v-if="can(['view-roles', 'view-permissions'])">
						</staff-actions-assign-role>


						<template v-if="can('change-user-active-status') && staff.uuid !== $auth.user.uuid">
							<staff-actions-deactivate :staff="staff" @staff-status-changed="showModal = false" v-if="staff.active">
							</staff-actions-deactivate>
							<staff-actions-activate :staff="staff" @staff-status-changed="showModal = false" v-else></staff-actions-activate>
							<div class="uk-margin-small-bottom uk-margin-small-top border-bottom"></div>
						</template>


						

						<button  @click="showModal = false" class="uk-button uk-background-danger uk-border-rounded">
							<span class="uk-text-small uk-text-bold  uk-text-white">
								Close
							</span>
						</button>
					</div>
				</div>
			</div>

		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/staff/singleton"
import {base} from "@/mixins/staff/actions"
export default{
	mixins : [bindProps , base],
	data(){
		return {
			showModal : false
		}
	},

};
</script>

