<template>
	<div>
		<div class="uk-width-1-1 background uk-padding-remove-bottom border-bottom" :key="watcher">
			<div>
				<div class="uk-flex uk-flex-top uk-padding-small uk-padding-remove-bottom">
					<div class="uk-width-expand uk-flex-column">
						<div class="uk-flex uk-flex-middle uk-margin-small-bottom">
							<div class="uk-flex uk-flex-column">
								<div class="uk-flex  tiny-margin-bottom uk-flex-middle">
									<span class="uk-margin-right">
										{{product.code}}
									</span>
									<div class="label" :class="product.active ? 'uk-background-success' : 'uk-background-danger'">
										<span class="text-small uk-text-white">
											{{product.active ? 'Active' : 'Inactive'}} Product
										</span>
									</div>
								</div>
								<h3 class="uk-margin-right uk-margin-remove-vertical">{{product.name}}</h3>
							</div>
							
						</div>
						<div>
							<p v-if="product.description" class="uk-margin-remove uk-width-5-6" v-text="product.description"></p>
							<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-margin-small-top" v-if="product.tags && product.tags.length > 0">
								<div class="tag bordered background tiny-margin-right tiny-margin-bottom uk-border-rounded" v-for="tag in product.tags" :key="tag.slug">
									<span class="mdi mdi-tag-outline tiny-margin-right tiny-margin-left"></span><span class="text-small tiny-margin-right uk-text-capitalize">{{tag.name}}</span>
								</div>
							</div>
						</div>
					</div>

					<div class="uk-width-auto">
						<div class="uk-flex uk-flex-right">
							<product-actions-edit class="uk-margin-small-right" :product="product" @done="$nuxt.refresh(); watcher = !watcher"  v-if="can('update-products')"></product-actions-edit>

							<product-actions-record-purchase :product="product" @done="$nuxt.refresh(); watcher = !watcher" v-if="can('record-purchases')">
								<button slot="action-button" class="uk-button uk-button-small uk-text-white tiny-margin-right uk-button-primary">
									New Purchase
								</button>
							</product-actions-record-purchase>

							<product-actions-toggle-status :product="product" @status-changed="$nuxt.refresh(); watcher = !watcher"  v-if="can('change-product-active-status')">
								<button slot="action-button" class="uk-button uk-button-small uk-text-white" :class="product.active ? 'uk-button-danger' : 'uk-button-primary'">
									{{product.active ? "Deactivate" : "Activate"}}
								</button>
							</product-actions-toggle-status>
							
							
						</div>
					</div>
				</div>



				<div class="uk-width-1-1 border-top">

					<nav class="uk-flex uk-border-rounded">

						<nuxt-link :to="{name: 'inventory-product', params:{product : product.uuid}}" class="tab uk-width-auto" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove">
							<span>
								Overview
							</span>
						</nuxt-link>
						<nuxt-link :to="{name: 'inventory-product-sales', params:{product : product.uuid }}" class="tab uk-width-auto" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove" v-if="can('view-sales')">
							<span>
								Sales Records
							</span>
						</nuxt-link>
						<nuxt-link :to="{name: 'inventory-product-purchases', params:{product : product.uuid}}" class="tab uk-width-auto" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove" v-if="can('view-purchases')">
							<span>
								Purchase History
							</span>
						</nuxt-link>



						<nuxt-link :to="{name: 'inventory-product-pricing-history', params:{product : product.uuid }}" class="tab uk-width-auto" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove" v-if="can('view-price-changes')">
							<span>
								Price History
							</span>
						</nuxt-link>
						<nuxt-link :to="{name: 'inventory-product-suppliers', params:{product : product.uuid }}" class="tab uk-width-auto" exact-active-class="tabActive  uk-text-bold uk-h6 uk-margin-remove" v-if="can('view-suppliers')">
							<span>
								Suppliers
							</span>
						</nuxt-link>


					</nav>


				</div>
			</div>
		</div>
		<div  class="uk-width-1-1">
			<nuxt-child :product="product"/>
		</div>
	</div>
</template>
<script>
export default{

	data(){
		return {
			watcher : false
		}
	},

	async asyncData({$axios, params, error}){
		let product = {}
		await $axios.$get(`/products/${params.product}?include=tags,variations,variations.variation,variations.created_by,variations.last_purchase,variations.last_purchase.created_by,created_by,media`)
		.then(res => {
			product = res.data
		})
		.catch((err)=>{
			error({statusCode : 404, message : "product Info No Found"})
		})
		return {product}
	}

};
</script>

