<template>
	<div class="uk-width-1-1 uk-inline">
		<input hidden class="uk-hidden" type="file" accept="image/jpeg,image/png" ref="fileSelect" @change="handFileSelected">
		<div class="uk-padding-small uk-width-1-1 uk-flex uk-flex-wrap">
			<div class="uk-width-1-1">


				<small>
					Store Logo				
				</small>
			</div>

			<div class="uk-width-1-1 uk-flex uk-flex-middle tiny-padding uk-padding-remove-horizontal">
				<div class="uk-width-auto uk-margin-small-right">
					<div  class="uk-inline" v-if="previewImageFile">
						<div  class="square-80 bordered sidebar uk-cover-container uk-border-circle" >
							<img :src="displayImage" alt="Store Logo" uk-cover>
						</div>

						<div  class="square-25 uk-position-top-right uk-background-danger click uk-border-circle uk-position-z-index uk-flex uk-flex-column uk-flex-center uk-flex-middle" @click="removeSelectedFile">
							<span class="mdi mdi-close lni-large uk-text-white text-small-spaced"></span>
						</div>
					</div>

					<partials-app-logo v-else size="80" class="bordered"></partials-app-logo>
				</div>

				<div class="uk-width-expand uk-flex uk-flex-column">
					<p class="uk-text-small uk-margin-remove">
						Upload an image file from your computer to set it as your store logo.
					</p>
					<div class="uk-flex uk-flex-middle tiny-padding uk-padding-remove-bottom uk-padding-remove-horizontal">
						<a @click.prevent="openFileDialog">
							<span class="uk-text-small uk-text-primary underlined">
								{{previewImageFile ? "Change" : "Select"}} Logo
							</span>
						</a>

						<button class="uk-button uk-button-primary uk-margin-small-left" v-if="previewImageFile" @click="uploadStoreLogo">
							Upload Logo
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="background uk-position-cover center uk-position-z-index" v-if="uploading">
			<partials-loader></partials-loader>
			<span class="uk-margin-top">
				Uploading Store Logo...
			</span>
		</div>

<!-- 		<div class="uk-width-auto uk-flex uk-flex-right">
			<div v-if="previewImageFile" class="uk-inline">
				<div  class="square-80 background uk-cover-container uk-border-circle" >
					<img :src="displayImage" alt="Store Logo" uk-cover>
				</div>

				<div class="square-25 uk-position-top-right uk-background-danger click uk-border-circle uk-position-z-index uk-flex uk-flex-column uk-flex-center uk-flex-middle" @click="removeSelectedFile">
					<span class="mdi mdi-close lni-large uk-text-white text-small-spaced"></span>
				</div>
			</div>

			<div class="square-80 background uk-border-circle dashed uk-flex uk-flex-column uk-flex-middle uk-flex-center click" v-else @click="openFileDialog">
				<span class="mdi mdi-upload lni-mid-large"></span>
			</div>
		</div> -->
	</div>
</div>
</template>
<script>
import { logoUpdoad } from "@/mixins/customize"
export default{
	mixins: [ logoUpdoad]
};
</script>
