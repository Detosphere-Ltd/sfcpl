<template>

	<div class="tiny-padding border-bottom">

		<div class="uk-flex">
			<div class="chip click uk-border-rounded background bordered text-small" @click="showStats = !showStats" :class="showStats ? 'uk-margin-small-bottom' : ''">
				{{showStats ? 'Hide' : 'Show' }} Statistics
			</div>
		</div>
		
		<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-child-width-auto" v-show="showStats">


			<div class="tiny-padding background  bordered uk-border-rounded tiny-margin-bottom tiny-margin-right">
				<div class="tiny-padding uk-padding-remove-vertical uk-flex uk-flex-column">
					<span class="text-small">
						Gross Sales
					</span>

					

					<h4 class="tiny-margin-top tiny-margin-bottom uk-text-bold">
						{{ (parseFloat(stats.total_valid_sales_amount ? stats.total_valid_sales_amount : 0 ) + parseFloat(stats.total_invalid_sales_amount ? stats.total_invalid_sales_amount : 0)) | currency(`${emporium.currency} `)}}
					</h4>

					<span>
						{{stats.total_sales ? stats.total_sales : 0  | pluralize('Sale')}}
					</span>

				</div>

			</div>



			<div class="tiny-padding background  bordered uk-border-rounded tiny-margin-bottom tiny-margin-right">
				<div class="tiny-padding uk-padding-remove-vertical uk-flex uk-flex-column">
					<span class="text-small">
						Net Sales
					</span>
					
					<h4 class="tiny-margin-top tiny-margin-bottom uk-text-bold">
						{{stats.total_valid_sales_amount | currency(`${emporium.currency} `)}}
					</h4>
					<span class="uk-margin-remove">
						{{stats.total_valid_sales ? stats.total_valid_sales : 0  | pluralize('Sale')}}
					</span>
				</div>

			</div>



			<div class="tiny-padding background  bordered uk-border-rounded tiny-margin-bottom tiny-margin-right">
				<div class="tiny-padding uk-padding-remove-vertical uk-flex uk-flex-column">
					<span class="text-small">
						Reversed Sales
					</span>
					
					<h4 class="tiny-margin-top tiny-margin-bottom uk-text-bold">
						{{ stats.total_invalid_sales_amount  ? stats.total_invalid_sales_amount : 0 | currency(`${emporium.currency} `)}}
					</h4>
					<span class="uk-margin-remove">
						{{stats.total_invalid_sales ? stats.total_invalid_sales : 0  | pluralize('Sale')}}
					</span>
				</div>

			</div>

			<div class="tiny-padding background  bordered uk-border-rounded tiny-margin-bottom tiny-margin-right">
				<div class="tiny-padding uk-padding-remove-vertical uk-flex uk-flex-column">
					<span class="text-small">
						Total Discount Given
					</span>

					<h4 class="tiny-margin-top tiny-margin-bottom uk-text-bold">
						{{ stats.total_discount_given | currency(`${emporium.currency} `)}}
					</h4>
					<span class="uk-margin-remove">
						{{ stats.total_valid_sales ? stats.total_valid_sales : 0  | pluralize('Sale')}}
					</span>
				</div>

			</div>

			<div class="tiny-padding background  bordered uk-border-rounded tiny-margin-bottom tiny-margin-right">
				<div class="tiny-padding uk-padding-remove-vertical uk-flex uk-flex-column">
					<span class="text-small">
						Total Taxes
					</span>
					
					<h4 class="tiny-margin-top tiny-margin-bottom uk-text-bold">
						{{stats.total_tax_amount ? stats.total_tax_amount : 0 | currency(`${emporium.currency} `)}}
					</h4>
					<span class="uk-margin-remove">
						{{ stats.total_valid_sales ? stats.total_valid_sales : 0  | pluralize('Sale')}}
					</span>
				</div>

			</div>


			<div class="uk-margin-auto-vertical uk-margin-remove-bottom uk-width-expand">
				<slot name="extras"></slot>
			</div>
		</div>

		
	</div>
</template>
<script>
export default{
	props : {
		stats : {
			type : Object,
			required : true
		}
	},

	data () {
		return {
			showStats : true
		}
	}
};
</script>
