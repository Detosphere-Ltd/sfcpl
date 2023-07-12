<template>
	<div class="uk-width-1-1">
		<input hidden class="uk-hidden" type="file" accept="image/jpeg" ref="fileSelect" @change="handFileSelected">
		<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle" v-if="!previewImageFile">
			<div class="uk-width-medium uk-height-medium uk-cover-container  rounded">
				<img :src="displayImage" alt="Staff Avatar" uk-cover>
			</div>
			<div class="uk-padding-small uk-padding-remove-horizontal">
				<button class="uk-button uk-button-view uk-border-rounded tiny-margin-bottom" @click="openFileDialog" :disabled="loading || uploading">
					Select Photo
				</button>


				<button class="uk-button uk-button-danger uk-border-rounded tiny-margin-bottom" @click.prevent="$emit('cancel')" :disabled="loading || uploading">
					Cancel
				</button>

			</div>
		</div>

		<div v-else>



			<div class="uk-width-medium uk-margin-auto uk-flex uk-flex-column uk-flex-middle">
				<button class="uk-button uk-button-view uk-border-rounded uk-margin-bottom" @click="openFileDialog" :disabled="loading || uploading">
					Select A Different Photo
				</button>
				<div class="uk-width-medium uk-height-medium uk-cover-container uk-margin-auto rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-inline">
					<vue-cropper :src="displayImage" :aspectRatio="1" ref="cropper" @crop="setFileData" :key="displayImage"></vue-cropper>

					<div class="uk-position-cover uk-background-primary-op rounded" v-if="uploading"></div>
				</div>



				<div class="tiny-padding uk-padding-remove-horizontal">
					<button class="uk-button uk-button-danger" @click.prevent="$emit('cancel')" :disabled="loading || uploading">
						Cancel
					</button>
					<button class="uk-button uk-button-primary" :disabled="loading || uploading" @click="uploadAvatar">
						<partials-loader v-if="loading || uploading"></partials-loader>
						<template v-else>
							Crop & Upload
						</template>
					</button>
				</div>
			</div>


		</div>
	</div>
</template>
<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import {bindProps} from "@/mixins/staff/singleton"
import { base , avatarUpload } from "@/mixins/staff/actions"
export default{
	mixins : [ bindProps , base , avatarUpload ],
	components: { VueCropper},
	data(){
		return {

		}
	},
};
</script>
