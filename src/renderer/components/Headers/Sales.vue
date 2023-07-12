<template>
	<div class="uk-width-1-1 uk-flex uk-flex-middle">

		<div class="grid-gutter">
			<div class="uk-width-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Date Sold
				</h6>
			</div>
		</div>
		<div class="grid-gutter">
			<div class="uk-width-x-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Items
				</h6>
			</div>
		</div>
		<div class="grid-gutter">
			<div class="uk-width-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Sale Amount
				</h6>
			</div>
		</div>

		<div class="grid-gutter">
			<div class="uk-width-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Discount
				</h6>
			</div>
		</div>

		<div class="grid-gutter">
			<div class="uk-width-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Taxes
				</h6>
			</div>
		</div>

		<div class="grid-gutter">
			<div class="uk-width-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Total Payable
				</h6>
			</div>
		</div>

		<div class="grid-gutter tiny-margin-right">
			<div class="uk-width-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Amount Paid
				</h6>
			</div>
		</div>

		<div class="grid-gutter">
			<div class="uk-width-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Amt. Outstanding
				</h6>
			</div>
		</div>

		<div class="grid-gutter">
			<div class="uk-width-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Status
				</h6>
			</div>
		</div>

		<div class="grid-gutter" v-if="can('reverse-sales')">
			<div class="uk-width-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Reversal
				</h6>
			</div>
		</div>


		<div class="grid-gutter">
			<div class="uk-width-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Customer
				</h6>
			</div>
		</div>

	</div>
</template>
