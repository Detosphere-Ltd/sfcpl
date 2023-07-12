<template>
	<div class="uk-width-auto uk-inline">
		<div @click="$uikit.drop($refs.tipToe).show()" class="click">
			<slot name="action-button">
				<div class="square-20 tip uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle">
					<span class="mdi mdi-help uk-text-white"></span>
				</div>
			</slot>
		</div>
		<div uk-drop="mode:click; pos: bottom; delay-hide : 0;" ref="tipToe">
			<div class="uk-width-medium background bordered uk-border-rounded raised">
				<div class="uk-width-1-1">
					<div class="grid-padding border-bottom uk-flex uk-flex-middle">
						<div class="square-25 tip uk-border-circle tiny-margin-right uk-flex uk-flex-column uk-flex-center uk-flex-middle">
							<span class="mdi mdi-lightbulb uk-text-white"></span>
						</div>
						<h6 class="uk-margin-remove uk-text-bold">
							Transfer Reasons
						</h6>

						<button class="uk-button uk-button-small uk-button-view uk-margin-auto-left" @click="$uikit.drop($refs.tipToe).hide()">
							Ok
						</button>
					</div>

					<div class="tiny-padding">

						<p class="uk-margin-remove">
							When creating a transfer, you can enter a new reason or select from a list of previous reasons why you are making a transfer. All new reasons automaically get added to the list of selectable reasons for future use. 
						</p>						
					</div>

				</div>


			</div>
		</div>
	</div>
</template>
