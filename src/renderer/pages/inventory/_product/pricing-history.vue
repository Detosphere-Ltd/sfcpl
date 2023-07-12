<template>
	<div>
		<div class="background uk-margin-medium-bottom">

			<div class="uk-padding-small border-bottom uk-flex uk-flex-between uk-flex-middle">
				<div class="uk-width-expand">
					<h5 class="uk-margin-remove">Price History - {{product.name}}</h5>
				</div>

				<div class="uk-width-auto">
					<div class="chip background raised-deep bordered uk-padding-remove uk-border-rounded uk-flex">

						<span class="chip uk-border-rounded click" @click="displayAs = 'records'" :class="displayAs === 'records' ? 'primary-gradient uk-text-white' : '' ">
							<small>Show Records</small>
						</span>
						<span class="chip uk-border-rounded click" @click="displayAs = 'graph'" :class="displayAs === 'graph' ? 'primary-gradient uk-text-white' : '' ">
							<small>Visualize Data</small>
						</span>



					</div>
				</div>
			</div>

			<div class="tiny-padding border-bottom">
				<div class="uk-width-1-1 uk-flex uk-flex-top">

					<div class="uk-width-auto uk-margin-small-right uk-flex uk-flex-column">
						<span class="text-small tiny-margin-bottom uk-text-truncate">Purchases By Date</span>
						<partials-date-picker @date-set="applyDate"></partials-date-picker>
					</div>



					<div class="uk-width-medium  uk-flex uk-flex-column uk-margin-small-right tags-input">
						<span class="text-small tiny-margin-bottom uk-text-truncate">Select Varitaion</span>

						<a-select mode="default" v-model="variation"  not-found-content="No variation found" show-search filter-option option-filter-prop="name" show-arrow size="large">
							<a-select-option selected class="uk-text-truncate" name="All Variations" value="">
								All Variations
							</a-select-option>
							<a-select-option class="uk-text-truncate" v-for="variant in product.variations" :key="variant.uuid" :name="variant.variation.name" :value="variant.variation.uuid">
								{{variant.variation.name | capitalize}}
							</a-select-option>
						</a-select>
					</div>

					<div class="uk-width-medium  uk-flex uk-flex-column uk-margin-small-right tags-input">
						<span class="text-small tiny-margin-bottom uk-text-truncate">Updated By</span>

						<a-select mode="default" v-model="created_by"  not-found-content="No staff found" show-search filter-option option-filter-prop="name" show-arrow size="large">
							<a-select-option selected class="uk-text-truncate" name="Everyone" value="">
								Everyone
							</a-select-option>
							<a-select-option class="uk-text-truncate" v-for="staff in $store.getters['staff/activeCorporateStaff']" :key="staff.uuid" :name="staff.name" :value="staff.uuid">
								{{staff.name | capitalize}}
							</a-select-option>
						</a-select>
					</div>
				</div>
			</div>

			
			<div v-if="loading" class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center">
				<loaders-spinner></loaders-spinner>
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
					<div v-if="theList && theList.length > 0">
						<div class="stripped-bottom" v-if="displayAs === 'records'">
							<div class="uk-width-1-1 border-bottom tiny-padding uk-padding-remove-horizontal uk-padding-remove-top">
								<headers-price-history class="tiny-padding uk-padding-remove-bottom"></headers-price-history>
							</div>
							<template  v-for="(entry,i) in theList">
								<div class="uk-width-1-1 uk-flex uk-flex-middle tiny-padding">


									<div class="grid-gutter product-identity">
										<span class="uk-margin-remove text-small">

											{{entry.product_variation.variation.name | capitalize | variationize }} - {{entry.product_variation.code}}

										</span>
									</div>

									<div class="grid-gutter uk-margin-small-right">
										<template v-if="entry.difference !== 0">
											<span class="mdi " :class="[entry.difference > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down', colorize(entry.difference)] "></span>
										</template>

										<template v-else>
											<span class="mdi mdi-minus "></span>
										</template>
									</div>
									<div class="grid-gutter uk-width-small">
										<span class="uk-margin-remove text-small">
											{{entry.previous_amount | currency('')}}
										</span>
									</div>
									<div class="grid-gutter uk-width-small" :class="colorize(entry.current_amount - entry.previous_amount)">
										<span class="uk-margin-remove text-small">
											{{entry.current_amount | currency('')}}
										</span>
									</div>

									<div class="grid-gutter uk-width-small">
										<span class="uk-margin-remove text-small" :class="colorize(entry.difference)">

											<template v-if="entry.difference !== 0">{{ entry.difference > 0 ? '+' : ''  }}</template>{{ entry.difference | currency('')}}
										</span>
									</div>


									<div class="grid-gutter uk-width-small">
										<span class="uk-margin-remove text-small">
											{{$moment(entry.created_at).format('DD MMM, YYYY')}}
										</span>
									</div>

									<div class="grid-gutter uk-visible@xl uk-width-small uk-flex uk-flex-middle">
										<partials-avatar v-if="entry.created_by && entry.created_by.avatar" :size="20" :media="entry.created_by.avatar" class="tiny-margin-right"></partials-avatar>
										<span class="uk-margin-remove text-small uk-text-truncate">
											{{entry.created_by && entry.created_by.name ? entry.created_by.name : 'System Generated'}}
										</span>
									</div>

									<div class="grid-gutter uk-width-small uk-margin-auto-left"></div>

								</div>
							</template>
							<div class="border-top tiny-padding uk-flex uk-flex-center" v-if="pagination && pagination.total_pages > pagination.current_page">
								<button class="uk-button uk-button-primary uk-button-small" :disabled="fetching" @click="loadExtraData" :class="{loading : fetching}">
									Load More Records
								</button>
							</div>
						</div>

						<div class="tiny-padding background" v-else>
							<charts-price-history :seriesData="seriesData"></charts-price-history>
						</div>
					</div>

					<div class="uk-padding-large uk-flex uk-flex-column uk-flex-middle" v-else>
						<h4>
							No price history records found
						</h4>
						<p>
							We could not find any pricing history for this product.
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
	</div>
