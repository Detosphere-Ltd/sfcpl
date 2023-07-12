<template>
	<div>
		<div class="click" @click="loadModal = true">
			<slot name="action-button">
				<a class="uk-text-truncate uk-margin-remove-vertical chip background bordered uk-border-rounded" >
					<span class="text-small">Availability</span>
				</a>
			</slot>
		</div>

		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Product Availability
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
							Close
						</a>
					</div>

					<template v-if="availablability && availablability.length > 0">
						<table class="uk-table uk-table-divider uk-table-small uk-padding-remove modal-content uk-overflow-auto uk-margin-remove">
							<thead>
								<tr>
									<th>Branch</th>
									<th>Quantiy</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, i) in availablability" :key="i">
									<td>{{item.name | branchize }}</td>
									<td>{{item.quantity | pluralize('Unit')}}</td>
								</tr>
								
							</tbody>
						</table>
					</template>
					<div v-else class="uk-padding-small uk-flex">
						<div class="square-40 uk-margin-small-right uk-flex uk-flex-column uk-flex-center uk-flex-middle bordered uk-border-rounded">
							<span class="mdi mdi-tag-multiple lni-large"></span>
						</div>
						<div class="uk-width-expand">
							<h4>Uh oh.</h4>
							<p>None of your branches currently have stock for this product.</p>
						</div>
					</div>


				</div>
			</div>
		</vue-final-modal>


		<vue-final-modal v-model="loadModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="true" :click-to-close="false" overlay-class="uk-overlay-primary" @before-open="getAvailability">
			<div class="uk-width-1-1 uk-margin-large-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-medium@s uk-padding uk-flex uk-flex-column uk-flex-middle">

					<template v-if="loading">
						<loaders-spinner class="uk-margin-bottom"></loaders-spinner>
						<p class="uk-text-center">Checking all branches of your store for stocks of {{ product.product.name }}</p>
					</template>

					<template v-else>
						<error-parser v-if="failed && errData !== undefined" :errorData="errData">
							<button class="uk-button uk-button-primary" slot="further-action" @click="getAvailability">
								Retry
							</button>
						</error-parser>
					</template>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/stock/singleton"
export default{
	mixins : [bindProps],
	data(){
		return {
			showModal : false,
			loadModal : false,
			loading : false,
			failed : false,
			errData : undefined,
			availablability : {}
		}
	},

	methods : {
		async getAvailability(){
			this.loading = true
			this.failed = false
			this.errData = undefined
			this.showModal = false
			this.loadModal = true
			await this.$axios.$get(`/product-variations/${this.product.uuid}/check-availability`)
			.then(res => {
				this.availablability = res.data
				this.loadModal = false
				this.showModal = true
			})
			.catch(err=>{
				this.failed = true 
				this.errData = err
			})
			.finally(()=>{
				this.loading = false
			})
		}
	}
};
</script>
