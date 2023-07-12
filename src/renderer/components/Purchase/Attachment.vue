<template>
	<div>
<!-- 		<div class="chip bordered uk-border-rounded uk-flex-middle click">
			<span class="text-small tiny-margin-right">
				Invoice Attachment
			</span>

			<span class="mdi" :class="open ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
		</div> -->
		<div class="square-25 uk-border-rounded bordered click uk-flex uk-flex-column uk-flex-center uk-flex-middle" @click="$uikit.drop($refs.attachmentDrop).show()">
			<span class="mdi" :class="invoice.file ? 'mdi-download' : 'mdi-upload'"></span>
		</div>

		<div uk-drop="mode:click;pos:bottom-center; offset: 5; delay-hide:0" ref="attachmentDrop" class="uk-width-auto">
			<div class="uk-width-auto uk-border-rounded raised uk-flex uk-flex-column background bordered">
				<div class="tiny-padding uk-flex border-bottom click"  v-if="invoice.file"  @click="downloadAttachment(); $uikit.drop($refs.attachmentDrop).hide()">
					<span class="mdi mdi-download uk-margin-small-right"></span>
					<span>
						Donwload Attached File 
					</span>
				</div>
				<div class="tiny-padding uk-flex click" @click=" $uikit.drop($refs.attachmentDrop).hide(); uploadModal = true">
					<span class="mdi mdi-upload uk-margin-small-right"></span>
					<span>
						Attach Invoice File
					</span>
				</div>
			</div>
		</div>


		<vue-final-modal v-model="uploadModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" @before-close="removeFile">
			<div class="uk-card rounded bordered background raised-deep uk-margin-auto uk-margin-auto-vertical uk-width-1-1 uk-inline  uk-width-1-1 uk-width-large">
				<div class="tiny-padding uk-background-danger rounded-top" v-if="invoice.file">
					<p class="uk-margin-remove uk-text-white">
						Uploading a new file will replace the current uploaded file.
					</p>
				</div>
				<div class="uk-position-cover background bordered rounded raised-deep uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-position-z-index" v-if="uploading">
					<div class="uk-width-large uk-flex uk-flex-column uk-flex-middle">
						<loaders-spinner></loaders-spinner>
						<p class="uk-margin-top uk-text-center">
							Uploading File
						</p>
					</div>
				</div>
				<div class="modal-content uk-overflow-auto uk-width-1-1">
					<div class="uk-padding uk-flex uk-flex-column uk-flex-middle">

						<div class="square-50 background bordered uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-bottom">
							<span class="mdi mdi-cloud-upload lni-large"></span>
						</div>

						<h4 class="uk-text-center">
							Upload Invoice File
						</h4>
						<p class="uk-text-center">
							Upload your invoice receipt to keep an evidence of this invoice for later reference.
						</p>

						<div class="uk-flex uk-flex-column uk-width-1-1 uk-margin-small-bottom">
							<template v-if="invoiceReceiptFile">
								<div class="tiny-padding uk-border-rounded uk-flex uk-flex-center uk-background-success uk-text-white">
									<span class="mdi mdi-receipt uk-margin-small-right"></span>
									<span class="text-small">
										Invoice Attachment Selected
									</span>
								</div>

								<div class="uk-flex uk-flex-center uk-margin-small-top ">
									<div class="chip background bordered click uk-border-rounded uk-margin-small-right" @click.prevent="$refs.invoiceReceipt.click()">
										<small>
											Choose Another File
										</small>
									</div>

									<div class="chip uk-background-danger uk-text-white click uk-border-rounded" @click.prevent="removeFile">
										<small>
											Remove File
										</small>
									</div>

								</div>

							</template>
							<div class="tiny-padding uk-width-medium uk-margin-auto uk-border-rounded uk-flex uk-flex-center bordered click" @click.prevent="$refs.invoiceReceipt.click()" v-else>
								<span class="mdi mdi-plus-circle tiny-margin-right"></span>
								<span class="text-small">Click to select file</span>
							</div>
						</div>
						<!-- <p class="uk-text-danger uk-text-center" v-if="uploadFail">
							PS: We could not upload the attachment of this invoice at this very moment but do not worry. You can try uploading it again from your "Purchase Invoices" records.
						</p> -->
					</div>
				</div>

				<div class="uk-width-1-1 tiny-padding border-top uk-flex uk-flex-center">
					<button class="uk-button uk-button-danger tiny-margin-right" @click.prevent="uploadModal = false">
						Close
					</button>

					<button class="uk-button uk-button-small uk-button-primary" v-if="can('record-purchases')" :disabled="!invoiceReceiptFile" @click="uploadHandler">
						Upload Selected File
					</button> 
				</div>
			</div>
		</vue-final-modal>

		<input type="file" hidden ref="invoiceReceipt" :key="fileSelected" accept="application/pdf, image/jpeg, image/png" @change="handleFileSelect">

	</div>	
</template>
<script>
import {bindProps} from "@/mixins/purchase/invoice"
export default{
	mixins : [bindProps],
	data(){
		return {
			invoiceReceiptFile : undefined,
			open : false,
			uploadModal : false,
			uploading : false
		}
	},

	computed : {
		fileSelected(){
			return this.invoiceReceiptFile ? 'fileSelected' : 'none'
		}
	},


	methods : {
		handleFileSelect(){
			this.invoiceReceiptFile = this.$refs.invoiceReceipt.files.length > 0 ? this.$refs.invoiceReceipt.files[0] : undefined
		},

		removeFile(){
			this.invoiceReceiptFile = undefined
			this.$refs.invoiceReceipt.files = null
		},
		async uploadHandler(){
			this.uploading = true
			let form = new FormData()
			form.append('file', this.invoiceReceiptFile)
			await this.$axios.$post(`/purchase-invoices/${this.invoice.uuid}/media`, form, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(res=>{
				this.$message.success(`File attachment uploaded.`)
				this.uploadModal = false
				this.$emit('uploaded')
			})
			.catch(err=>{
				this.$message.error(`Failed to upload your attachment. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 6)
			})
			.finally(()=>{
				this.uploading = false

			})
		},

	}
};
</script>