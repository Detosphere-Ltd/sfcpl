<template>
	<div class="uk-width-auto uk-inline">
		<div @click="$uikit.drop($refs.tipToe).show()" class="click">
			<slot name="action-button">
				<div class="square-20 tip uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle">
					<span class="mdi mdi-help uk-text-white"></span>
				</div>
			</slot>
		</div>
		<div uk-drop="mode:click; pos: bottom-left; delay-hide : 0" ref="tipToe">
			<div class="uk-width-medium background bordered uk-border-rounded raised">
				<div class="uk-width-1-1">
					<div class="grid-padding border-bottom uk-flex uk-flex-middle">
						<div class="square-25 tip uk-border-circle tiny-margin-right uk-flex uk-flex-column uk-flex-center uk-flex-middle">
							<span class="mdi mdi-lightbulb uk-text-white"></span>
						</div>
						<h6 class="uk-margin-remove uk-text-bold">
							Transfers
						</h6>
					</div>

					<div class="tiny-padding">
						<p class="uk-margin-remove">
							Transfers allow you to move products within your store conveniently. To Transfer products, go to your "Warehouse Stock" and select the products you want to transfer. After selecting the reason for the transfer, you will be able to proceed to set quantities to transfer and create your transfer. 
						</p>
						<p class="tiny-margin-top">
							Note that transfers will only update your warehouse stock once they are confirmed. Transfers have to be dispatched from the warehouse and confirmed at the destination branch for stock changes to take effect. 
						</p>						
					</div>



					<div class="uk-width-1-1 tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-small uk-button-view tiny-margin-right" @click="$uikit.drop($refs.tipToe).hide()">
							Got It
						</button>
					</div>
				</div>


			</div>
		</div>
	</div>
</template>
