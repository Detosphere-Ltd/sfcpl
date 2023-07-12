<template>
	<div class="uk-width-1-1 uk-flex uk-flex-middle">
		<div class="grid-gutter uk-margin-auto-right">
			<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
				Name
			</h6>
		</div>

		<slot></slot>

		<div class="grid-gutter uk-width-small  uk-margin-auto-left">
			<div class="uk-width-1-1">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Location
				</h6>
			</div>
		</div>

		<div class="grid-gutter uk-width-small">
			<div class="uk-width-1-1">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Phone
				</h6>
			</div>
		</div>
		<div class="grid-gutter uk-width-small">
			<div class="uk-width-1-1">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Email
				</h6>
			</div>
		</div>
		<div class="grid-gutter uk-width-small  uk-visible@xl">
			<div class="uk-width-1-1">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Status
				</h6>
			</div>
		</div>



		<div class="grid-gutter uk-visible@xl uk-width-small">
			<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
				Added By
			</h6>
		</div>

	</div>
</template>
<script>
export default {

}
</script>
