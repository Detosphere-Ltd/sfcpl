<template>
	<div class="uk-width-1-1">
		<div class="uk-card uk-width-1-1 tiny-padding primary-on-hover click uk-border-rounded uk-flex uk-flex-middle uk-transition-toggle" @click="showModal = true">
			<div class="uk-width-expand">
				<h6 class="tiny-margin-bottom uk-margin-remove uk-text-bold uk-text-truncate">
					Manage Details
				</h6>
				<p class="uk-text-small uk-margin-remove uk-text-truncate">
					View & Edit {{staff.name}}'s Info.
				</p>
			</div>
			<div class="square-30 uk-background-primary-op  uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle click uk-transition-slide-left-small">
				<span class="mdi mdi-chevron-right uk-text-dark lni-large"></span>
			</div>
		</div>
		<div class="tiny-margin-top tiny-margin-bottom border-bottom"></div>
		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-flex uk-flex-column" :esc-to-close="true" overlay-class="uk-overlay-primary rounded" attach=".app">
			<div class="uk-card rounded background bordered raised-deep uk-margin-auto  uk-width-1-1 uk-inline uk-margin-auto uk-overflow-auto uk-width-large uk-margin-top">
				


				<div class="uk-width-1-1 uk-height-medium uk-background-primary-op border-bottom rounded-top uk-inline uk-background-cover uk-background-blend-multiply uk-background-top-center" v-if="staff.avatar && staff.avatar.original  !== undefined" :style="`background-image: url(${staff.avatar.original})`">
					<div class="square-40 uk-background-danger uk-margin-small-left uk-margin-small-top uk-position-top-left uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle click" @click="showModal = false">
						<span class="mdi mdi-chevron-left uk-text-white lni-large"></span>
					</div>

				</div>
				

				<div class="uk-width-1-1 uk-height-medium uk-background-primary border-bottom rounded-top uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-inline" v-else>
					<div class="square-40 uk-background-danger uk-margin-small-left uk-margin-small-top uk-position-top-left uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle click" @click="showModal = false">
						<span class="mdi mdi-chevron-left uk-text-white lni-large"></span>
					</div>

					<h1 class="uk-margin-remove uk-heading-2xlarge uk-text-capitalize uk-text-bold uk-text-white">
						{{staff.name.substring(0,2)}}
					</h1>
				</div>


				<div class="uk-padding-small uk-flex uk-flex-column">
					<h4 class="uk-text-bold uk-margin-remove">
						{{staff.name}}
					</h4>

					<div class="uk-margin-auto-right uk-background-primary-op uk-border-rounded chip" v-if="staff.role && staff.role.name !== null">
						<small class="uk-text-bold uk-text-dark">
							{{staff.role.name}}
						</small>
					</div>



					<div  v-if="staff.email" class="uk-flex uk-flex-middle tiny-margin-top">
						<span class="mdi lni-large mdi-email-outline tiny-margin-right"></span>
						<span>
							{{staff.email}}
						</span>
					</div>

					<div  v-if="staff.phone" class="uk-flex uk-flex-middle tiny-margin-top">
						<span class="mdi lni-large mdi-phone tiny-margin-right"></span>
						<span>
							{{staff.phone}}
						</span>
					</div>


					<div  v-if="staff.is_branch_user" class="uk-flex uk-flex-middle tiny-margin-top">
						<span class="mdi lni-large mdi-domain tiny-margin-right"></span>
						<span>
							{{staff.branch.name}}
						</span>
					</div>
					<div class="uk-flex uk-padding-small uk-padding-remove-horizontal uk-padding-remove-bottom">

						<button class="uk-button  uk-button-primary  uk-border-rounded uk-button-small uk-margin-small-right" @click="staffDetails.doing = 'editInfo'" v-if="can('update-users')">
							Edit Info
						</button>
						<button class="uk-button uk-button-outline-primary  uk-border-rounded uk-button-small" @click="staffDetails.doing = 'manageAvatar'" v-if="can('manage-user-profile-photos')">
							Manage Avatar
						</button>
					</div>

					
				</div>

				<div class="uk-position-cover background bordered rounded uk-padding-small" v-if="can('update-users') && staffDetails.doing === 'editInfo'">
					<staff-forms-edit-info :staff="staff" @cancel-update="handleCancel" @staff-update-success="handleSuccess">
					</staff-forms-edit-info>
				</div>

				<div class="uk-position-cover background bordered rounded uk-padding-small uk-overflow-auto" v-if="can('manage-user-profile-photos') && staffDetails.doing === 'manageAvatar'">
					<staff-actions-upload-avatar :staff="staff" @cancel="handleCancel" @avatar-uploaded="handleSuccess"></staff-actions-upload-avatar>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/staff/singleton"
export default{
	mixins : [bindProps],

	data(){
		return {
			showModal : false,
			staffDetails : {
				doing : 'showInfo'
			}
		}
	},


	methods : {
		async handleSuccess(){
			await this.$emit('success')
			this.showModal = false
			this.staffDetails.doing = 'showInfo'
		},
		handleCancel(){
			this.staffDetails.doing = "showInfo"
		}
	},

	watch : {
		showing(){
			this.staffDetails.doing =  'showInfo'
		}
	}
};
</script>

<style>

.uk-button-transparent {
	border : 1px solid #FFF;
	background-color: transparent;
}
</style>
