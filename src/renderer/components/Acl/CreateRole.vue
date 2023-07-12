<template>
	<div>

		<div class="click" @click="showModal = true">
			<slot name="action-button">
				<button class="uk-button uk-button-primary uk-border-rounded uk-flex-middle uk-flex">
					<span class="uk-margin-small-right mdi mdi-plus-circle uk-text-white"></span>
					<span class="uk-text-capitalize uk-text-small uk-text-white">
						New Role
					</span>
				</button>
			</slot>
		</div>
		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="false" attach=".app"  :click-to-close="false" overlay-class="uk-overlay-primary"  @before-open="getPermissions">
			<div class="uk-width-1-1 uk-margin-top">

				<div class="uk-padding uk-flex uk-flex-column uk-flex-middle uk-flex-center background bordered uk-width-medium uk-border-rounded" v-if="loading">
					<loaders-spinner></loaders-spinner>
					<p class="uk-margin-small-top">
						Loading Permissions
					</p>
				</div>
				<div class="uk-card rounded-top rounded-bottom uk-margin-auto uk-margin-auto-vertical uk-width-1-1 uk-inline raised-deep uk-width-large@s bordered" v-else>

					<a class="uk-button uk-button-small uk-button-danger uk-position-top-right  uk-margin-small-top uk-margin-small-right" @click="resetData">
						Close
					</a>

					<div class="uk-padding-small rounded-top uk-width-1-1 uk-flex uk-flex-between uk-flex-middle background border-bottom">

						<div class="uk-flex uk-flex-middle">
							<div class="square-30 uk-background-primary uk-text-white uk-border-circle uk-flex uk-flex-column uk-flex-middle uk-flex-center click uk-margin-small-right" @click="step = 'ROLE_INFO'" v-show="step !== 'ROLE_INFO'">
								<span class="mdi mdi-chevron-left uk-text-primary lni-large"></span>
							</div>
							<h4 class="uk-margin-remove uk-text-bold">
								Create Role
							</h4>
						</div>

						
					</div>

					<div class="background rounded-bottom uk-width-1-1 uk-inline">
						<acl-parse-error :errorData="faileReason" v-if="failed"></acl-parse-error>
						<div class="tiny-padding" v-else>
							<div class="uk-width-1-1 uk-flex uk-flex-column" v-show="step === 'ROLE_INFO'">
								<div class="grid-padding uk-width-1-1 uk-flex uk-flex-column">
									<span class="uk-margin-small-bottom">
										Enter the name of this role
									</span>
									<input type="text" class="uk-input uk-form-large" placeholder="Role Name" v-model="roleForm.name">
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
								<div class="grid-padding uk-width-1-1 uk-flex uk-flex-column">
									<span class="uk-margin-small-bottom">
										Select the level this role should be associated with
									</span>
									<select class="uk-select uk-form-large" v-model="roleForm.level">
										<option selected disabled>Select Level</option>
										<option value="corporate">Corporate</option>
										<option value="branch">Branch</option>
									</select>
									<span class="text-small uk-text-danger" v-if="errors && errors.level">
										{{errors.level[0]}}
									</span>
								</div>


							</div>

							<div class="uk-width-1-1  modal-content uk-overflow-auto" v-show="step === 'SYNC_PERMS'">


								<div class="grid-padding uk-width-1-1 scroll-content">
									<h5 class="uk-text-bold uk-text-dark tiny-margin-bottom">
										Set permissions for <span class="uk-text-bold">{{roleForm.name}}</span>
									</h5>


									<div class="uk-flex uk-flex-wrap uk-child-width-1-1 uk-grid-collapse uk-width-1-1" uk-grid="masonry: true">
										<div class="grid-padding"  v-for="(tl, key) in permissions" :key="`1${key}`" v-if="canIshow(key)">
											<div class="uk-flex uk-flex-column bordered uk-padding-small uk-border-rounded" >
												<div class="uk-flex uk-flex-wrap uk-flex-middle uk-margin-small-bottom">
													<div class="square-25 uk-margin-small-right uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle click" :class="allSelected(key) ? 'uk-background-primary' : 'background bordered'" @click="syncAll(key)">
														<span class="mdi mdi-check uk-text-white uk-text-small" v-if="allSelected(key)"></span>
													</div>


													<div class="chip uk-border-rounded background uk-margin-auto-right">

														<span class="uk-text-small uk-text-dark uk-text-bold">
															{{key}} - Select All
														</span>
													</div>
												</div>

												<div v-for="perm in tl" :key="perm.slug" class="uk-flex click uk-margin-left" @click="syncSelected(perm.slug)" v-if="perm.level === roleForm.level || perm.level === 'both'">
													<div class="square-25 uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle" :class="roleForm.permissions.includes(perm.slug) ? 'uk-background-white bordered' : 'bordered'">
														<span class="mdi mdi-check uk-text-small" v-if="roleForm.permissions.includes(perm.slug)">
															
														</span>
													</div>
													<div class="uk-width-expand grid-padding uk-padding-remove-vertical">
														<p class="uk-text-capitalize">
															{{perm.name}}
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>

								</div>
								
							</div>

							<div class="grid-padding uk-width-1-1 uk-flex uk-flex-center border-top">
								<template v-if="step === 'ROLE_INFO'">
									<button @click="step = 'SYNC_PERMS'" class="uk-button uk-button-primary uk-border-rounded" :disabled="!roleForm.name || !roleForm.level">
										Next
									</button>
								</template>
								<template v-else>
									<button class="uk-button uk-button-primary uk-border-rounded" :disabled="creating || roleForm.permissions.length < 1" @click="createRole">
										<template v-if="!creating">
											Create Role
										</template>
										<partials-loader v-else></partials-loader>
									</button>
								</template>
							</div>

						</div>
					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {without} from 'lodash'
