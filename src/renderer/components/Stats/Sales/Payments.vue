<template>
	<div class="uk-border-rounded background tiny-padding">
		<h5>
			Payment Modes by Sales
		</h5>
		<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle uk-padding-small"  v-if="loading">
			<loaders-spinner></loaders-spinner>
			<p class="uk-margin-top">
				Loading stats...
			</p>
		</div>
		<template v-else>
			<template v-if="failed">
				<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle uk-padding-small">
					<span class="mdi mdi-alert-box uk-text-danger uk-margin-small-bottom lni-extra-large"></span>
					<span class="chip bordered uk-border-rounded click uk-text-small" @click="getStats('statistics/sales-by-payment-types')">
						<span class="tiny-margin-right tiny-margin-left">
							Failed to load data. Click to retry
						</span>
					</span>
				</div>
			</template>
			<div class="uk-width-1-1 uk-flex uk-flex-column stats-list" v-else>
				<div class="uk-width-1-1 grid-padding uk-padding-remove-horizontal uk-margin-small-bottom">
					<div class="uk-text-capitalize uk-flex  uk-flex-wrap uk-flex-top">
						<div class="square-20 uk-border-rounded tiny-margin-right uk-background-success"></div>
						<div class="uk-width-expand uk-flex uk-flex-between">
							<span class="uk-text-capitalize uk-text-bold">
								Total
							</span> 

							<span class="uk-text-bold">
								{{ commulativeAmount | currency(`${emporium.currency} `)}} 
							</span>
						</div>
					</div>	
				</div>
				
				<template v-for="(stat, key) in stats">
					<div class="uk-width-1-1 grid-padding stat-item uk-padding-remove-horizontal" :key="key">
						<div class="uk-text-capitalize uk-flex  uk-flex-wrap uk-flex-middle">
							<div class="square-15 uk-border-rounded tiny-margin-right" :style="`background-color : ${colors[key]}`"></div>
							<div class="uk-width-expand uk-flex uk-flex-between">
								<span class="uk-text-capitalize">
									{{stat.payment_mode}} 
								</span> 

								<span>
									{{stat.amount | currency(`${emporium.currency} `)}} 
								</span>

							</div>
						</div>	
					</div>
				</template>

				<div class="uk-width-1-1 uk-margin-top">
					<div class="uk-flex ">
						<template v-for="(gItem, gKey) in stats">
							<div class="uk-width-1-1 grid-padding uk-padding-remove-left" :key="`graph${gKey}`">
								<div class="uk-flex uk-flex-column" style="height: 140px">
									<div class="uk-height-1-1 uk-flex">
										<div class="uk-width-1-3" style=" writing-mode: vertical-lr;transform: rotate(180deg);">
											{{gItem.payment_mode}} ({{percentOf(gItem.amount)}}%)
										</div>
										<div class="uk-border-rounded tiny-margin-right uk-width-1-2 uk-margin-auto uk-margin-auto-vertical uk-margin-remove-bottom" :style="`background-color : ${colors[gKey]}; height : ${percentOf(gItem.amount)}%`"></div>
									</div>	
								</div>
							</div>
						</template>
					</div>


				</div>


			</div>
		</template>
	</div>
</template>
<script>
import basic from "@/mixins/stats/generic"
export default{
	mixins : [basic],
	async mounted(){
		await this.getStats('statistics/sales-by-payment-types')
	},

	computed : {
		colors(){
			return ['#ffa400', '#8a6d38', '#504634', '#6b6863']
		},
		
		commulativeAmount(){
			let amount = 0
			this.stats.forEach((item)=>{
				amount += parseFloat(item.amount)
			})
			return amount
		}
	},

	methods : {
		percentOf(data){

			return data > 0 ?  Math.round(( parseFloat(data) / this.commulativeAmount) * 100) : 0
		}
	}
};
</script>
