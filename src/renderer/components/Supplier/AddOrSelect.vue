<template>
	<div>
		<input type="text"  class="uk-input uk-form-large uk-text-small click uk-text-capitalize uk-text-bold" placeholder="Add / Select Supplier" readonly @click="showSupplierModal = true" :value="selectedSupplier && selectedSupplier.name ? selectedSupplier.name : ''">

		<vue-final-modal v-model="showSupplierModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-large-top" :esc-to-close="true" overlay-class="uk-overlay-primary">
			<div class="uk-card rounded uk-background-white raised-deep uk-margin-auto uk-margin-auto-vertical uk-margin-remove-top uk-width-1-1 uk-inline uk-margin-auto uk-overflow-auto uk-width-large@m uk-padding-remove">
				<div class="uk-width-1-1 grid-padding uk-background-close uk-flex uk-flex-middle">
					<div class="square-15 uk-background-danger-op uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle click" @click.prevent="showSupplierModal = false">
						<span class="mdi mdi-close uk-text-meta uk-text-dark"></span>
					</div>
				</div>
				<div class="uk-padding-small uk-width-1-1">
					<h6 class="uk-margin-remove-top uk-text-bold uk-margin-remove-bottom">
						{{ doing === 'showlist' ? 'Select' : 'Record New' }} Medicine Supplier
					</h6>
					<div class="uk-grid-collapse uk-child-width-1-1 uk-width-1-1 uk-flex uk-flex-column" uk-grid v-if="doing === 'showlist'">
						<div class="grid-padding uk-padding-remove-horizontal">
							<input type="text" class="uk-input uk-width-1-1 uk-text-small" placeholder="Search for Suppliers" v-model="searchTerm">
						</div>
						<div v-if="suppliers.length > 0" class="member-select uk-overflow-auto">
							<div v-if="filteredSuppliers.length > 0">
								<div v-for="supplier in filteredSuppliers" :key="supplier.uuid" class="grid-padding bordered uk-margin-small-bottom uk-border-rounded staff-member click" v-if="supplier.active" @click.prevent="selectSupplier(supplier)">
									<div  class="uk-width-1-1 uk-flex uk-flex-middle">
										<div class="uk-width-expand uk-flex uk-flex-column">
											<h6 class="uk-text-bold uk-text-dark uk-margin-remove uk-text-capitalize">
												{{supplier.name}}
											</h6>
											<small v-if="supplier.city || supplier.country">
												{{supplier.city ? `${supplier.city}, ` : ''}} {{supplier.country ? supplier.country : ''}}
											</small>
										</div>
										<span class="chip uk-background-success-op uk-border-rounded uk-margin-auto-vertical">
											<span class="uk-text-small">
												Select
											</span>
										</span>
									</div>
								</div>
							</div>

							<div v-else class="uk-padding-small bordered uk-border-rounded uk-margin-small-bottom uk-background-view">
								<h5 class="uk-text-bold uk-margin-remove">
									No Supplier Found. 
								</h5>
								<p class="uk-margin-small uk-text-small">
									Your search query did not match any suppliers
								</p>
								<button class="uk-button uk-background-danger-op uk-button-small uk-border-rounded" @click="searchTerm = ''">
									<span class="uk-text-small">
										Clear Search
									</span>
								</button>
							</div>
						</div>

						<div v-else class="uk-width-1-1 bordered uk-padding-small uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-border-rounded uk-margin-small-bottom">
							<span class="lni lni-bookmark lni-large"></span>
							<p class="uk-text-center uk-margin-remove">
								No Suppliers found
							</p>
						</div>
						<hr class="uk-margin-small-bottom">
						<div class="tiny-padding bordered uk-border-rounded uk-flex uk-flex-middle click uk-background-muted-dark" @click="doing = 'creating'" v-if="can('create-suppliers')">
							<div class="square-30 uk-background-success-op uk-border-circle uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-margin-small-right">
								<span class="mdi mdi-plus"></span>
							</div>
							<span class="uk-text-small uk-text-bold uk-text-dark">
								Add a New Supplier
							</span>
						</div>
					</div>

					<div class="uk-width-1-1" v-else>
						<medicine-supplier-create @cancel="doing = 'showlist'" :key="doing" @supplier-created="handleCreated">
							<button @click="doing =  'showlist' " class="uk-button uk-button-primary uk-border-rounded">
								<span class="uk-text-small">
									Back
								</span>
							</button>
						</medicine-supplier-create>
					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {mapGetters} from "vuex"
export default{
	data(){
		return {
			showSupplierModal : false,
			searchTerm : '',
			doing: 'showlist',
			selectedSupplier : {}
		}
	},

	computed: {
		...mapGetters({
			suppliers : "partners/suppliers"
		}),

		filteredSuppliers(){
			return this.suppliers.filter( supplier => {
				return supplier.name.toLowerCase().includes(this.searchTerm.toLowerCase()) 
			})
		}
	},

	methods : {
		selectSupplier(payload){
			this.$emit('supplier-selected', payload.uuid)
			this.selectedSupplier = payload
			this.showSupplierModal = false
		},

		async handleCreated(){
			await this.$store.dispatch('partners/getSuppliers').then(()=>{
				this.doing = 'showlist'
			}).catch(()=>{

			})
			
		}
	}
};
</script>