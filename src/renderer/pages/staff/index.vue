<template>
	<div>

		<div class="uk-padding-small border-bottom background ">

			<div class="uk-width-1-1 uk-flex uk-flex-middle uk-flex-between">
				<h4 class="uk-margin-remove">Manage your staff members.</h4>


				<div class="uk-width-auto uk-flex uk-flex-right uk-flex-middle">
					<import-excel :resource="{name: 'Users', path : 'users'}" class="uk-margin-small-right" @import-completed="getStaff" v-if="can('import-users')"></import-excel>
					<staff-actions-add-new @needs-to-refresh="getStaff" v-if="can('create-users')"></staff-actions-add-new>
				</div>
			</div>
		</div>

		<div class="uk-width-1-1">

			<div class="uk-flex uk-flex-middle border-bottom uk-width-1-1">

				<div class="square-40 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-left uk-margin-small-right click" @click="clearFilters();getStaff()">
					<span class="mdi uk-text-white lni-large" :class="loading ? 'mdi-loading spin' : 'mdi-reload'"></span>
				</div>

				
				<div class="grid-padding uk-width-small">
					<select class="uk-select" v-model="active">
						<option value="" selected>All Staff</option>
						<option :value="true">Active</option>
						<option :value="false">Deactivated</option>
					</select>
				</div>



				<div class="grid-padding uk-width-small">
					<select class="uk-select" v-model="level">
						<option value="" selected>All Levels</option>
						<option :value="false">Corporate Level</option>
						<option :value="true">Branch Level</option>
					</select>
				</div>

				<div class="uk-width-large@m grid-padding">
					<input type="text" class="uk-input" placeholder="Search Staff by Name" v-model="searchTerm">
				</div>
			</div>

			<div v-if="loading" class="uk-width-1-1 uk-flex uk-flex-column  uk-border-rounded uk-margin-small-top uk-padding-remove-top">
				<div class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center  uk-margin-small-top">
					<loaders-spinner></loaders-spinner>
				</div>
			</div>
			<div class="uk-width-1-1" v-else>

				<div v-if="failed"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s bordered rounded uk-margin-auto uk-margin-top">
					<acl-parse-error :errorData="errData">
						<button class="uk-button uk-button-primary" slot="further-action" @click="getStaff">
							Retry
						</button>
					</acl-parse-error>
				</div>

				<div class="uk-width-1-1" v-else>
					<div  class="uk-width-1-1 horizontal-scroll"  v-if="staff && staff.length > 0">



						<div class="uk-width-1-1"  v-if="filteredStaff.length > 0" uk-filter="target: .staff-filters">



							<div class="border-bottom uk-width-1-1">
								<div class="uk-flex uk-flex-middle grid-padding uk-width-1-1">

									<div class="uk-margin-small-right" style="min-width: 30px"></div>

									<div class="uk-width-medium grid-gutter uk-flex uk-flex-column">
										<span class="uk-text-truncate uk-text-bold text-small uk-text-uppercase">Name</span>
									</div>

									<div class="uk-width-small grid-gutter uk-flex uk-flex-column">
										<span class="uk-text-truncate uk-text-bold text-small uk-text-uppercase">Level</span>
									</div>


									<div class="uk-width-small grid-gutter uk-flex uk-flex-column">
										<span class="uk-text-bold text-small uk-text-uppercase">Designation</span>
									</div>
									<div class="uk-width-small grid-gutter uk-flex uk-flex-column">
										<span  class="uk-text-truncate uk-text-bold text-small uk-text-uppercase">Role</span>
									</div>
									<div class="uk-width-small grid-gutter uk-flex uk-flex-column">
										<span class="uk-text-bold text-small uk-text-uppercase">Email</span>
									</div>
									<div class="uk-width-small grid-gutter uk-flex uk-flex-column">
										<span class="uk-text-bold text-small uk-text-uppercase">Phone</span>
									</div>
									<div class="uk-width-small grid-gutter">
										<span class="uk-text-bold text-small uk-text-uppercase">Gender</span>
									</div>
									<div class="uk-width-small grid-gutter uk-flex">
										<span class="uk-text-bold text-small uk-text-uppercase">Status</span>
									</div>
									<div class="uk-width-x-small">
									</div>
								</div>
							</div>

							<div class="uk-width-1-1 tiny-margin-top uk-flex uk-flex-column">
								<staff-member v-for="(member, index) in filteredStaff"  class="uk-width-1-1" :key="member.uuid":staff="member" @needs-to-refresh="getStaff" :class="index < filteredStaff.length - 1 ? 'border-bottom' : ''"></staff-member>
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
</template>
<script>
import staff from "@/mixins/staff"
export default{
	async fetch(){
		await this.$store.dispatch('access/getRoles')
	},

	mixins : [staff],
	async mounted(){
		await this.getStaff()
		await this.$store.dispatch('branches/getBranches')
	}
};
</script>
