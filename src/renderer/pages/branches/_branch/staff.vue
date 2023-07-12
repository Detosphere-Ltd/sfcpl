<template>
	<div>
		<div v-if="$fetchState.pending" class="uk-width-1-1 uk-flex uk-flex-column  uk-border-rounded uk-margin-small-top uk-padding-remove-top">
			<div class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center uk-margin-small-top">
				<loaders-spinner></loaders-spinner>
			</div>
		</div>
		<div v-else>
			<div v-if="loading" class="uk-width-1-1 uk-flex uk-flex-column  uk-border-rounded uk-margin-small-top uk-padding-remove-top">
				<div class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center uk-margin-small-top">
					<loaders-spinner></loaders-spinner>
				</div>
			</div>
			<div v-else>
				<div v-if="failed"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-large@s  uk-border-rounded uk-margin-auto uk-margin-large-top">
					<acl-parse-error :errorData="errData">
					</acl-parse-error>
				</div>

				<div v-else>
					<div  class="uk-width-1-1 horizontal-scroll uk-flex uk-flex-colum"  v-if="staff && staff.length > 0">



						<div class="uk-width-1-1"  v-if="filteredStaff.length > 0" uk-filter="target: .staff-filters">

							

							<div class="border-bottom">
								<div class="uk-flex uk-flex-middle tiny-padding uk-width-1-1">

									<div class="uk-margin-small-right" style="width: 30px"></div>

									<div class="uk-width-large grid-gutter uk-flex uk-flex-column uk-margin-small-right">
										<span class="uk-text-truncate uk-text-bold text-small uk-text-uppercase">Name</span>
									</div>
									
									<div class="uk-width-medium grid-gutter uk-flex uk-flex-column uk-margin-small-right">
										<span class="uk-text-bold text-small uk-text-uppercase">Designation</span>
									</div>
									<div class="uk-width-small grid-gutter uk-flex uk-flex-column uk-margin-small-right">
										<span  class="uk-text-truncate uk-text-bold text-small uk-text-uppercase">Role</span>
									</div>
									<div class="uk-width-small grid-gutter uk-flex uk-flex-column uk-margin-small-right">
										<span class="uk-text-bold text-small uk-text-uppercase">Email</span>
									</div>
									<div class="uk-width-small grid-gutter uk-flex uk-flex-column uk-margin-small-right">
										<span class="uk-text-bold text-small uk-text-uppercase">Phone</span>
									</div>
									<div class="uk-width-small grid-gutter uk-flex uk-margin-small-right">
										<span class="uk-text-bold text-small uk-text-uppercase">Status</span>
									</div>
									<div class="uk-width-small grid-gutter">
										<span class="uk-text-bold text-small uk-text-uppercase">Gender</span>
									</div>
									<div class="uk-width-x-small">
									</div>
								</div>
							</div>

							<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-child-width-1-1 uk-grid-collapse uk-grid-match staff-filters tiny-margin-top" uk-grid>
								<template  v-for="(member, index) in filteredStaff">
									<staff-member  :key="member.uuid":staff="member" @needs-to-refresh="getStaff" :class="index < filteredStaff.length - 1 ? 'border-bottom' : ''"></staff-member>
								</template>
							</div>
						</div>


						<div class="uk-padding uk-padding-remove-horizontal uk-padding-remove-top uk-width-1-1" v-else>

							<div v-if="searchTerm" class="uk-width-1-1">

								<div class="uk-width-1-1 uk-width-2xlarge@m uk-margin-top uk-flex uk-flex-column uk-flex-middle uk-flex-center rounded uk-padding uk-margin-auto background bordered">
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

					<div class="uk-width-1-1 uk-padding" v-else>
						<div class="uk-width-2xlarge@m uk-border-rounded uk-padding bordered uk-margin-auto">
							<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding-large">
								<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-account-group-outline lni-extra-large uk-margin-bottom"></span>
									<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
										We couldn't find any staff members for this branch.
									</h4>
									<template v-if="can('create-users')">
										<p class="uk-text-center uk-margin-remove-top">
											You can create a new staff account for this branch or assign members from your staff directory.
										</p>

										<div class="uk-flex uk-flex-wrap">
											<branch-staff-add-new :branch="branch" class="uk-margin-small-right tiny-margin-bottom" @done="refreshPage"></branch-staff-add-new>
											<branch-staff-assign :branch="branch" class="tiny-margin-bottom" v-if="can('view-users')" @done="refreshPage"></branch-staff-assign>
										</div>
									</template>

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
import {bindProps, branchStaff} from "@/mixins/branches/singleton"
export default{
	fetchOnServer : false,
	async fetch(){
		await this.$store.dispatch('access/getPermissions')
		await this.$store.dispatch('branches/getBranches')
		await this.$store.dispatch('access/getRoles')
		await this.$store.dispatch('staff/getStaff')
	},
	
	mixins : [bindProps, branchStaff],
	async mounted(){
		await this.getBranchStaff()
		
	},

	methods : {
		async refreshPage(){
			await this.$nuxt.refresh()
			await this.getBranchStaff()
		}
	}
};
</script>
