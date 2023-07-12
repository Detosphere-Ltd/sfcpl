<template>
	<div>
		

		<div @click="showModal = true" class="click">
			<slot name="action-button">
				<button class="uk-button uk-border-rounded uk-button-small" @click="showModal = true" :class="branch.active ? 'uk-button-danger' : 'uk-button-primary'">
					{{ branch.active ? "Close" : "Activate" }} Branch
				</button>

			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-large-top" :esc-to-close="true" overlay-class="uk-overlay-primary">
			<div class="uk-card rounded background bordered raised-deep uk-margin-auto uk-margin-auto-vertical uk-margin-remove-top uk-width-1-1  uk-margin-auto uk-overflow-auto uk-width-medium@m uk-padding-remove">
				<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
					<h5 class="uk-margin-remove uk-text-bold">
						Edit Branch Info
					</h5>
					<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false">
						Close
					</a>
				</div>
				<div class="uk-width-1-1 uk-padding-small expresso uk-dark" v-if="branch.active">
					<h6 class="uk-text-white uk-margin-remove">
						Proceed with caution!
					</h6>
				</div>
				<div class="uk-padding-small">
					<div class="uk-flex uk-flex-wrap uk-flex-column">
						
						<h5 class="uk-text-bold uk-margin-remove">
							Are you sure you want to {{branch.active ? "close" : "activate" }} this branch?
						</h5>
					</div>
					
					<hr class="uk-margin-small-bottom uk-margin-small-top">
					<p class="uk-margin-remove">
						{{branch.name}} and it's related entities including staff and products will be affected by this operation.
					</p>

					<div v-if="branch.active">
						<p>
							Among other things, 
						</p>

						<ul class="uk-list uk-list-bullet">
							<li v-for="(effect, key) in affected" :key="key">
								{{effect}}
							</li>
						</ul>
					</div>
					<hr class="uk-margin-small-bottom">
					<div>
						<button class="uk-button uk-border-rounded" :disabled="loading" :class="branch.active ? 'uk-button-danger' : 'uk-button-primary'" @click.prevent="toggle">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>
								{{branch.active ? "Close" : "Activate" }} Branch
							</template>
						</button>

					</div>

				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
export default{
	data(){
		return {
			showModal : false,
			loading : false,
			affected : [
				`Staff belonging to ${this.branch.name} can no longer log in to their branch applications`,
				`All stock(products) belonging being held by this branch will be transfered to the warehouse inventory`
				]
		}
	},
	props :{
		branch : {
			required : true,
			type : Object
		}
	},

	methods : {
		async toggle(){
			this.loading = true
			this.$axios.$post(`/branches/${this.branch.uuid}/toggle-active-status`)
			.then(()=>{
				this.$emit('done')
				this.$message.success( this.theMessagge, 4)
				this.showModal = false
			})
			.catch((err)=>{
				this.$message.error(`Failed to ${this.branch.active ? 'deatcivate' : 'activate'} ${this.branch.name}'`, 4)
			})
			.finally(()=>{
				this.loading = false

			})


		}
	},

	computed : {
		theMessagge(){
			return `${this.branch.name} ${this.branch.active ? 'has been deactivated' : 'has been restored'}`
		}
	}
}
</script>
