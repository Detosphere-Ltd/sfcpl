<template>
	<div>
		<div>
			<div class="tiny-padding uk-padding-remove-top">

				<button class="uk-button uk-button-small"  @click="updateData('one_year')" :class="selection === 'one_year' ? 'uk-button-primary' : 'uk-button-view'">
					1 Year
				</button>
				<button class="uk-button uk-button-small"  @click="updateData('half_year')" :class="selection === 'half_year' ? 'uk-button-primary' : 'uk-button-view'">
					6 Months
				</button>

				<button class="uk-button uk-button-small" @click="updateData('month')" :class="selection === 'month' ? 'uk-button-primary' : 'uk-button-view'">
					1 Month
				</button>

				<button class="uk-button uk-button-small" @click="updateData('all_time')" :class="selection === 'all_time' ? 'uk-button-primary' : 'uk-button-view'"> 
					All Time
				</button>
			</div>
		</div>

		<div>
			<apexchart height="500" width="100%" ref="chart" :options="graphOptions" :series="seriesData"></apexchart>
		</div>
	</div>
</template>
<script>
export default {

	props : {
		seriesData : {
			type : Array,
			required : true
		}
	},

	data(){
		return {
			selection: 'all_time',
		}
	},

	computed : {
		graphOptions(){
			return {

				chart: {
					id: 'area-datetime',
					type: 'area',
					
					zoom: {
						autoScaleYaxis: true,
						// autoScaleYaxis: true
					},
					toolbar : {
						show : true,

						tools : {
							download : "<span class='mdi mdi-dots-vertical uk-text-large'></span>",
							zoom : false,
							zoomin : "<span class='mdi mdi-plus uk-text-large'></span>",
							zoomout : "<span class='mdi mdi-minus uk-text-large'></span>",
							reset : "<span class='mdi mdi-reload uk-text-large'></span>",
							pan : false
						}
					},

					selection: {
						enabled: false
					}
				},

				dataLabels: {
					enabled: false,
					distributed: true,
				},

				stroke: {
					curve: 'straight'
				},


				dataLabels: {
					enabled : false,
				},

				yaxis: [
				{
					title: {
						text: 'Product Prices',
					},

					min : 0
				}
				],

				xaxis: {
					type: 'datetime',
					min: new Date(this.emporium.created_at).getTime(),
					tickAmount: 6,
				},
				tooltip: {
					x: {
						format: 'dd MMM yyyy'
					}
				},

				fill: {
					type: 'gradient',
					gradient: {
						shadeIntensity: 1,
						opacityFrom: 0.7,
						opacityTo: 0.9,
						stops: [0, 100]
					}
				},

				grid: {
					yaxis: {
						lines: {
							offsetX: -30
						}
					},
					padding: {
						left: 20
					}
				},

				legend : {
					show : true,
					position : 'top',
					floating : true,
					showForZeroSeries : true,
					showForNullSeries : false,
					fontWeight : 'bold',
					onItemClick : {
						toggleDataSeries : false
					}
				}
			}

		}
	},

	methods : {
		updateData: function(timeline) {
			this.selection = timeline

			switch (timeline) {
			case 'month':
				this.$refs.chart.zoomX(
					new Date(this.$moment().subtract(1, 'months')).getTime(),
					new Date(this.$moment()).getTime()
					)
				break
			case 'half_year':
				this.$refs.chart.zoomX(
					new Date(this.$moment().subtract(6, 'months')).getTime(),
					new Date(this.$moment()).getTime()
					)
				break
			case 'one_year':
				this.$refs.chart.zoomX(
					new Date(this.$moment().subtract(12, 'months')).getTime(),
					new Date(this.$moment()).getTime()
					)
				break
			case 'all_time':
				this.$refs.chart.zoomX(
					new Date(this.emporium.created_at).getTime(),
					new Date(this.$moment()).getTime()
					)
				break
			default:
			}
		}
	}
}
</script>
