<template>
	<div class="uk-width-1-1 uk-flex uk-flex-middle">
		<div class="grid-gutter tiny-margin-right uk-light">
			<slot></slot>
		</div>

		<div class="grid-gutter uk-width-auto tiny-margin-right">
			<div style="width: 50px">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Image
				</h6>
			</div>
		</div>
		<div class="grid-gutter uk-width-expand">
			<div>
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Name
				</h6>
			</div>
		</div>
		<div class="grid-gutter">
			<div class="uk-width-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Vartiaions
				</h6>
			</div>
		</div>
		
		<div class="grid-gutter">
			<div class="uk-width-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small uk-text-center">
					Quantity
				</h6>
			</div>
		</div>

		<div class="grid-gutter uk-visible@xl">
			<div class="uk-width-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Added
				</h6>
			</div>
		</div>

		<div class="grid-gutter">
			<div class="uk-width-small">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					Added By
				</h6>
			</div>
		</div>

		<div class="grid-gutter action-box">
			<div class="uk-flex uk-flex-right">
				<h6 class="uk-text-truncate uk-margin-remove uk-text-uppercase text-small">
					More
				</h6>
			</div>
		</div>

	</div>
</template>
