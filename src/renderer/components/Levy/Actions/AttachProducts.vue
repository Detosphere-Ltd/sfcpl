<template>
	<div>
		<div @click="$uikit.modal($refs.modal).show()" class="click">
			<slot name="action-button">
				<button  class="uk-button uk-flex-middle uk-flex uk-button-small">
					{{ levy.active ? 'Deactivate' : 'Activate' }} Levy
				</button>
			</slot>
		</div>

		<div class="uk-width-1-1 uk-padding-remove"  uk-modal="esc-close: false; bg-close: false; sel-close: .levy-attach-products-modal; delay-hide: 0; delay-show: 0; stack: true" ref="modal" @beforeshow="$emit('opening'); (theList && theList.length < 1) ?fetchData() : ''"  @beforehide="$emit('closing')">
			<div :class="colorMode" class="uk-modal-dialog transparent uk-padding-remove uk-width-1-1 uk-width-3-4@l uk-width-1-2@xl uk-margin-auto uk-animation-slide-top-small uk-animation-fast uk-width-1-1 uk-margin-auto-vertical">
				<div class="uk-width-1-1 background  uk-inline uk-flex uk-flex-column rounded bordered">

					<div class="rounded background uk-position-cover uk-position-z-index center bordered uk-padding-small" v-if="processing">
						<loaders-spinner></loaders-spinner>
						<span class="uk-margin-small-top">
							Attaching Products...
						</span>
					</div>


					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<div class="uk-width-expand uk-flex uk-flex-column">
							<h5 class="uk-margin-remove uk-text-bold">
								Attach Products
							</h5>
							<span class="text-small">
								{{levy.name}}
							</span>
						</div>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded levy-attach-products-modal">
							Close
						</a>
					</div>
					<div class="uk-flex  border-bottom">
						<div class="uk-flex uk-width-auto border-right">

							<!-- <div class="square-30 bordered rounded uk-margin-small-right uk-margin-auto-vertical"></div> -->
							<div class="uk-light uk-width-x-small center uk-margin-small-right border-right">
								<input type="checkbox" class="uk-checkbox square-30 bordered rounded" v-model="selectAll" :disabled="processing || loading" :class="processing ? 'loading' : ''">
							</div>

							<div class="uk-width-large@m uk-inline tiny-padding">
								<input type="text" class="uk-input" placeholder="Product search" v-model="searchTerm" @keydown.enter="searchData">
								<div class="uk-flex uk-flex-middle uk-width-auto uk-position-z-index uk-position-center-right" v-if="searchTerm || searching">
									<a class="square-20 uk-background-danger-op uk-border-circle  uk-flex uk-flex-column uk-flex-center uk-flex-middle click uk-margin-right" v-if="searchTerm && !searching" @click="searchTerm = ''; searched ? fetchData() : ''">
										<span class="mdi mdi-close uk-text-white"></span>
									</a>
								</div>
							</div>

							<div class="tiny-padding">
								<button class="uk-button uk-button-primary" :disabled="!searchTerm || searching || searchTerm.length < 2"  @click.prevent="searchData" :class="{loading : searching}">
									Search
								</button>
							</div>
						</div>

						<div class="uk-width-expand uk-flex uk-flex-middle tiny-padding uk-flex-right">
							<button class="uk-button uk-button-primary" :disabled="processing || selectedProducts.length < 1" @click="attach" :class="processing ? 'loading' : ''">
								Attach {{selectedProducts.length | pluralize('Selected Product')}}
							</button>
						</div>
					</div>
					<div class="modal-content uk-width-1-1 uk-inline" style="min-height: 50vh">						
						<div v-if="loading" class="uk-width-1-1 uk-padding-small center">
							<loaders-spinner></loaders-spinner>
							<span class="uk-margin-top">
								Loading Levies
							</span>
						</div>

						<div v-else>
							<div v-if="failed"  class="uk-width-1-1 uk-flex uk-flex-column uk-padding">
								<acl-parse-error :errorData="errData">
									<button class="uk-button uk-button-primary" slot="further-action" @click="fetchData()">
										Retry
									</button>
								</acl-parse-error>
							</div>
							<div v-else>
								<div class="stripped-bottom uk-flex uk-flex-column uk-child-width-1-1" v-if="theList && theList.length > 0">
									<div v-for="product in list" :key="product.uuid" class="uk-flex">

										<div class="uk-light uk-width-x-small center uk-margin-small-right border-right tiny-padding">
											<input type="checkbox" class="uk-checkbox square-30 bordered rounded" v-model="selectedProducts" :value="product.uuid" :disabled="processing || loading">
										</div>

										<div class="uk-width-expand border-right uk-flex uk-flex-column tiny-padding">
											<p class="uk-margin-remove uk-text-truncate uk-h5">
												{{product.name}}
											</p>
											<span class="uk-text-truncate text-small">
												{{ product.code }}
											</span>
										</div>

										<div class="uk-width-x-small border-right tiny-padding center">
											<div class="label" :class="product.active ? 'confirmed' : 'cancelled'">
												<small>
													{{ product.active ? 'Active' : 'Inactive' }}
												</small>
											</div>
										</div>

									<!-- 	<div class="uk-width-x-small border-right tiny-padding center">
											<span class="uk-text-truncate text-small" :title="product.code">
												{{ product.code }}
											</span>
										</div> -->

										<div class="uk-width-small tiny-padding center">
											{{ product.total_variations | pluralize("Variation") }}
										</div>
									</div>

									<!-- <div class="uk-position-bottom-right uk-padding-small uk-position-sticky uk-flex uk-flex-right" >
										<button class="uk-button uk-button-primary uk-button-large" disabled>
											Attach Selected Products
										</button>
									</div> -->
								</div>

								<div class="uk-padding-large uk-flex uk-flex-column uk-flex-middle" v-else>
									<h4>
										No products found
									</h4>
									<p>
										We could not find any products.
									</p>

									<div class="uk-flex">
										<button class="uk-button uk-button-primary tiny-margin-right" @click="fetchData(); searchTerm = ''">
											{{searched ? 'Clear Search & Reload Data' : 'Reload Data'}}
										</button>
									</div>
								</div>


							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { bindProps , attach } from "@/mixins/levy"
import loader from "@/mixins/loader"
export default {

	mixins : [bindProps ,  attach , loader],

	watch : {
		selectAll(newVal , oldVal){
			this.list.forEach(entry => {
				if (newVal) {
					if (!this.selectedProducts.includes(entry.uuid)) {
						this.selectedProducts.push(entry.uuid)
					}

					return
				}

				this.selectedProducts = []
			})
		}
	},

	mounted(){
		this.$on('done', ()=>{
			this.$uikit.modal(this.$refs.modal).hide()
		})
	}

}
</script>
