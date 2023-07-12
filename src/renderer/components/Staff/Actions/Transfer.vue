<template>
	<div class="uk-width-1-1">
		<div class="uk-card uk-width-1-1 tiny-padding primary-on-hover click uk-border-rounded uk-flex uk-flex-middle uk-transition-toggle" @click="showModal = true">
			<div class="uk-width-expand">
				<h6 class="tiny-margin-bottom uk-margin-remove uk-text-bold">
					Transfer Staff
				</h6>
				<p class="uk-text-small uk-margin-remove uk-text-truncate">
					Transfer {{staff.name}} to a branch.
				</p>
			</div>

			<div class="square-30 uk-background-primary-op  uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle click uk-transition-slide-left-small">
				<span class="mdi mdi-chevron-right lni-large"></span>
			</div>

		</div>

		<div class="tiny-margin-top tiny-margin-bottom border-bottom"></div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1" :esc-to-close="true" overlay-class="uk-overlay-primary rounded" content-class="uk-margin-auto-vertical " attach=".app">
			<div class="uk-card rounded background bordered raised-deep uk-margin-auto  uk-width-large@s uk-margin-auto uk-margin-large-top uk-margin-remove-bottom modal-content">
				<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
					<h5 class="uk-margin-remove uk-text-bold">
						Transfer Staff.
					</h5>
					<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
						Close
					</a>
				</div>
				<div>


					<div class="modal-content uk-overflow-auto tiny-padding">
						<p class="tiny-margin-bottom">
							Select a branch to transfer <span class="uk-text-bold">{{staff.name}}</span>
						</p>
						<div v-if="otherBranches && otherBranches.length > 0">
							<div v-for="branch in otherBranches" class="grid-padding uk-border-rounded bordered uk-width-1-1 tiny-margin-bottom click" @click="selectedBranch = branch.uuid" :class="branch.uuid === selectedBranch ? 'uk-background-primary-op' : ''">
								<h6 class="uk-margin-remove">
									{{branch.name}}
								</h6>
								<span class="uk-text-small">
									{{ branch.total_users | pluralize('Member') }}
								</span>
							</div>
						</div>

						<div class="uk-padding-small uk-border-rounded bordered uk-margin-top uk-margin-small-bottom" v-else>
							<h5>
								No Branches Found
							</h5>
							<p class="uk-margin-small-bottom">
								Create branches to assign staff members
							</p>

							<nuxt-link :to="{name: 'branches-new'}" class="uk-button uk-button-primary uk-button-small">
								Set Up Branch
							</nuxt-link>
						</div>
					</div>

					<div class="uk-flex uk-flex-center border-top tiny-padding">
						<button class="uk-button uk-button-primary" @click="changeStaffBranch" v-if="otherBranches && otherBranches.length > 0">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>
								Confirm Transfer
							</template>
						</button>
					</div>
				</div>
				
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {mapGetters} from "vuex"
import {bindProps} from "@/mixins/staff/singleton"
export default{
	mixins : [bindProps],
	data(){
		return {
			showModal : false,
			selectedBranch : (this.staff.branch && this.staff.branch.uuid !== undefined) ? this.staff.branch.uuid : '',
			loading : false,
		}
	},

	computed : {
		...mapGetters({
			branches : 'branches/branches'
		}),

		otherBranches(){
			if (this.staff.branch.uuid !== undefined) {
				return this.branches.filter((branch)=>{return this.staff.branch.uuid !== branch.uuid})
			}
			return this.branches
		}
	},

	methods : {
		async changeStaffBranch(){
			this.loading = true

			await this.$axios.$post(`/users/${this.staff.uuid}/transfer`, { branch_id : this.selectedBranch})
			.then(()=>{
				this.$emit('success')
				this.$message.success(`${this.staff.name} has been transfered.`)
				this.showModal = false
			})
			.catch(()=>{
				this.$message.error(`Failed to transfer ${this.staff.name}.`)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
};
</script>
