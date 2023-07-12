<template>
	<div class="uk-width-1-1">
		<div class="tiny-padding border-bottom background ">

			<div class="uk-width-1-1 uk-flex uk-flex-middle uk-flex-between">
				<h4 class="uk-margin-remove">Store Activity Log</h4>
			</div>
		</div>

		

		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-width-4-5@xl uk-flex uk-flex-bottom uk-flex-wrap">

				<div class="uk-width-auto  uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom">Filter By Activity Type</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="activity_type">
						<option value="" selected >All Activity Types</option>
						<option :value="acc" v-for="acc in activity_types" :key="acc">
							{{acc.split('_').join(' ')}}
						</option>
					</select>
				</div>
				

				<div class="uk-width-auto  uk-flex uk-flex-column uk-margin-small-left">
					<span class="text-small tiny-margin-bottom">Filter By Actions</span>
					<select class="uk-select uk-text-small uk-text-capitalize" v-model="action">
						<option value="" selected >All Actions</option>
						<option :value="option" v-for="option in actions" :key="option">
							{{option.split('_').join(' ')}}
						</option>
					</select>
				</div>


				<div class="uk-width-auto uk-margin-small-left uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom">Date Range</span>
					<partials-date-picker @date-set="applyDate"></partials-date-picker>
				</div>

				<div class="uk-width-small  uk-flex uk-flex-column uk-margin-small-left">
					<span class="text-small tiny-margin-bottom">Branch</span>

					<select class="uk-select uk-text-small uk-text-capitalize" v-model="branch">
						<option value="" selected >All Branches</option>
						<option :value="branch.uuid" v-for="branch in $store.getters['branches/branches']" :key="branch.uuid">
							{{branch.name}}
						</option>
					</select>
				</div>

				<div class="uk-width-expand uk-width-expand@xl uk-flex uk-flex-column uk-margin-small-left tags-input">
					<span class="text-small tiny-margin-bottom">Staff</span>

					<a-select v-model="caused_by" :max-tag-count="1" allow-clear not-found-content show-search filter-option option-filter-prop="name" show-arrow  size="large">
						<template slot="clearIcon">
							<span class="mdi mdi-close uk-text-danger background uk-background-danger uk-margin-remove"></span>
						</template>
						<a-select-option selected disabled class="uk-text-truncate" key="Payment Mode" name="All Staff" value="">
							All Staff
						</a-select-option>
						<a-select-option class="uk-text-truncate" v-for="staff in $store.getters['staff/staff']" :key="staff.uuid" :name="staff.name" :value="staff.uuid">
							{{staff.name}}
						</a-select-option>
					</a-select>
				</div>

			</div>
		</div>

		<headers-activity-log class="tiny-padding border-bottom"></headers-activity-log>

		<div>
			<div v-if="loading" class="uk-width-1-1 uk-flex uk-flex-column  uk-border-rounded uk-margin-small-top uk-padding-remove-top">
				<div class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center  uk-margin-small-top">
					<loaders-spinner></loaders-spinner>
				</div>
			</div>
			<div v-else>

				<div v-if="failed && errData !== undefined"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s  uk-margin-auto uk-margin-top">
					<error-parser :errorData="errData">
						<button class="uk-button uk-button-primary" slot="further-action" @click="getData()">
							Retry
						</button>
					</error-parser>
				</div>

				<div v-else>
					<div v-if="logs && Object.keys(logs).length > 0">
						<activity-timeline v-for="(timeline, key) in logs" :key="key" :timeline="timeline">
							<div class="uk-width-2xlarge@xl uk-width-1-1 uk-flex uk-flex-center tiny-padding" slot="timelineDay">
								<div class="uk-border-rounded chip uk-background-primary">
									<span class="text-small uk-text-white">
										{{key}}
									</span>
								</div>
							</div>
						</activity-timeline>


						<div class="border-top tiny-padding uk-flex uk-flex-center" v-if="pagination && pagination.total_pages > pagination.current_page">
							<button class="uk-button uk-button-primary uk-button-large" :disabled="fetching" @click="loadExtraData" :class="{loading : fetching}">
								Load More Records
							</button>
						</div>

					</div>
					<div class="uk-padding-large uk-padding-remove-top uk-margin-top" v-else>
						<div class=" uk-width-1-1 uk-width-2xlarge@m uk-margin-auto uk-padding background">
							<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
								<div class="square-60 rounded uk-background-primary-op uk-margin-bottom uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-post lni-mid-large"></span>
								</div>
								<h3 class="uk-text-center uk-margin-remove-bottom uk-text-bold">
									No activity logs were found.
								</h3>
								<p class="uk-text-center uk-margin-remove-top">
									All activities that happen in your store will show up here when available.
								</p>

								<button class="uk-button uk-button-primary" slot="further-action" @click="clearFilters();getData()">
									Reset Filters & Get All Activities
								</button>

							</div>
						</div>
					</div>

				</div>

			</div>
		</div>
	</div>
</template>
<script>
import activities from "@/mixins/staff/activity"
export default{

	async fetch(){
		let branches = 	await this.$store.dispatch('branches/getBranches')
		let staff  = 	await this.$store.dispatch('staff/getStaff')
		await Promise.all([branches , staff])
		.catch( err =>{
			this.failed = true
			this.errData = err
		})
	},


	mixins : [activities],
	async mounted(){
		await this.getData()
		
	}
};
</script>
