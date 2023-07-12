<template>
	<div class="background">
		<div class="tiny-padding border-bottom uk-flex uk-flex-between">
			<div class="uk-width-expand uk-flex uk-flex-middle">

				<div class="square-30 uk-background-primary uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-small-right click" @click="clearFilters(); getData()">
					<span class="mdi uk-text-white" :class="loading ? 'mdi-loading spin' : 'mdi-reload'"></span>
				</div>
				
				<h4 class="uk-margin-remove">Financial Period Reports</h4>
			</div>

			<div v-if="can('close-financial-years')">
				<period-actions-close-year @done="getData()">
					<button class="uk-button uk-button-small uk-button-danger" slot="action-button">
						Close Current Period 
					</button>
				</period-actions-close-year>
			</div>
		</div>


		<div class="tiny-padding border-bottom">
			<div class="uk-width-1-1 uk-flex uk-flex-bottom uk-flex-wrap">
				
				<div class="uk-light uk-width-auto bordered tiny-padding uk-border-rounded">
					<label class="uk-flex">
						<input type="checkbox" class="uk-checkbox square-25 bordered uk-border-rounded" v-model="cancelled">
						<span class="uk-width-expand uk-margin-small-left">
							Also Show Cancelled Periods
						</span>
					</label>
				</div>
			</div>
		</div>


		
		<section class="uk-width-1-1 uk-flex uk-flex-column horizontal-scroll">
			
			<headers-reports-period class="border-bottom tiny-padding"></headers-reports-period>


			<div class="uk-width-1-1">
				<div v-if="loading" class="uk-padding-small uk-flex uk-flex-center uk-flex-middle uk-flex-column">
					<loaders-spinner></loaders-spinner>
				</div>

				<div v-else>

					<div v-if="failed && errData"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle background uk-padding uk-width-2xlarge@s  rounded uk-margin-auto uk-margin-top uk-margin-bottom">
						<acl-parse-error :errorData="errData">
							<button class="uk-button uk-button-primary" slot="further-action" @click="getData">
								Retry
							</button>
						</acl-parse-error>
					</div>
					<div v-else>
						<template v-if="years && years.length > 0">
							<div class="uk-width-1-1 uk-flex uk-flex-column stripped-bottom">
								<period-card  class="tiny-padding" v-for="(year,i) in years" :key="i" :year="year" @needs-to-refresh="getData()">
								</period-card>

								<div class="tiny-padding uk-flex uk-flex-center" v-if="pagination && pagination.total_pages > pagination.current_page">
									<button class="uk-button uk-button-primary uk-button-small" :disabled="fetching" @click="loadExtraData" :class="{loading : fetching}">
										Load More Records
									</button>
								</div>

							</div>
						</template>


						<div class="uk-width-1-1 uk-padding uk-padding-remove-top uk-margin-small-top" v-else>

							<div class="uk-width-2xlarge@m background rounded uk-padding uk-margin-auto">
								<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
										<span class="mdi mdi-calendar-text lni-extra-large uk-margin-bottom"></span>
										<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
											No Financial Periods found
										</h4>

										<p class="uk-text-center uk-margin-remove-top">
											We could not find any financial periods reports for {{emporium.name}}
										</p>


										<button class="uk-button uk-button-primary" @click="clearFilters(); getData()">
											Reload Data
										</button>



										<div class="uk-width-1-1 uk-padding bordered uk-margin-top uk-border-rounded">
											<div class="uk-width-1-1">
												<h3>
													What Are Financial Period Reports? 
												</h3>
												<p>
													Financial period reports provide you with a general snapshot of the state of affairs within a given period of operation in your store.
												</p>
												<p>
													To generated these reports, you would have had to close at the very least, the default financial year that is automatically setup for you by {{$appName}}.
												</p>

												<p>
													Please not that closing a financial period is not immediate. <br> The action to close your store's current financial period is executed at <b>00:00 UTC</b> so you have until then to change your mind if needed.
												</p>

												<period-actions-close-year @done="getData()"></period-actions-close-year>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</section>



	</div>
</div>
</template>
<script>
import {years} from "@/mixins/periods/load" 
export default{
	head(){
		return {
			title : `${this.$appName} | ${this.emporium.name} - Financial Year Report`
		}
	},

	mixins : [years],
	async created(){
		await this.getData()
	}
};
</script>
