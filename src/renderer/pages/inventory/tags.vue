<template>
	<div class="tiny-padding">
		<div class="uk-padding-small bordered rounded background ">
			<div class="uk-width-1-1">
				<h4 class="uk-margin-remove-bottom">Manage Product Tags.</h4>
				<p>Tags allow you to relate products to any number of categories for easy discovery.</p>
			</div>

			<div class="uk-width-1-1 uk-flex">
				<div class="uk-width-large@m">
					<input type="text" class="uk-input" placeholder="Search tags" v-model="searchTerm">
				</div>

				<div class="uk-width-expand uk-flex uk-flex-right">
					<import-excel :resource="{name: 'Tags / Categories', path : 'tags'}" class="uk-margin-small-right" @import-completed="$nuxt.refresh()" v-if="can('import-tags')">
					</import-excel>
					<tag-actions-add-product-tag @needs-to-refresh="$nuxt.refresh()" v-if="can('create-tags')"></tag-actions-add-product-tag>
				</div>
			</div>
		</div>


		<div v-if="$fetchState.pending" class="uk-padding uk-flex uk-flex-center uk-flex-middle uk-flex-column">
			<loaders-spinner></loaders-spinner>
		</div>
		<div v-else>


			<div v-if="failed && errData"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s bordered rounded uk-margin-auto uk-margin-top">
				<acl-parse-error :errorData="errData">
					<button class="uk-button uk-button-primary" slot="further-action" @click="$nuxt.refresh()">
						Retry
					</button>
				</acl-parse-error>
			</div>

			<div v-else>
				<div  class="uk-width-1-1 tiny-padding uk-width-1-1  uk-border-rounded uk-padding-remove-top uk-margin-small-top"  v-if="tags && tags.length > 0">


					<div class="uk-width-1-1"  v-if="filteredTags.length > 0">

						<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-child-width-1-1 uk-child-width-auto@s uk-grid-collapse uk-grid-match" uk-grid>
							<div class="grid-gutter uk-padding-remove-right uk-padding-remove-bottom" v-for="tag in filteredTags" :key="tag.uuid">
								<tag-card :tag="tag" class="background bordered tiny-padding rounded" @needs-to-refresh="$nuxt.refresh()"></tag-card>
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
									There were no product tags / categories that matched your search
								</h5>
								<p class="uk-text-center uk-margin-remove-top">
									Try a different search term or clear your search to continue
								</p>
								<button class="uk-button uk-background-danger-op uk-button-small" @click="searchTerm = ''">
									Clear Search
								</button>
							</div>
						</div>

						<div v-else-if="filter" class="uk-width-1-1">

							<div class="uk-width-1-1 uk-width-2xlarge@m uk-margin-top uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-border-rounded uk-padding background bordered uk-margin-auto">
								<h5 class="uk-text-center uk-margin-remove uk-text-bold">
									There were no product tags / categories that matched your filter
								</h5>
								<p class="uk-text-center uk-margin-remove-top">
									Try a different search term or clear your search to continue
								</p>
								<button class="uk-button uk-background-danger-op uk-button-small" @click="filter = ''">
									Clear Filter
								</button>
							</div>
						</div>
					</div>
				</div>


				<div class="uk-width-1-1 uk-padding uk-padding-remove-top uk-margin-small-top" v-else>

					<div class="uk-width-2xlarge@m background rounded uk-padding bordered uk-margin-auto">
						<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
							<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
								<span class="mdi mdi-tag-multiple lni-extra-large uk-margin-bottom"></span>
								<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
									No tags found
								</h4>
								<p class="uk-text-center uk-margin-remove-top">
									Tags you create will show up here.
								</p>

							</div>
							<tag-actions-add-product-tag @needs-to-refresh="$nuxt.refresh()" v-if="can('create-tags')"></tag-actions-add-product-tag>
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
	head(){
		return{
			title : `${this.$appName} | ${this.emporium.name} - Product Tags (Categories)`
		}
	},
	fetchOnServer : false,
	async fetch(){
		this.failed = false
		await this.$store.dispatch('tags/getData')
		.catch((err)=>{
			this.failed = true
			this.errData = err
		})
	},
	data(){
		return {
			failed : false,
			errData : undefined,
			searchTerm : '',

		}
	},

	computed : {
		...mapGetters({
			tags : 'tags/tags'
		}),

		filteredTags(){
			return this.tags.filter( item => {
				return item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			})
		}
	}
};
</script>
