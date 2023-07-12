<template>
	<div class="uk-width-1-1">
		<div class="tiny-padding border-bottom background uk-flex uk-flex-middle">
			<div class="square-30 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="clearFilters(); getData()">
				<span class="mdi uk-text-white" :class="loading  ? 'mdi-loading spin' : 'mdi-reload'"></span>
			</div>
			<h4 class="uk-margin-remove">Stock Adjustments</h4>
		</div>

		

		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-width-4-5@xl uk-flex uk-flex-bottom uk-flex-wrap">


				<div class="uk-width-auto uk-flex uk-flex-column">
					<span class="text-small tiny-margin-bottom">Filter By Date / Range</span>
					<partials-date-picker @date-set="applyDate"></partials-date-picker>
				</div>

				<div class="uk-width-small uk-flex uk-flex-column tiny-margin-left tags-input">
					<span class="text-small tiny-margin-bottom">Branch</span>

					<a-select v-model="branch"  allow-clear not-found-content="No branch found" show-search filter-option option-filter-prop="name" show-arrow  size="large" placeholder="Select Staff">
						<template slot="clearIcon">
							<span class="mdi mdi-close uk-text-danger background uk-background-danger uk-margin-remove"></span>
						</template>

						<a-select-option class="uk-text-truncate" name="All Branches" value="">
							All Branches
						</a-select-option>

						<a-select-option class="uk-text-truncate" v-for="branch in $store.getters['branches/branches']" :key="branch.uuid" :name="branch.name" :value="branch.uuid">
							{{branch.name}}
						</a-select-option>
					</a-select>
				</a-select>


			</div>



			<div class="uk-width-small uk-flex uk-flex-column tiny-margin-left tags-input">
				<span class="text-small tiny-margin-bottom">Location</span>

				<a-select v-model="at_branch"  allow-clear not-found-content="No location found" show-search filter-option option-filter-prop="name" show-arrow  size="large" placeholder="Select Staff">
					<template slot="clearIcon">
						<span class="mdi mdi-close uk-text-danger background uk-background-danger uk-margin-remove"></span>
					</template>
					<a-select-option value="" name="Everywhere">Everywhere</a-select-option>
					<a-select-option value="false" name="Warehouse">Warehouse Only</a-select-option>
					<a-select-option value="true" name="Branches">Branches Only</a-select-option>
				</a-select>


			</div>


			<div class="uk-width-small uk-flex uk-flex-column tiny-margin-left tags-input">
				<span class="text-small tiny-margin-bottom">Staff</span>

				<a-select v-model="caused_by"  allow-clear not-found-content="No staff found" show-search filter-option option-filter-prop="name" show-arrow  size="large" placeholder="Select Staff">
					<template slot="clearIcon">
						<span class="mdi mdi-close uk-text-danger background uk-background-danger uk-margin-remove"></span>
					</template>
					<a-select-option class="uk-text-truncate" name="All Staff" value="">
						All Staff
					</a-select-option>
					<a-select-option class="uk-text-truncate" v-for="staff in $store.getters['staff/staff']" :key="staff.uuid" :name="staff.name" :value="staff.uuid">
						{{staff.name}}
					</a-select-option>
				</a-select>
			</div>

			<div class="uk-width-small uk-flex uk-flex-column tiny-margin-left tags-input">
				<span class="text-small tiny-margin-bottom">Adjustment Reasons</span>

				<a-select mode="multiple" v-model="tags" :max-tag-count="0" allow-clear not-found-content show-search filter-option option-filter-prop="name" show-arrow  size="large" placeholder="Select Reason">
					<template slot="clearIcon">
						<span class="mdi mdi-close uk-text-danger background uk-background-danger uk-margin-remove"></span>
					</template>
					<a-select-option class="uk-text-truncate" v-for="item in ['theft', 'breakages', 'expired-items', 'protocol-sales', 'gifts', 'Other']" :key="item" :name="item" :value="item">
						{{item.split('-').join(' ') | capitalize}}
					</a-select-option>
				</a-select>
			</div>


			<div class="uk-width-expand uk-width-small@xl uk-flex uk-flex-column tiny-margin-left tags-input">
				<span class="text-small tiny-margin-bottom">Status</span>

				<a-select v-model="reversed"  allow-clear not-found-content option-filter-prop="name" show-arrow  size="large" placeholder="Status">
					<template slot="clearIcon">
						<span class="mdi mdi-close uk-text-danger background uk-background-danger uk-margin-remove"></span>
					</template>
					<a-select-option class="uk-text-truncate" value="" name="All Adjustment Statuses">
						All Adjustment Statuses
					</a-select-option>

					<a-select-option class="uk-text-truncate" value="false" name="Valid Adjustments">
						Valid Adjustments
					</a-select-option>

					<a-select-option class="uk-text-truncate" value="true" name="Reversed Adjustments">
						Reversed Adjustments
					</a-select-option>
				</a-select>
			</div>


		</div>
	</div>

	<headers-adjustment-log class="tiny-padding border-bottom"></headers-adjustment-log>

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
					<template v-for="(timeline, key) in logs">
						<div :key="key">
							<div class="uk-flex uk-flex-left tiny-padding">
								<div class="uk-border-rounded chip pill uk-button-view">
									<span class="text-small">
										{{key}}
									</span>
								</div>
							</div>

							<div class="tiny-padding border-bottom" v-for="entry in timeline" :key="entry.uuid">
								<stock-adjustment-card :adjustment="entry" @focused="(payload)=>{focusedEntry === payload ? focusedEntry = undefined : focusedEntry = payload}" :focusedEntry="focusedEntry">
								</stock-adjustment-card>
							</div>
						</div>
					</template>


					<div class="border-top tiny-padding uk-flex uk-flex-center" v-if="pagination && pagination.total_pages > pagination.current_page">
						<button class="uk-button uk-button-primary uk-button-large" :disabled="fetching" @click="loadExtraData" :class="{loading : fetching}">
							Load More Records
						</button>
					</div>

				</div>
				<div class="uk-padding-large uk-padding-remove-top uk-margin-top" v-else>
					<div class=" uk-width-1-1 uk-width-2xlarge@m uk-margin-auto uk-padding background">
						<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
							<div class="square-60 rounded uk-button-view uk-margin-bottom uk-flex uk-flex-column uk-flex-center uk-flex-middle">
								<span class="mdi mdi-wrap lni-mid-large"></span>
							</div>
							<h3 class="uk-text-center uk-margin-remove-bottom uk-text-bold">
								No Stock Adjustment records found.
							</h3>
							<p class="uk-text-center uk-margin-remove-top">
								Stock adjustment records will show up here when available
							</p>

							<button class="uk-button uk-button-primary" slot="further-action" @click="clearFilters();getData()">
								Reset Filters & Show All Stock Adjustments
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
import adjustments from "@/mixins/stock/adjustments"
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


	mixins : [adjustments],
	
	data(){
		return {
			focusedEntry : undefined
		}
	},

	watch : {
		loading(){
			this.focusedEntry = undefined
		},
	},

	async mounted(){
		await this.getData()
		
	}
};
</script>
