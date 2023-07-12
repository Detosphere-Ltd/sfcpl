<template>
	<div class="background uk-width-1-1">
		<div class="uk-padding-small border-bottom">

			<div class="uk-width-1-1 uk-flex uk-flex-between uk-flex-middle">

				<h4 class="uk-margin-remove">Role Management</h4>

				<div class="uk-width-large@m">
					<input type="text" class="uk-input" placeholder="Search Roles" v-model="searchTerm">
				</div>

				<div class="uk-width-auto uk-flex uk-flex-right" v-if="can('create-branches')">
					<div class="uk-width-expand uk-flex uk-flex-right" v-if="can('create-roles')">
						<acl-create-role @role-created="$nuxt.refresh()"></acl-create-role>
					</div>
				</div>
			</div>
		</div>

		<div v-if="$fetchState.pending" class="uk-width-1-1 uk-flex uk-flex-column  uk-border-rounded uk-margin-small-top grid-padding uk-padding-remove-vertical">
			<div class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center bordered background uk-border-rounded uk-margin-small-top">
				<loaders-spinner></loaders-spinner>
			</div>
		</div>
		<div v-else>
			<div v-if="failed"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered  uk-padding uk-width-2xlarge@s  uk-border-rounded uk-margin-auto uk-margin-top">
				<acl-parse-error :errorData="errData">
					<button class="uk-button uk-button-primary" @click="$nuxt.refresh()" slot="further-action">
						Try Again
					</button>
				</acl-parse-error>
			</div>

			<div v-else>
				<div  class="uk-width-1-1  uk-width-1-1  uk-border-rounded"  v-if="roles && roles.length > 0">
					<div class="uk-width-1-1"  v-if="filteredRoles.length > 0" uk-filter="target: .role-filters">

						<div class="grid-padding">

							<div class="uk-width-1-1 tiny-padding background uk-border-rounded uk-flex bordered">
								<div class="uk-grid-collapse uk-child-width-auto uk-width-expand uk-flex uk-flex-middle filter" uk-grid>
									<div>
										<ul class="uk-subnav uk-subnav-pill uk-margin-remove-vertical">
											<li class="uk-active" uk-filter-control><a href="#">All Roles</a></li>
										</ul>
									</div>
									<div class="level uk-margin-small-left">
										<ul class="uk-subnav uk-subnav-pill uk-margin-remove-vertical">
											<li uk-filter-control="filter: [data-level='corporate']; group: level"><a href="#">Corporate Level</a></li>
											<li uk-filter-control="filter: [data-level='branch']; group: level"><a href="#">Branch Level</a></li>
										</ul>
									</div>
									<div class="uk-margin-small-left active-status">
										<ul class="uk-subnav uk-subnav-pill uk-margin-remove-vertical">
											<li uk-filter-control="filter: [data-status='active']; group: data-status"><a href="#">Active Roles</a></li>
											<li uk-filter-control="filter: [data-status='inactive']; group: data-status"><a href="#">Inactive Roles</a></li>
										</ul>
									</div>
									
								</div>
							</div>
						</div>


						<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-3@l uk-child-width-1-5@xl uk-grid-collapse uk-grid-match role-filters" uk-grid>
							<div class="grid-padding role-all uk-flex" v-for="role in filteredRoles" :key="role.uuid" :data-status="role.active ? 'active' : 'inactive'" :data-level="role.level">
								<acl-role @needs-to-refresh="$nuxt.refresh()" :role="role"></acl-role>
							</div>
						</div>
					</div>

					<div class="uk-padding uk-padding-remove-horizontal uk-padding-remove-top uk-width-1-1" v-else>

						<div v-if="searchTerm" class="uk-width-1-1">

							<div class="uk-width-1-1 uk-width-2xlarge@m uk-margin-top uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-border-rounded uk-padding background bordered uk-margin-auto">
								<code class="uk-text-bold uk-margin-small-bottom">
									"{{searchTerm}}"
								</code>
								<h5 class="uk-text-center uk-margin-remove uk-text-bold">
									There are no roles that match your search
								</h5>
								<p class="uk-text-center uk-margin-remove-top">
									Try a different search term or clear your search to continue
								</p>
								<button class="uk-button uk-background-danger-op uk-button-small" @click="searchTerm = ''">
									Clear Search
								</button>
							</div>
						</div>


					</div>
				</div>

				<div class="uk-padding uk-container" v-else>
					<div class="uk-width-2xlarge@m uk-margin-auto uk-border-rounded uk-padding background">
						<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
							<span class="lni lni-ticket-alt lni-extra-large"></span>
							<h6 class="uk-text-center uk-margin-remove-bottom uk-text-bold">
								Add Roles to your store.
							</h6>
							<p class="uk-text-center uk-margin-remove-top">
								We could not find any roles for your store.
							</p>

							<acl-create-role @role-created="$nuxt.refresh()" v-if="can('create-roles')"></acl-create-role>
						</div>
					</div>
				</div>



			</div>
		</div>
	</div>
</template>
<script>
import {mapGetters} from "vuex"
export default{
	fetchOnServer : false,
	data(){
		return {
			failed : false,
			errData : undefined,
			searchTerm : ''
		}
	},
	async fetch(){
		let roles  = 	await this.$store.dispatch('access/getRoles')
		let permissions  = 	await this.$store.dispatch('access/getPermissions')
		await Promise.all([roles , permissions])
		.catch((err)=>{
			this.failed = true
			this.errData = err
		})
	},

	computed : {
		...mapGetters({
			roles : 'access/roles'
		}),

		filteredRoles(){
			return this.roles.filter( role => {
				return role.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			})
		}
	}
};
</script>

