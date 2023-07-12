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
							Purchase Units
						</h6>
					</div>

					<div class="tiny-padding">
						<p class="uk-margin-remove">
						Purchase units are optional. When used, this feature allows us to categorize all purchases made in your store. {{$appName}} comes preconfigured with "Box" and "Pieces" but you can extend this by creating your own purchase units</p>					
					</div>



					<div class="uk-width-1-1 tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-small uk-button-view tiny-margin-right" @click="$uikit.drop($refs.tipToe).hide()">
							Got It
						</button>

						<button class="uk-button uk-button-small uk-button-primary" @click="$uikit.drop($refs.tipToe).hide(); $router.push({name: 'inventory-purchases-units'})" v-if="can('create-unit-types')">
							Create One Now
						</button>
					</div>
				</div>


			</div>
		</div>
	</div>
</template>
<script>
import external from "@/mixins/utils/external"
export default{
	mixins : [external]
};
</script>
