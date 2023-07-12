<template>
	<div>
		<div class="uk-padding-remove-bottom">
			<div class="uk-padding-small border-bottom background  uk-flex uk-flex-between uk-flex-middle">

				<h4 class="uk-margin-remove">Manage branches of your store</h4>

				<div class="uk-width-large@m uk-margin-auto">
					<input type="text" class="uk-input" placeholder="Search Branches" v-model="searchTerm">
				</div>

				<div class="uk-width-auto uk-flex uk-flex-right" v-if="can('create-branches')">
					<branch-actions-setup @created="getBranches()"></branch-actions-setup>
				</div>
			</div>

			<div class="uk-width-1-1 background uk-flex uk-flex-middle border-bottom grid-padding">
				<nuxt-link class="grid-padding uk-flex-middle rounded " exact exact-active-class="uk-background-success-op" :to="{name: 'branches'}">
					<span class="text-small tiny-margin-left tiny-margin-right">All Branches</span>
				</nuxt-link>
				<nuxt-link class="grid-padding uk-flex-middle rounded  uk-margin-small-right uk-margin-small-left" exact exact-active-class="uk-background-success uk-text-white" :to="{name: 'branches', query : {active : true}}">
					<span class="text-small tiny-margin-left tiny-margin-right">Open Branches</span>
				</nuxt-link>
				<nuxt-link class="grid-padding uk-flex-middle rounded " exact exact-active-class="uk-background-danger uk-text-white" :to="{name: 'branches', query : {active : false}}">
					<span class="text-small tiny-margin-left tiny-margin-right">Closed Branches</span>
				</nuxt-link>
			</div>
		</div>

		<div v-if="loading" class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center  background uk-border-rounded uk-margin-small-top">
			<loaders-spinner></loaders-spinner>
		</div>


		<div v-else>




			<div v-if="failed"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s bordered rounded uk-margin-auto uk-margin-top">
				<acl-parse-error :errorData="errData">
					<button class="uk-button uk-button-primary" slot="further-action" @click="getBranches">
						Retry
					</button>
				</acl-parse-error>
			</div>

			<div v-else>
				<div  class="uk-width-1-1 uk-width-1-1"  v-if="branches && branches.length > 0">


					<div class="uk-width-1-1"  v-if="filteredBranches.length > 0">

						<div class="uk-width-1-1 uk-flex uk-flex-column">
							<template v-for="(branch, index) in filteredBranches">
								<branch-card :branch="branch" :key="branch.uuid" :class="index < filteredBranches.length - 1 ? 'border-bottom' : ''" @done="getBranches"></branch-card>
							</template>
						</div>
					</div>

					<div class="uk-padding-small uk-padding-remove-horizontal uk-padding-remove-top uk-width-1-1" v-else>

						<div v-if="searchTerm" class="uk-width-1-1">

							<div class="uk-width-1-1 uk-width-2xlarge@m uk-margin-top uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-border-rounded uk-padding background bordered uk-margin-auto">
								<code class="uk-text-bold uk-margin-small-bottom">
									"{{searchTerm}}"
								</code>
								<h5 class="uk-text-center uk-margin-remove uk-text-bold">
									There are no branches that match your search
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


				<div class="uk-width-1-1 uk-padding-small uk-padding-remove-top uk-margin-small-top" v-else>

					<div class="uk-width-2xlarge@m background rounded uk-margin-auto">
						<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding-large">
							<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
								<span class="mdi mdi-store lni-extra-large uk-margin-bottom"></span>
								<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
									No branch found
								</h4>
								<p class="uk-text-center uk-margin-remove-top">
									All branches setup for your store will show up here.
								</p>

							</div>
							<branch-actions-setup @created="getBranches()">
								<template #action-button>
									<button class="uk-button uk-button-primary">
										Setup New Branch 
									</button>
								</template>
							</branch-actions-setup>
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>
<script>
import branches from "@/mixins/branches"
export default{
	mixins : [branches],
	async mounted(){
		await this.getBranches()
	}
};
</script>
