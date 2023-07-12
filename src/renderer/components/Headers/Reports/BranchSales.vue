<template>
	<div class="uk-width-1-1 uk-flex uk-flex-middle">
		<div class="grid-gutter uk-width-medium uk-margin-right">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Branch
			</h6>
		</div>
		<div class="grid-gutter uk-width-small">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Sales Frequency
			</h6>
		</div>
		<div class="grid-gutter uk-width-small">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Units Sold
			</h6>
		</div>
		<div class="grid-gutter uk-width-small">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Gross Total
			</h6>
		</div>

		<div class="grid-gutter uk-width-small">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Taxes
			</h6>
		</div>

		<div class="grid-gutter uk-width-small">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Discount Given
			</h6>
		</div>

		<div class="grid-gutter uk-width-small">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Net Amount
			</h6>
		</div>

		<div class="grid-gutter uk-width-small">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Est. Profit Amount
			</h6>
		</div>

		<div class="grid-gutter uk-width-small">
			<h6 class="uk-text-break uk-margin-remove uk-text-uppercase text-small">
				Est. Profit Margin
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
