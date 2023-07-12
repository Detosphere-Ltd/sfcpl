<template>
	<div>
		<button class="uk-button uk-button-primary uk-button-small" :class="{ loading : processing}" :disabled="processing" @click="downloadSlip()">
			Download Transfer Slip
		</button>
	</div>	
</template>
<script>
const DOWNLOADER = require('js-file-download');
const mime = require('mime-types')
import {base, bindProps} from "@/mixins/transfer/singleton"
export default {
	mixins : [base, bindProps],

	methods : {

		async downloadSlip(){


			let slip = this.transfer.transfer_slip_url

			if (!slip) {
				this.processing = true
				await this.$axios.$post(`/transfers/${this.transfer.uuid}/generate-slip`)
				.then(res=>{
					slip = res.data.file
				})
				.catch(err=>{
					this.$message.error(`Failed to Generate Transfer Slip` , 4)
				})
				.finally(()=>{
					this.processing = false
				})
			}

			if (!slip) {
				return
			}

			this.$message.loading('Downloading file...', 0)
			this.$axios.$get(`${slip}`,  { responseType: 'blob'})
			.then(async (res) =>{
				let extension = mime.extension(res.type)
				await DOWNLOADER(res, `${this.transfer.reference_no ? 'Transfer_ref_no'+this.transfer.reference_no : 'Transfer Slip'}.${extension}`)
				this.$message.destroy()
				this.$message.success(`Transfer Slip Downloaded` , 4)
			})
			.catch((err)=>{
				this.$message.destroy()
				this.$message.error(`Failed to Download Transfer Slip` , 4)
			})
			
		}
	}

}
</script>