export default{
	data(){
		return {
			showModal : false,
			step: 'ROLE_INFO',
			roleForm : {
				name: '',
				level : '',
				description : '',
				permissions : [],
			},
			filterBy : '',
			loading : true,
			failed : false,
			faileReason : undefined,
			creating : false,
			permissions : {}
		}
	},

	methods : {
		async getPermissions(){
			this.loading = true
			await this.$axios.$get('/permissions')
			.then((res)=>{
				this.permissions = res.data
			})
			.catch((err)=>{
				this.faileReason = err
			})
			.finally(()=>{
				this.loading = false
			})
		},
		syncSelected(permission){
			if (this.roleForm.permissions.includes(permission)) {
				this.roleForm.permissions = this.roleForm.permissions.filter((item)=>{return item !== permission})
				return
			}
			if (permission.level !== this.roleForm.level || permission.level !== 'both') {
				this.roleForm.permissions.push(permission)
			}

			return
			
		},


		syncAll(index){
			let perms = this.permissions[index]

			if(perms.every((item)=>{return this.roleForm.permissions.includes(item.slug)})){

				perms.forEach((perm)=>{
					this.syncSelected(perm.slug)
				})

				return
			}

			perms.forEach((perm)=>{
				if (perm.level === 'both' || perm.level === this.roleForm.level) {
					this.roleForm.permissions.push(perm.slug)
				}
			})

			return
		},

		allSelected(index){
			let perms = this.permissions[index]
			return perms.every((item)=>{return this.roleForm.permissions.includes(item.slug)})
		},

		canIshow(index){
			let perms = this.permissions[index]
			return perms.every((item)=>{return item.level === this.roleForm.level || item.level === "both" })
		},


		async createRole(){
			this.creating = true
			await this.$axios.$post('/roles', this.roleForm)
			.then( async ()=>{
				this.showModal = false
				await this.$emit('role-created')
				await this.$message.success(`The role ${this.roleForm.name} has been created`, 4)
				await this.resetData()
			})
			.catch(()=>{
				this.$message.error(`Failed to create role: ${this.roleForm.name}`, 4)
			})
			.finally(()=>{
				this.creating = false
			})
		},

		resetData(){
			this.showModal = false
			this.step = "ROLE_INFO"
			this.roleForm = {
				name: '',
				level : '',
				permissions : [],
			}
			this.loading = false
			this.creating = false
		}
	},

	async mounted(){
		await this.getPermissions()
	}
};
</script>
