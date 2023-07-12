<template>
	<div>

		<div class="uk-flex uk-padding-small">
			
			<div class="uk-width-expand">
				<h5 class="uk-margin-remove">Manage Your Taxes & Levies on {{$appName}}</h5>
			</div>

			<div class="uk-width-auto">
				<levy-actions-create @done="fetchData()"></levy-actions-create>
			</div>
		</div>

		<div v-if="loading" class="uk-width-1-1 uk-padding-small center">
			<loaders-spinner></loaders-spinner>
			<span class="uk-margin-top">
				Loading Levies
			</span>
		</div>

		<div v-else>
			<div v-if="failed"  class="uk-width-1-1 uk-flex uk-flex-column uk-padding">
				<acl-parse-error :errorData="errData">
					<button class="uk-button uk-button-primary" slot="further-action" @click="fetchData()">
						Retry
					</button>
				</acl-parse-error>
			</div>
			<div v-else>
				<div class="uk-flex uk-width-1-1 border-top">
					<div class="uk-width-expand uk-flex uk-flex-column border-right tiny-padding">
						<p class="uk-margin-remove">
							Levy
						</p>

					</div>

					<div class="uk-width-x-small border-right tiny-padding center">
						<span>
							Rate
						</span>
					</div>

					<div class="uk-width-x-small tiny-padding center border-right">

						<span>
							Status
						</span>
					</div>

					<div class="uk-width-small border-right tiny-padding center">
						<span>
							Created By
						</span>
					</div>


					<div class="uk-width-x-small tiny-padding center">

					</div>

				</div>
				<div class="stripped-bottom border-top" v-if="theList && theList.length > 0">
					<levy-card  v-for="levy in theList" :key="levy.uuid" :levy="levy" @done="fetchData"></levy-card>
				</div>

				<div class="uk-padding-large uk-flex uk-flex-column uk-flex-middle" v-else>
					<h4>
						No levies found for your store
					</h4>
					<p>
						We could not find any levies for your store.
					</p>

					<div class="uk-flex">
						<button class="uk-button uk-button-primary tiny-margin-right" @click="clearFilters(); fetchData()">
							Reload Data
						</button>
					</div>
				</div>


			</div>
		</div>
	</div>
</template>
<script>
import loader from "@/mixins/loader"
export default {
	mixins : [loader],

	data(){
		return {
			type : '',
		}
	},

	computed : {
		queryParameters(){
			return `${this.type ? '&type='+this.type : ''}`
		},
	},

	methods : {
		clearFilters(){
			this.type = ''
		}

	},


	mounted(){
		this.fetchData()
	}
}
</script>
