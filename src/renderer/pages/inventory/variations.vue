<template>
	<div>
		<div class="uk-width-1-1">
			<div class="tiny-padding">
				<div class="uk-padding-small bordered rounded background ">
					<div class="uk-width-1-1">
						<h4 class="uk-margin-remove-bottom">Manage your product variations.</h4>
						<p>Product variations  allow you to create alternative offerings of the same product (Eg. Small, Medium & Large).</p>
					</div>

					<div class="uk-width-1-1 uk-flex">
						<div class="uk-width-medium@m">
							<input type="text" class="uk-input" placeholder="Search variations" v-model="searchTerm">
						</div>

						<div class="uk-width-auto uk-margin-auto">
							<select v-model="filter" class="uk-select">
								<option value="">All Variations</option>
								<option value="true">Active Variations</option>
								<option value="false">Deactivated Variations</option>
							</select>
						</div>

						<div class="uk-width-auto uk-flex uk-flex-right">
							<import-excel :resource="{name: 'Variations', path : 'variations'}" class="uk-margin-small-right" @import-completed="$nuxt.refresh()" v-if="can('import-variations')"></import-excel>
							<product-variation-actions-add @needs-to-refresh="$nuxt.refresh()" v-if="can('create-variations')"></product-variation-actions-add>
						</div>
					</div>
				</div>

				<div class="uk-width-1-1 background uk-border-rounded uk-flex uk-flex-middle bordered uk-margin-small-top grid-padding">
					<headers-variations></headers-variations>
				</div>
			</div>


			<div v-if="$fetchState.pending" class="uk-width-1-1  tiny-padding uk-padding-remove-top">
				<div class="uk-padding-small background bordered  uk-margin-small-top uk-border-rounded uk-flex uk-flex-center">
					<loaders-spinner></loaders-spinner>
				</div>
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
					<div  class="uk-width-1-1 tiny-padding uk-border-rounded uk-padding-remove-top  modal-content uk-overflow-auto"  v-if="allVariations && allVariations.length > 0">


						<div class="uk-width-1-1"  v-if="filteredVariations.length > 0">

							<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-child-width-1-1 uk-grid-collapse uk-grid-match" uk-grid>
								<template v-for="variant in filteredVariations" >
									<product-variation-card :variant="variant" :key="variant.uuid" @needs-to-refresh="$nuxt.refresh()" class="background bordered grid-padding rounded tiny-margin-bottom"></product-variation-card>
								</template>
							</div>
						</div>

						<div class="uk-padding uk-padding-remove-horizontal uk-padding-remove-top uk-width-1-1" v-else>

							<div v-if="searchTerm" class="uk-width-1-1">

								<div class="uk-width-1-1 uk-width-2xlarge@m uk-margin-top uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-border-rounded uk-padding background bordered uk-margin-auto">
									<code class="uk-text-bold uk-margin-small-bottom">
										"{{searchTerm}}"
									</code>
									<h5 class="uk-text-center uk-margin-remove uk-text-bold">
										There were no product variation types that matched your search
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
										There were no product variation types that matched your filter
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
							<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding-large">
								<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-cart-arrow-down lni-extra-large uk-margin-bottom"></span>
									<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
										No product variation type found
									</h4>
									<p class="uk-text-center uk-margin-remove-top">
										Product variation types you create will show up here
									</p>

								</div>
								<product-variation-actions-add @needs-to-refresh="$nuxt.refresh()" v-if="can('create-variations')"></product-variation-actions-add>
							</div>
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
			title : `${this.$appName} | ${this.emporium.name} - Product Variations`
		}
	},
	fetchOnServer : false,
	async fetch(){
		this.failed = false
		await this.$store.dispatch('variations/getData')
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
			filter : 'true'
		}
	},

	computed : {
		...mapGetters({
			allVariations : 'variations/variations'
		}),

		variations(){
			if (!this.filter) { return this.allVariations}
				return this.allVariations.filter((item)=>{return this.filter === item.active.toString() })
		},

		filteredVariations(){
			return this.variations.filter( iten => {
				return iten.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			})
		}
	}
};
</script>
