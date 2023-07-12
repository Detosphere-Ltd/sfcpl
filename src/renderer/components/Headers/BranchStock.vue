<template>
	<div class="uk-width-1-1 uk-flex uk-flex-middle">
		<div class="grid-gutter tiny-margin-right uk-light">
			<slot></slot>
		</div>

		<div class="grid-gutter uk-width-medium">
			<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
				Name
			</h6>
		</div>



		<div class="grid-gutter uk-width-small uk-margin-auto-left">
			<div class="uk-width-1-1">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Quantity
				</h6>
			</div>
		</div>

		<div class="grid-gutter uk-width-x-small">
			<div>
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Health
				</h6>
			</div>
		</div>

		
		<div class="grid-gutter uk-width-small">
			<div>
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Stock LeveL
				</h6>
			</div>
		</div>

		
		<div class="grid-gutter uk-margin-right uk-width-small uk-flex uk-flex-left">
			<div class="uk-width-auto uk-margin-right">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Availability
				</h6>
			</div>
		</div>
		<div class="grid-gutter uk-width-small">
			<div class="uk-width-1-1">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Date Restocked
				</h6>
			</div>
		</div>

	</div>
</template>
<script>
export default {
	
}
</script>
