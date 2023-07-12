<template>
	<div class="tiny-padding">
		<div class="uk-padding-small background uk-border-rounded bordered">

			<h5>Suppliers for <span class="uk-text-bold">{{product.name}}</span></h5>

			<div class="uk-width-1-1 border-bottom tiny-padding uk-padding-remove-horizontal uk-padding-remove-top">
				<div class="uk-width-1-1 uk-flex uk-flex-middle">
					<div class="grid-gutter uk-width-expand">
						<div class="uk-width-1-1">
							<p class="uk-text-truncate uk-margin-remove">
								Name
							</p>
						</div>
					</div>
					<div class="grid-gutter uk-width-small">
						<div class="uk-width-1-1">
							<p class="uk-text-truncate uk-margin-remove">
								Email / Phone
							</p>
						</div>
					</div>

					<div class="grid-gutter uk-width-small">
						<div class="uk-width-1-1">
							<p class="uk-text-truncate uk-margin-remove">
								Cost of Purchases
							</p>
						</div>
					</div>
					<div class="grid-gutter uk-width-small">
						<div class="uk-width-1-1">
							<p class="uk-text-truncate uk-margin-remove">
								Total Debt
							</p>
						</div>
					</div>
					<div class="grid-gutter uk-width-small">
						<div class="uk-width-1-1">
							<p class="uk-text-truncate uk-margin-remove uk-text-right">
								Discount Received <small>({{emporium.currency}})</small>
							</p>
						</div>
					</div>

					

				</div>
			</div>
			<div v-if="loading" class="uk-width-1-1 uk-padding uk-flex uk-flex-center">
				<loaders-spinner></loaders-spinner>
			</div>

			<div v-else>
				<div v-if="failed"  class="uk-width-1-1 uk-flex uk-flex-column uk-padding">
					<acl-parse-error :errorData="errData">
						<button class="uk-button uk-button-primary" slot="further-action" @click="getProductSuppliers">
							Retry
						</button>
					</acl-parse-error>
				</div>
				<div v-else>
					<div v-if="suppliers && suppliers.length > 0">
						<product-supplier-card v-for="(supplier, key) in suppliers" :key="supplier.uuid" :supplier="supplier" :class="key < (suppliers.length - 1)? 'border-bottom' : ''" 
						@done="() => { getProductSuppliers(); $emit('needs-to-refresh')}">
					</product-supplier-card>
				</div>

				<div class="uk-padding-large uk-flex uk-flex-column uk-flex-middle" v-else>
					<h4 class="uk-text-center">
						No suppliers found
					</h4>
					<p class="uk-text-center uk-width-xlarge">
						We could not find any supplier records for this product. Suppliers you purchase {{product.name}} from will show up here.
					</p>
				</div>


			</div>
		</div>
	</div>
</div>
</template>
<script>
import {bindProps} from "@/mixins/product/singleton"
import suppliers from "@/mixins/product/suppliers"
export default{
	mixins : [bindProps, suppliers],
	async created(){
		await this.getProductSuppliers()
	}
};
</script>