</template>
<script>
import {bindProps} from "@/mixins/product/singleton"
import loader from "@/mixins/loader"
export default{
	mixins : [bindProps, loader],

	computed : {
		ownUrl(){
			return `products/${this.product.uuid}/price-changes?include=created_by,product_variation,product_variation.product,product_variation.variation,product_variation.product.media&paginate=0${this.queryParameters}`
		},
		queryParameters(){
			return `
			${this.variation ? '&variation='+this.variation : ''}
			${this.created_by ? '&created_by='+this.created_by : ''}
			${this.from && this.to ? '&start='+this.from+'&end='+this.to : ''}`
		},
	},

	data(){
		return {
			variation : '',
			to : undefined,
			from : undefined,
			created_by : '',
			displayAs : 'records',
			seriesData : []
		}
	},


	methods : {
		clearFilters(){
			this.from = undefined
			this.to = undefined
			this.variation = ''
			this.created_by = ''
		},

		applyDate(payload){
			this.to = this.$moment(payload.endDate).format('DD/MM/YYYY')
			this.from = this.$moment(payload.startDate).format('DD/MM/YYYY')
		},

		generateChartData() {
			const series = [];
			const variations = {};

			for (const item of this.list) {
				const variant = item.product_variation.uuid;

				if (!variations[variant]) {
					const variationName = this.$options.filters.capitalize( item.product_variation.variation.name)
					variations[variant] = {
						name: variationName,
						data: [],
					}
				}

				const timestamp = this.$moment(item.created_at)
				const priceChange = item.current_amount

				variations[variant].data.push({
					x: timestamp,
					y: priceChange,
				})
			}

			for (const variation of Object.values(variations)) {
				series.push(variation)
			}

			this.seriesData = series
		}
	},

	async mounted(){
		await this.fetchData()
		this.$on('loaded', ()=>{
			this.generateChartData()
		})
	}
};
</script>
