const DOWNLOADER = require('js-file-download');
const importer = {
	props : {
		resource : {
			required : true,
			type : Object
		}
	},

	data(){
		return {
			uploading : false, 
			sheet : undefined,
			downloading : false
		}
	},
	methods : {

		async handFileSelected(){
			this.sheet  = this.$refs.exSheetFile.files[0]
		},

		async uploadExcel(){
			this.uploading = true
			let uploadForm = new FormData();
			await uploadForm.append('file', this.sheet)

			await this.$axios.$post(`${this.resource.path}/import`, uploadForm,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(() => {
				this.sheet = undefined
				this.uploading = false
				this.$message.success(`${this.resource.name} imported`, 4)
				this.$emit('import-completed')
				this.removeSelectedFile()

				if (this.showModal) {
					this.showModal = false
				}
			})
			.catch((err)=>{
				this.$message.error(`Failed to import ${this.resource.name} : ${(this.errors && this.errors[0])? this.errors[0] : ''}  ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 4)
				this.uploading = false
			})
			.finally(() => {
				this.uploading = false
			})
		},

		async downloadTemplate(){
			this.downloading = true
			this.$axios.$get(`/${this.resource.path}/import/template`,  { responseType: 'blob'})
			.then(async (res) =>{
				await DOWNLOADER(res, `${this.resource.name}-template.xlsx`)
				this.$message.success(`Template downloaded` , 4)
			})
			.catch((err)=>{
				this.$message.error(`Failed to download template` , 4)
			})
			.finally(()=>{
				this.downloading = false
			})
		},

		removeSelectedFile(){
			if (this.uploading) {
				return
			}
			this.sheet = undefined
			this.$refs.exSheetFile.files = null
		}
	},
}
export {importer}