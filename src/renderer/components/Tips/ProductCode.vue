<template>
	<div>
		<div @click="$uikit.drop($refs.tipToe).show()" class="click">
			<slot name="action-button">
				<div class="square-20 tip uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle">
					<span class="mdi mdi-help uk-text-white"></span>
				</div>
			</slot>
		</div>
		<div uk-drop="mode:click; pos: top-left; delay-hide : 0" ref="tipToe">
			<div class="uk-width-medium">
				<div class="uk-width-1-1 background bordered uk-border-rounded raised">
					<div class="grid-padding border-bottom uk-flex uk-flex-middle">
						<div class="square-25 tip uk-border-circle tiny-margin-right uk-flex uk-flex-column uk-flex-center uk-flex-middle">
							<span class="mdi mdi-lightbulb uk-text-white"></span>
						</div>
						<h6 class="uk-margin-remove uk-text-bold">
							Product Codes
						</h6>
					</div>

					<div class="tiny-padding">
						<p class="uk-margin-remove">
							Product codes are required when creating products. You can leave it blank and rely on our system genrated products codes. This will help in the categorization of all products registered in your catalog. 
						</p>
						<h6 class="uk-margin-small-top uk-text-danger">
							Important Notice!
						</h6>
						<ul class="uk-list">
							<li>Product Codes cannot be modified after they are created by you or system generated by {{$appName}}.  
								<a @click.prevent="openLink(`${$guides}/catalog#codes`)" class="uk-text-primary underlined">
								You can learn more about product codes here</a>
							</li>
						</ul>						
					</div>



					<div class="uk-width-1-1 tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-small uk-button-view" @click="$uikit.drop($refs.tipToe).hide()">
							Got It
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
