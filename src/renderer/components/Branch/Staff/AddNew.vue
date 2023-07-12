<template>
	<div>
		<button class="uk-button uk-button-primary" @click="showModal = true">
			Add New Branch Staff
		</button>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="true" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s">

					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Add New Branch Staff
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
							Close
						</a>
					</div>
					<div class="tiny-padding uk-overflow-auto modal-content">


						<div class="uk-grid-collapse uk-flex uk-flex-wrap" uk-grid @keydown=" $store.dispatch('validation/clearErrors')">
							<div class="grid-padding uk-width-1-1 uk-flex uk-flex-column">
								<span class="uk-small uk-margin-small-bottom">
									Staff Name
								</span>
								<input type="text" class="uk-input uk-text-small uk-form-large" v-model="form.name" placeholder="Enter full name of staff" required>
								<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.name">
									{{errors.name[0]}}
								</span>
							</div>
							<div class="grid-padding uk-width-1-1@s uk-flex uk-flex-column">
								<span class="uk-small uk-margin-small-bottom">
									Email Address
								</span>
								<input type="email" class="uk-input uk-text-small uk-form-large" v-model="form.email" required placeholder="Enter staff's email address">
								<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.email">
									{{errors.email[0]}}
								</span>
							</div>
							<div class="grid-padding uk-width-1-1@s uk-flex uk-flex-column">
								<span class="uk-small uk-margin-small-bottom">
									Phone Number
								</span>
								<input type="text" class="uk-input uk-text-small uk-form-large" v-model="form.phone"  required placeholder="Enter staff's mobile number">
								<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.phone">
									{{errors.phone[0]}}
								</span>
							</div>


							<div class="grid-padding uk-width-1-2@s uk-flex uk-flex-column">
								<span class="uk-small uk-margin-small-bottom">
									Gender
								</span>
								<select class="uk-select uk-form-large uk-text-small" v-model="form.gender" required>
									<option value="" disabled selected>Select Gender</option>
									<option value="male">Male</option>
									<option value="female">Female</option>
									<option value="other">Other</option>
								</select>
								<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.gender">
									{{errors.gender[0]}}
								</span>
							</div>

							<div class="grid-padding uk-width-1-2@s uk-flex uk-flex-column">
								<span class="uk-small uk-margin-small-bottom">
									Date of birth
								</span>
								<input type="date" class="uk-input uk-form-large uk-text-small" v-model="form.date_of_birth">
								<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.date_of_birth">
									{{errors.date_of_birth[0]}}
								</span>
							</div>

							<div class="grid-padding uk-width-1-1 uk-flex uk-flex-column tags-input" v-if="can('view-roles')">
								<span class="uk-small uk-margin-small-bottom">
									Assign A Role to this Staff (Optional)
								</span>
								<select class="uk-select uk-form-large uk-text-small" v-model="form.role_id" required>
									<option value="" disabled selected>Select Role</option>
									<option :value="role.uuid" v-for="role in branchRoles" :key="role.uuid">{{role.name}}</option>
								</select>
								<span class="uk-text-extra-small uk-text-danger tiny-margin-top" v-if="errors && errors.role_id">
									{{errors.role_id[0]}}
								</span>
							</div>



						</div>
					</div>

					<div class="tiny-padding uk-width-1-1 border-top uk-flex uk-flex-center">
						<button type="submit" class="uk-button uk-button-primary uk-border-rounded"  @click.prevent="addStaffMember">
							<template v-if="!loading">
								Add Staff To This Branch
							</template>

							<partials-loader v-if="loading"></partials-loader>
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {mapGetters} from "vuex"
import {bindProps , branchStaff} from "@/mixins/branches/singleton"
export default{
	mixins : [bindProps],

	computed : {
		...mapGetters({
			branchRoles : "access/branchRoles"
		})
	},

	data(){
		return {
			showModal : false,
			loading : false,
			form : {
				name : "",
				email : '',
				phone : '',
				gender : '',
				role_id : '',
				date_of_birth: '',
				branch_id : ''
			},
		}
	},


	methods : {
		async addStaffMember(){
			this.loading = true
			await this.$axios.$post('/users', this.form)
			.then(async ()=>{
				this.$message.success(`${this.form.name} has been added to your staff`, 4)
				this.form = {
					name : "",
					email : '',
					phone : '',
					gender : '',
					role_id : '',
					date_of_birth: ''
				}

				this.showModal = false
			})
			.catch((err)=>{
				this.$message.error(`We were unable to add ${this.form.name} to this branch. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	},
	mounted(){
		this.form.branch_id = this.branch.uuid
	}
};
</script>
