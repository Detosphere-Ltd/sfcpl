<template>
	<div>

		<div class="uk-width-1-1 uk-padding-small uk-height-1-1">
			<div class="uk-width-1-1">
				<input type="text" class="uk-input" placeholder="Search roles" autofocus v-model="searchTerm">
			</div>

			<div v-if="roles && roles.length > 0">
				<template v-if="filteredRoles.length > 0">
					<div class="uk-width-1-1 uk-flex uk-flex-middle uk-card bordered tiny-padding uk-margin-small-top uk-border-rounded background" v-for="role in filteredRoles" :key="role.uuid" v-if="role.active">
						<div class="uk-width-expand">
							<div class="uk-flex uk-flex-middle">
								<div class="uk-flex uk-flex-column">
									<small class="uk-text-capitalize">{{role.level}} level</small>
									<h6 class="uk-margin-remove">
										{{role.name}}
									</h6>
								</div>

								<small class="uk-margin-small-left" v-if="staff.role && staff.role.uuid === role.uuid">
									- Current Role
								</small>

							</div>

						</div>

						<button class="uk-button uk-button-primary uk-button-small uk-border-rounded" :disabled="staff.role && staff.role.uuid === role.uuid" @click="selectRole(role)">
							Assign
						</button>

					</div>

				</template>

				<template v-else>
					<div class="uk-padding-small uk-border-rounded uk-background-view uk-margin-top">
						<h5>
							No Roles Found
						</h5>
						<p class="uk-margin-small">
							Your search did not return any roles. Clear search to continue
						</p>

						<button class="uk-button uk-background-danger-op uk-border-rounded"  @click="searchTerm = ''">
							<span class="uk-text-small">
								Clear Search
							</span>
						</button>
					</div>
				</template>
			</div>

			<div v-else class="uk-padding-small uk-margin-top uk-border-rounded uk-width-medium uk-margin-auto uk-flex uk-flex-column uk-flex-middle background raised">
				<div class="square-80 uk-background-danger-op uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-bottom">
					<span class="mdi mdi-alert lni-mid-large"></span>
				</div>
				<p class="uk-text-center">
					We could not find any roles at this moment.
				</p>

				<button class="uk-button uk-button-primary uk-button-small" @click.prevent="$store.dispatch('access/getRoles')">
					Try Again
				</button>

			</div>


			<div class="uk-position-cover background uk-padding-small" v-if="roleIsSelected">
				<div class="uk-flex uk-flex-column uk-width-1-1 uk-height-1-1">
					<p class="uk-text-bold tiny-margin-bottom uk-flex uk-flex-wrap">
						You are about to assing the role of <span class="uk-text-bold">&nbsp; {{selectedRole.name}} &nbsp;</span>
						to {{staff.name}}
					</p>


					<div class="uk-flex tiny-padding uk-padding-remove-horizontal">
						<span>
							This role comes with {{selectedRole.permissions.length}} new permissions. See list below
						</span>
					</div>
					<div class="uk-overflow-auto">

						<div class="uk-flex uk-flex-wrap">

							<div class="chip tiny-margin-bottom tiny-margin-right uk-flex uk-flex-wrap bordered uk-border-rounded" v-for="perm in selectedRole.permissions" :key="perm.slug">
								<span class="uk-text-capitalize">{{perm.name}}</span>
							</div>
						</div>
					</div>


					<div class="tiny-padding border-top uk-padding-remove-horizontal uk-margin-small-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-small uk-button-danger uk-margin-small-right uk-border-rounded" @click="clearSelection">
							Cancel
						</button>
						<button class="uk-button uk-button-small uk-button-primary  uk-border-rounded" @click.prevent="assignRole">
							<template v-if="!syncing">
								Confirm Role Assigment
							</template>
							<partials-loader v-else></partials-loader>
						</button>
					</div>
				</div>


			</div>
		</div>
	</div>
</template>
<script>
export default{
	fetchOnServer : false,

	props: {
		staff : {
			type : Object,
			required : true
		}
	},
	data(){
		return {
			roleIsSelected : false,
			selectedRole : undefined,
			searchTerm : '',
			syncing : false
		}
	},

	methods : {
		clearSelection(){
			this.roleIsSelected = false
			this.selectedRole = undefined
		},

		selectRole(theRole){
			this.roleIsSelected = true
			this.selectedRole = theRole
		},

		async assignRole(){
			this.syncing = true
			await this.$axios.$patch(`/users/${this.staff.uuid}`, { role_id : this.selectedRole.uuid})
			.then(()=>{
				this.$emit('staff-role-changed')
				this.roleIsSelected = false
				this.$message.success("Role Assigned", 4)
			})
			.catch(()=>{
				this.$message.error("Failed to  assign role", 4)
			})
			.finally(()=>{
				this.syncing = false
			})
		}
	},


	computed : {
		roles(){
			return this.$store.getters['access/roles']
		},
		filteredRoles(){
			return this.roles.filter((role)=>{
				return role.name.toLowerCase().includes(this.searchTerm)
			})
		}
	},

};
</script>