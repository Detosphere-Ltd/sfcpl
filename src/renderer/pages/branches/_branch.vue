<template>
	<div class="uk-margin-large-bottom background">
		<div class="border-bottom">
			<div  class="uk-padding-remove-horizontal uk-flex uk-flex-column">
				<div class="uk-width-1-1 uk-flex uk-flex-middle uk-flex-between uk-margin-bottom uk-margin-top tiny-padding uk-padding-remove-vertical">
					<div class="uk-width-medium uk-flex uk-flex-column">
						
						<div>
							<h4 class="uk-margin-remove uk-text-bold uk-margin-small-bottom">
								{{branch.name | branchize}}
							</h4>
							<div class="uk-flex uk-flex-middle uk-margin-small-top">
								<div class="uk-flex uk-flex-middle  tiny-margin-bottom uk-margin-right">
									<span class="mdi mdi-map-marker tiny-margin-right"></span>
									<span>
										{{branch.country && branch.city ? `${branch.country}, ${branch.city}` : 'No Location Infromation' }}
									</span>
								</div>

								<div class=" tiny-margin-bottom">	
									<span :class="branch.active ? '' : 'uk-text-danger'">{{ branch.active ? "Open Branch" : "Closed Branch" }}</span>
								</div>
							</div>
						</div>
					</div>

					<div class="uk-flex uk-flex-middle uk-flex-wrap">
						<!-- <branch-actions-edit :branch="branch" @done="$nuxt.refresh()" class="tiny-margin-bottom uk-margin-small-right">
						</branch-actions-edit>
						<branch-actions-toggle-active-status :branch="branch" @done="$nuxt.refresh()" class="tiny-margin-bottom">
						</branch-actions-toggle-active-status> -->

						<branch-options :branch="branch" @done="$nuxt.refresh()">
							<div class="uk-button-view uk-button click uk-flex uk-flex-middle" slot="action-button">
								<span class="mdi mdi-dots-horizontal uk-text-large tiny-margin-right"></span>
								<span>
									Manage Branch
								</span>
							</div>
						</branch-options>


					</div>
				</div>


				<div class="uk-width-1-1 uk-margin-remove-top uk-margin-auto-vertical border-top">

					<nav class="uk-flex uk-border-rounded">

						<nuxt-link :to="{name: 'branches-branch', params:{branch : branch.uuid}}" class="tab uk-width-auto" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove">

							<span>
								Overview
							</span>

						</nuxt-link>
						<nuxt-link v-if="can('view-users')" :to="{name: 'branches-branch-staff', params:{branch : branch.uuid }}" class="tab uk-width-auto" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove">
							<span>
								Staff
							</span>
						</nuxt-link>
						<nuxt-link v-if="can('view-stock')" :to="{name: 'branches-branch-stock', params:{branch : branch.uuid}}" class="tab uk-width-auto" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove">

							<span>
								Branch Stock
							</span>

						</nuxt-link>
						<nuxt-link v-if="can('view-sales')"  :to="{name: 'branches-branch-sales', params:{branch : branch.uuid}}" class="tab uk-width-auto" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove">
							<span>
								Sales Records
							</span>
						</nuxt-link>

					</nav>
				</div>
			</div>
		</div>
		
		<div>
			<nuxt-child :branch="branch"/>
		</div>
	</div>
</template>
<script>
export default{
	async asyncData({params, $axios, error}){
		let branch = {}
		await $axios.$get(`/branches/${params.branch}?include=manager,manager.media`).then((res)=>{
			branch = res.data
		})
		.catch(()=>{
			error({statusCode : 404 })
		})
		return { branch }
	}
};
</script>
