<template>
	<div>
		<div @click="showModal = true" class="click">
			<slot name="action-button">
				<button class="uk-button uk-button-small uk-button-view">
					Edit Info
				</button>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="true" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1  background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s ">

					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Edit Branch Info
						</h5>
						<a class="uk-button uk-button-small uk-button-danger" @click="showModal = false">
							Close
						</a>
					</div>
					<div class="uk-padding-small">



						<form class="uk-width-1-1 uk-grid-collapse uk-flex uk-flex-wrap" uk-grid>
							<div class="grid-padding uk-width-1-1 uk-flex uk-flex-column">
								<span class="uk-text-small">
									Branch Name
								</span>
								<input type="text" v-model="branchInfo.name" class="uk-input uk-text-small uk-form-large">
								<small v-if="errors && errors.name" class="uk-text-danger">
									{{errors.name[0]}}
								</small>
							</div>
					<!-- 		<div class="grid-padding uk-width-1-1 uk-flex uk-flex-column">
								<span class="uk-text-small">
									Country
								</span>
								<input type="text" v-model="branchInfo.country" class="uk-input uk-text-small uk-form-large">
								<small v-if="errors && errors.country" class="uk-text-danger">
									{{errors.country[0]}}
								</small>
							</div> -->
							<div class="grid-padding uk-width-1-1 uk-flex uk-flex-column">
								<span class="uk-text-small">
									City
								</span>
								<input type="text" v-model="branchInfo.city" class="uk-input uk-text-small uk-form-large">
								<small v-if="errors && errors.city" class="uk-text-danger">
									{{errors.city[0]}}
								</small>
							</div>

							<div class="tiny-padding uk-width-1-1 uk-flex uk-flex-center border-top uk-margin-small-top">
								<button class="uk-button uk-button-primary" @click.prevent="updateBranch">
									<partials-loader v-if="loading"></partials-loader>	
									<template v-else>
										Update Branch
									</template>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
export default{
	props :{
		branch : {
			required : true,
			type : Object
		}
	},

	data(){
		return {
			showModal : false,
			loading : false,
			branchInfo : {
				name : this.branch.name ? this.branch.name : '',
				country : this.branch.country ? this.branch.country : '',
				city : this.branch.city ? this.branch.city : ''
			}
		}
	},

	methods : {
		async updateBranch(){
			this.loading = true
			await this.$axios.$patch(`/branches/${this.branch.uuid}`, this.branchInfo)
			.then(()=>{
				this.$message.success('Branch Info Updated', 4)
				this.showModal = false
				this.$emit('done')
			})
			.catch(()=>{
				this.$message.error("Failed to update branch info", 4)
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}

};
</script>
