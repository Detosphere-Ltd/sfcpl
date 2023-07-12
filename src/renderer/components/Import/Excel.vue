<template>
	<div>
		<div  @click="showModal = true">
			<slot name="action-button">				
				<button class="uk-button uk-button-primary uk-border-rounded uk-button-small">
					Import From Excel
				</button>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="true" overlay-class="uk-overlay-primary" @before-close="removeSelectedFile" attach=".app">
			<div class="uk-width-1-1 uk-margin-large-top uk-flex uk-flex-column uk-flex-middle">
				<div class="uk-width-1-1 uk-width-large@s  background bordered  rounded raised-deep uk-animation-scale-up uk-animation-fast">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Import Excel
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
							Close
						</a>
					</div>
					<div class="uk-padding-small">
						<div class="uk-flex">
							<div class="chip click bordered uk-border-rounded" @click="downloadTemplate" :disabled="downloading" :class="downloading ? 'loading' : ''">
								Download Template
							</div>
						</div>
						
						<div v-if="sheet" class="uk-margin-small-top uk-flex uk-flex-middle uk-flex-between">
							<div class="chip bordered uk-flex uk-flex-middle uk-border-rounded uk-background-success-op uk-width-expand uk-margin-small-right">
								<span class="mdi mdi-file-excel-outline tiny-margin-right"></span>
								<span>{{sheet.name}}</span>
							</div>

							<div class="square-25 uk-background-danger uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle click" @click="removeSelectedFile">
								<span class="mdi lni-small mdi-close uk-text-white"></span>
							</div>
						</div>

						<span class="uk-text-meta uk-text-danger" v-if="sheet && (errors && errors.file)">
							{{errors.file[0]}}
						</span>



						<div uk-form-custom class="uk-flex uk-flex-column uk-width-large click">
							<input type="file" :key="$moment().format('hh : mm : ss')" @change="handFileSelected" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" ref="exSheetFile" class="click">
							<button class="dashed uk-button-view grid-padding uk-width-1-1 uk-margin-small-top click uk-border-rounded" type="button" tabindex="-1">
								<span class="uk-text-small">
									{{sheet ? " Click Here To Change Selected File" : "Click Here To Select Excel File"}}
								</span>
							</button>
						</div>

						<div class="tiny-padding uk-padding-remove-horizontal uk-width-1-1 uk-flex uk-flex-center border-top uk-margin-small-top">
							<button class="uk-button uk-button-primary uk-border-rounded" :disabled="!sheet || uploading" @click="uploadExcel">
								<partials-loader v-if="uploading"></partials-loader>
								<template v-else>
									Import {{resource.name}}
								</template>
							</button>
						</div>
					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>

import {importer} from "@/mixins/importer"
export default {
	mixins : [importer],
	data(){
		return {
			showModal : false,
		}
	},
};
</script>
