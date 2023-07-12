<template>
	<div class="tiny-padding">
		<div class="uk-width-1-1">
			<h4>Manage Your Store's Suppliers</h4>
		</div>

		<div class="uk-width-1-1 uk-flex">
			<div class="uk-width-large@m">
				<input type="text" class="uk-input" placeholder="Search Suppliers" v-model="searchTerm">
			</div>

			<div class="uk-width-expand uk-flex uk-flex-right">
				<import-excel :resource="{name: 'Suppliers', path : 'suppliers'}" class="uk-margin-small-right" @import-completed="$nuxt.refresh()" v-if="can('import-suppliers')"></import-excel>
				<supplier-actions-add-new @supplier-created="$nuxt.refresh()" v-if="can('create-suppliers')"></supplier-actions-add-new>
			</div>
		</div>
		<div class="uk-width-1-1 background uk-border-rounded uk-flex uk-flex-middle bordered tiny-margin-top grid-padding">


			<nuxt-link :to="{name: 'suppliers'}" class="click grid-padding highlight-text uk-flex uk-flex-middle uk-border-rounded uk-margin-small-right" exact exact-active-class="uk-background-success uk-text-white">
				<span class="tiny-margin-left tiny-margin-right">
					Suppliers List
				</span>
			</nuxt-link>

			<nuxt-link :to="{name: 'suppliers-stats'}" class="click grid-padding highlight-text uk-flex uk-flex-middle uk-border-rounded" exact exact-active-class="uk-background-success uk-text-white">
				<span class="tiny-margin-left tiny-margin-right">
					Suppliers Statistics
				</span>
			</nuxt-link>

		</div>

		<div class="background uk-border-rounded bordered tiny-margin-top">
			<div class="border-bottom tiny-padding">
				<headers-suppliers>
					<div class="uk-width-auto uk-margin-medium-right">
						<select v-model="filter" class="uk-select uk-form-small">
							<option value="">All Suppliers</option>
							<option value="true">Active Suppliers</option>
							<option value="false">Deactivated Suppliers</option>
						</select>
					</div>
				</headers-suppliers>
			</div>

			<div v-if="$fetchState.pending" class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center">
				<loaders-spinner></loaders-spinner>
			</div>
			<div v-else>


				<div v-if="failed && errData">
					<error-parser :errorData="errData" class="uk-padding">
						<button class="uk-button uk-button-primary" slot="further-action" @click="$fetch()">
							Retry
						</button>
					</error-parser>
				</div>

				<div v-else>
					<div v-if="allSupliers && allSupliers.length > 0">


						<div class="uk-width-1-1 uk-flex uk-flex-column uk-child-width-1-1"  v-if="filteredSuppliers.length > 0">

							<div v-for="(supplier, i) in filteredSuppliers" :key="supplier.uuid" :class="i < (filteredSuppliers.length - 1) ? 'border-bottom' : ''">
								<supplier-card :supplier="supplier" @needs-to-refresh="$nuxt.refresh()"></supplier-card>
							</div>
						</div>

						<div class="uk-padding uk-padding-remove-horizontal uk-padding-remove-top uk-width-1-1" v-else>

							<div v-if="searchTerm" class="uk-width-1-1">

								<div class="uk-width-1-1 uk-width-2xlarge@m uk-margin-top uk-flex uk-flex-column uk-flex-middle uk-flex-center rounded uk-padding background uk-margin-auto">
									<code class="uk-text-bold uk-margin-small-bottom">
										"{{searchTerm}}"
									</code>
									<h5 class="uk-text-center uk-margin-remove uk-text-bold">
										There were no suppliers that matched your search
									</h5>
									<p class="uk-text-center uk-margin-remove-top">
										Try a different search term or clear your search to continue
									</p>
									<button class="uk-button uk-background-danger-op uk-button-small" @click="searchTerm = ''">
										Clear Search
									</button>
								</div>
							</div>

							<div v-else-if="filter" class="uk-width-1-1">

								<div class="uk-width-1-1 uk-width-2xlarge@m uk-margin-top uk-flex uk-flex-column uk-flex-middle uk-flex-center rounded uk-padding background uk-margin-auto">
									<h5 class="uk-text-center uk-margin-remove uk-text-bold">
										There were no suppliers that matched your filter
									</h5>
									<p class="uk-text-center uk-margin-remove-top">
										Try a different search term or clear your search to continue
									</p>
									<button class="uk-button uk-background-danger-op uk-button-small" @click="filter = ''">
										Clear Filter
									</button>
								</div>
							</div>
						</div>
					</div>


					<div class="uk-width-1-1 uk-padding uk-padding-remove-top uk-margin-small-top" v-else>

						<div class="uk-width-5-6 background rounded uk-padding uk-margin-auto">
							<div class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
								<div class="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
									<span class="mdi mdi-cart-arrow-down lni-extra-large uk-margin-bottom"></span>
									<h4 class="uk-text-center uk-margin-small-bottom uk-text-bold">
										No supplier found
									</h4>
									<p class="uk-text-center uk-margin-remove-top">
										Suppliers from whom you make purchases will show up here.
									</p>

								</div>
								<supplier-actions-add-new v-if="can('create-suppliers')" @supplier-created="$nuxt.refresh()"></supplier-actions-add-new>
							</div>
						</div>
					</div>


				</div>
			</div>
		</div>


		
	</div>
</template>
<script>
import {mapGetters} from "vuex"
export default{
	fetchOnServer : false,
	async fetch(){
		this.failed = false
		await this.$store.dispatch('suppliers/getSuppliers')
		.catch((err)=>{
			this.failed = true
			this.errData = err
		})
	},
	data(){
		return {
			failed : false,
			errData : undefined,
			searchTerm : '',
			filter : ''
		}
	},

	computed : {
		...mapGetters({
			allSupliers : 'suppliers/suppliers'
		}),

		suppliers(){
			if (!this.filter) { return this.allSupliers}
				return this.allSupliers.filter((item)=>{return this.filter === item.active.toString() })
		},

		filteredSuppliers(){
			return this.suppliers.filter( brand => {
				return brand.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			})
		}
	}
};
</script>
