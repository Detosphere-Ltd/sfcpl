	<template>
		<div class="uk-width-1-1">
			<div class="uk-card uk-width-1-1 tiny-padding success-on-hover click uk-border-rounded uk-flex uk-flex-middle uk-transition-toggle" @click="showModal = true">
				<div class="uk-width-expand">
					<h6 class="tiny-margin-bottom uk-margin-remove uk-text-bold">
						Manage Role
					</h6>
					<p class="uk-text-small uk-margin-remove uk-text-truncate">
						Assign / Change {{staff.name}}'s role
					</p>
				</div>

				<div class="square-30 uk-background-success-op  uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle click uk-transition-slide-left-small">
					<span class="mdi mdi-chevron-right lni-large"></span>
				</div>

			</div>

			<div class="tiny-margin-top tiny-margin-bottom border-bottom"></div>


			<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" :key="showModal" attach=".app">
				<div class="uk-card rounded background bordered raised uk-margin-auto uk-margin-large-top uk-width-1-1  uk-width-large@m modal-content uk-inline">

					<div class="uk-flex uk-flex-between uk-flex-top tiny-padding border-bottom">
						<div class="uk-width-expand uk-flex uk-flex-column">

							<div class="uk-padding-small uk-flex uk-width-1-1">
								<div class="square-40 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right raised">
									<span class="uk-h5 uk-margin-remove uk-text-primary uk-text-bold">
										{{staff.name.substring(0,1)}}
									</span>
								</div>
								<div class="uk-width-expand uk-flex uk-flex-column">
									<span class="uk-text-small uk-text-bold">
										<small>{{staff.role && staff.role.name ? staff.role.name : 'No Role Attached'}}</small>
									</span>
									<h5 class="uk-text-bold uk-margin-remove">{{staff.name}}</h5>

									<div class="uk-flex uk-flex-middle tiny-margin-bottom" v-if="staff.branch && staff.branch.name">
										<div class="square-25 uk-background-success-op uk-margin-small-right uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle">
											<span class="mdi mdi-domain"></span>
										</div>
										<span class="uk-text-small">{{staff.branch.name}}</span>
									</div>			

								</div>
							</div>
						</div>

						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
							Close
						</a>
					</div>
					


					<div class="uk-width-1-1">
						<acl-assign-role-to-staff :staff="staff" @staff-role-changed="$emit('staff-role-changed')"/>
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
				showOptions : false,
				showing : 'profileSummary',
				roleTab : 'role',

				staffDetails : {
					doing : 'showInfo'
				}
			}
		},
	};
	</script>
