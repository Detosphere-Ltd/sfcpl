<template>
	<div class="uk-width-1-1 uk-flex uk-flex-middle">

		<div class="uk-width-medium grid-gutter uk-margin-right">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Product
			</h6>
		</div>

		<div class="uk-width-small grid-gutter">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Variation
			</h6>
		</div>
		<div class="uk-width-small grid-gutter">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Availbale Stock Quantity
			</h6>
		</div>

		<div class="uk-width-small grid-gutter">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Total Cost Of Stock 
			</h6>
		</div>
		<div class="uk-width-small grid-gutter">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Stock Value At Current Prices
			</h6>
		</div>

		<div class="uk-width-small grid-gutter">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Estimated Profit Amount
			</h6>
		</div>

		<div class="uk-width-small grid-gutter">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Estimated Profit Margin
			</h6>
		</div>

		<div class="grid-gutter uk-width-small" v-if="showBranch">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Branch
			</h6>
		</div>
	</div>
</template>
<script>
export default {
	props : {
		showBranch : {
			type : Boolean,
		default : false
		}
	}
}
</script>
