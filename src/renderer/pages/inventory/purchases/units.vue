<template>
	<div class="tiny-padding">
		<div class="uk-padding-small bordered rounded background ">
			<div class="uk-width-1-1">
				<h4 class="uk-margin-remove-bottom">Manage Purchase Units.</h4>
				<p>This allows you to categorize your purchases for analytic purposes</p>
			</div>

			<div class="uk-width-1-1 uk-flex">
				<div class="uk-width-large@m">
					<input type="text" class="uk-input" placeholder="Search units" v-model="searchTerm">
				</div>

				<div class="uk-width-expand uk-flex uk-flex-right">
					<unit-actions-create @needs-to-refresh="$nuxt.refresh()" v-if="can('create-unit-types')"></unit-actions-create>
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
				<div  class="uk-width-1-1 uk-width-1-1  uk-border-rounded uk-padding-remove-top uk-margin-small-top"  v-if="units && units.length > 0">
					<headers-units class="background uk-border-rounded bordered tiny-padding"></headers-units>

					<div class="uk-width-1-1"  v-if="filteredUnits.length > 0">

						<div class="uk-width-1-1 uk-flex uk-flex-column uk-child-width-1-1">
							<unit-card v-for="(unit, key) in filteredUnits" :key="unit.uuid" :unit="unit" class="background tiny-padding bordered tiny-margin-top uk-border-rounded" @needs-to-refresh="$nuxt.refresh()"></unit-card>
						</div>
					</div>

					<div class="uk-padding uk-padding-remove-horizontal uk-padding-remove-top uk-width-1-1" v-else>

						<div v-if="searchTerm" class="uk-width-1-1">

							<div class="uk-width-1-1 uk-width-2xlarge@m uk-margin-top uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-border-rounded uk-padding background bordered uk-margin-auto">
								<code class="uk-text-bold uk-margin-small-bottom">
									"{{searchTerm}}"
								</code>
								<h5 class="uk-text-center uk-margin-remove uk-text-bold">
									There were no purchase units that matched your search
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
									There were no purchase units that matched your filter
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
								<span class="mdi mdi-scale-balance lni-extra-large uk-margin-bottom"></span>
								<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
									Not Unit types found
								</h4>
								<p class="uk-text-center uk-margin-remove-top">
									Purchase units you create will show up here.
								</p>

							</div>
							<unit-actions-create @needs-to-refresh="$nuxt.refresh()" v-if="can('create-unit-types')"></unit-actions-create>
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
	async fetch(){
		this.failed = false
		await this.$store.dispatch('units/getData')
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
			units : 'units/units'
		}),

		filteredUnits(){
			return this.units.filter( item => {
				return item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			})
		}
	},
	head(){
		return{
			title : `${this.$appName} | ${this.emporium.name} - Purchase Units`
		}
	},
};
</script>
