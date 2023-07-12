<template>
	<div>
		<h2 class="uk-text-bold">
			Welcome to {{$appName}}
		</h2>
		<p>
			This Setup Guide will take you through the steps needed to get {{emporium.name}} up and running on {{$appName}}. We advice thta you follow this process but you can skip this process entirely if you know what you are doing.
		</p>

		<onboarding-skip @done="$auth.fetchUser()"></onboarding-skip>
		<div class="border-top uk-padding-small uk-padding-remove-horizontal uk-padding-remove-bottom uk-margin-top">
			
			<div class="bordered uk-border-rounded">
				<section>
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding click" :class="stage === 'basics' ? 'border-bottom' : ''" @click="stage === 'basics' ? stage = '' : stage = 'basics'">
						<h5 class="uk-text-bold uk-margin-remove uk-width-expand">
							Let's Start With The Basics
						</h5>
						<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-button-view click">
							<span class="mdi lni-large" :class="stage === 'basics' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
						</div>
					</div>

					<template v-if="stage === 'basics'">
						<div class="uk-flex uk-flex-top tiny-padding">
							<div v-if="emporium.setups.has_confirmed_store_details" class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-background-primary uk-margin-small-right">
								<span class="mdi mdi-check lni-large uk-text-white"></span>
							</div>
							<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered uk-margin-small-right" v-else>
								1
							</div>
							<div class="uk-width-expand uk-flex uk-flex-column">
								<h5 class="tiny-margin-bottom">
									Confirm Your Store Info
								</h5>
								<p class="uk-margin-remove">
									Confirm your store name, contact information and logo.
								</p>

								<div class="uk-flex uk-flex-middle uk-margin-small-top" v-if="!emporium.setups.has_confirmed_store_details">
									<onboarding-skip-step class="uk-margin-right" @skipped="$auth.fetchUser(); stage = 'catalog'" stage-key="has_confirmed_store_details"></onboarding-skip-step>
									<onboarding-identity @store-updated="stage = 'catalog'"></onboarding-identity>
								</div>
							</div>
						</div>
					</template>
				</section>


				<section class="border-top">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding click" :class="stage === 'catalog' ? 'border-bottom' : ''" @click="stage === 'catalog' ? stage = '' : stage = 'catalog'">
						<h5 class="uk-text-bold uk-margin-remove uk-width-expand">
							Setup Your Catalog
						</h5>
						<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-button-view click">
							<span class="mdi lni-large" :class="stage === 'catalog' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
						</div>
					</div>

					<template v-if="stage === 'catalog'">
						<div class="uk-flex uk-flex-top tiny-padding">

							<div v-if="emporium.setups.has_setup_variations" class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-background-primary uk-margin-small-right">
								<span class="mdi mdi-check lni-large uk-text-white"></span>
							</div>
							<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered uk-margin-small-right" v-else>
								1
							</div>

							<div class="uk-width-expand uk-flex uk-flex-column">
								<h5 class="tiny-margin-bottom">
									Add Your Product Variations
								</h5>
								<p class="uk-margin-remove">
									Add the variation names of products you have in your store. Note that you cannot have two variations with the same name. You can instead associate a variation with multiple products if for instance your store has a "Medium" variation for more than one product.
								</p>

								<div class="uk-flex uk-flex-middle uk-margin-small-top" v-if="!emporium.setups.has_setup_variations">
									<div class="chip bordered uk-border-rounded uk-margin-right click" @click="modals.variations = true">
										<span class="text-small">
											Explain this to me
										</span>
									</div>

									<onboarding-skip-step class="uk-margin-right" stage-key="has_setup_variations"></onboarding-skip-step>	

									<import-excel :resource="{name: 'Variations', path : 'variations'}" class="uk-margin-small-right" @import-completed="updateStage('has_setup_variations')" v-if="can('import-variations')">
										<button class="uk-button uk-button-primary uk-border-rounded uk-button-small" slot="action-button">
											Import Product Variations
										</button>
									</import-excel>
								</div>

							</div>
						</div>

						<div class="uk-flex uk-flex-top tiny-padding border-top">
							<div v-if="emporium.setups.has_setup_tags" class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-background-primary uk-margin-small-right">
								<span class="mdi mdi-check lni-large uk-text-white"></span>
							</div>
							<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered uk-margin-small-right" v-else>
								2
							</div>
							<div class="uk-width-expand uk-flex uk-flex-column">
								<h5 class="tiny-margin-bottom">
									Add Your Product Tags / Categories
								</h5>
								<p class="uk-margin-remove">
									Add your product tags / categories. Tags allow you to categorize products in a way that makes sense to you. Tags are NOT product variations and can be completely ignored. 
								</p>


								<div class="uk-flex uk-flex-middle uk-margin-small-top" v-if="!emporium.setups.has_setup_tags">
									<div class="chip bordered uk-border-rounded uk-margin-right click" @click="modals.tags = true">
										<span class="text-small">
											Explain this to me
										</span>
									</div>

									<onboarding-skip-step class="uk-margin-right" stage-key="has_setup_tags"></onboarding-skip-step>

									<import-excel :resource="{name: 'Product Tags / Categories', path : 'tags'}" class="uk-margin-small-right" @import-completed="updateStage('has_setup_variations')" v-if="can('import-variations')">
										<button class="uk-button uk-button-primary uk-border-rounded uk-button-small" slot="action-button">
											Import Tags / Categories
										</button>
									</import-excel>	

								</div>
							</div>
						</div>

						<div class="uk-flex uk-flex-top tiny-padding border-top">
							<div v-if="emporium.setups.has_created_products" class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-background-primary uk-margin-small-right">
								<span class="mdi mdi-check lni-large uk-text-white"></span>
							</div>
							<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered uk-margin-small-right" v-else>
								3
							</div>
							<div class="uk-width-expand uk-flex uk-flex-column">
								<h5 class="tiny-margin-bottom">
									Now Add Your Products
								</h5>
								<p class="uk-margin-remove">
									Upload an excel of the list of products you deal in. This is simply an exercise to register your products into your store database. This is NOT the stock you currently have in your store.
								</p>

								<div class="uk-flex uk-flex-middle uk-margin-small-top" v-if="!emporium.setups.has_created_products">
									<div class="chip bordered uk-border-rounded uk-margin-right click" @click="modals.catalog = true">
										<span class="text-small">
											Explain this to me
										</span>
									</div>	

									<onboarding-skip-step class="uk-margin-right" stage-key="has_created_products"></onboarding-skip-step>	

									<import-excel :resource="{name: 'Products', path : 'products'}" @import-completed="updateStage('has_created_products')" v-if="can('import-products')">
										<button class="uk-button uk-button-primary uk-border-rounded uk-button-small" slot="action-button">
											Import Products Catalog
										</button>
									</import-excel>

								</div>

								
							</div>
						</div>
					</template>
				</section>

				<section class="border-top">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding click" :class="stage === 'people' ? 'border-bottom' : ''" @click="stage === 'people' ? stage = '' : stage = 'people'">
						<h5 class="uk-text-bold uk-margin-remove uk-width-expand">
							Onboard Your People
						</h5>
						<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-button-view click">
							<span class="mdi lni-large" :class="stage === 'people' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
						</div>
					</div>

					<template v-if="stage === 'people'">
						<div class="uk-flex uk-flex-top tiny-padding">
							<div v-if="emporium.setups.has_created_staff" class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-background-primary uk-margin-small-right">
								<span class="mdi mdi-check lni-large uk-text-white"></span>
							</div>
							<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered uk-margin-small-right" v-else>
								1
							</div>
							<div class="uk-width-expand">
								<h5 class="tiny-margin-bottom">
									Onboard Your Staff
								</h5>
								<p class="uk-margin-remove">
									Add Members of Your Staff. After importing your store staff, you can be abble to assign them roles with permissions that regulates their activities on {{$appName}}.
								</p>

								<div class="uk-flex uk-flex-middle uk-margin-small-top" v-if="!emporium.setups.has_created_staff">
									
									<onboarding-skip-step class="uk-margin-right" stage-key="has_created_staff"></onboarding-skip-step>	

									<import-excel :resource="{name: 'Users', path : 'users'}" @import-completed="updateStage('has_created_staff')" v-if="can('import-users')">
										<button class="uk-button uk-button-primary uk-border-rounded uk-button-small" slot="action-button">
											Import Your Staff
										</button>
									</import-excel>

								</div>
							</div>
						</div>

						<div class="uk-flex uk-flex-top tiny-padding border-top">
							<div v-if="emporium.setups.has_created_supplier" class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-background-primary uk-margin-small-right">
								<span class="mdi mdi-check lni-large uk-text-white"></span>
							</div>
							<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered uk-margin-small-right" v-else>
								2
							</div>
							<div class="uk-width-expand uk-flex uk-flex-column">
								<h5 class="tiny-margin-bottom">
									Bring Your Suppliers
								</h5>
								<p class="uk-margin-remove">
									Import your list of suppliers to enable us help you keep track of your purchases and purchase payments.
								</p>

								<div class="uk-flex uk-flex-middle uk-margin-small-top" v-if="!emporium.setups.has_created_supplier">
									
									<onboarding-skip-step class="uk-margin-right" stage-key="has_created_supplier"></onboarding-skip-step>	

									<import-excel :resource="{name: 'Suppliers', path : 'suppliers'}" @import-completed="updateStage('has_created_supplier')" v-if="can('import-suppliers')">
										<button class="uk-button uk-button-primary uk-border-rounded uk-button-small" slot="action-button">
											Import Your Suppliers
										</button>
									</import-excel>

								</div>
							</div>
						</div>

						<div class="uk-flex uk-flex-top tiny-padding border-top">
							<div v-if="emporium.setups.has_created_customer" class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-background-primary uk-margin-small-right">
								<span class="mdi mdi-check lni-large uk-text-white"></span>
							</div>
							<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered uk-margin-small-right" v-else>
								3
							</div>

							<div class="uk-width-expand uk-flex uk-flex-column">
								<h5 class="tiny-margin-bottom">
									And Your Customers Too
								</h5>
								<p class="uk-margin-remove">
									Import your customers to enable us help you keep track of your customer sales and and sale payments.
								</p>

								<div class="uk-flex uk-flex-middle uk-margin-small-top" v-if="!emporium.setups.has_created_customer">
									
									<onboarding-skip-step class="uk-margin-right" stage-key="has_created_customer"></onboarding-skip-step>	

									<import-excel :resource="{name: 'Customers', path : 'customers'}" @import-completed="updateStage('has_created_customer')" v-if="can('import-customers')">
										<button class="uk-button uk-button-primary uk-border-rounded uk-button-small" slot="action-button">
											Import Your Customers
										</button>
									</import-excel>

								</div>
							</div>
						</div>
					</template>
				</section>

				<section class="border-top">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding click" :class="stage === 'final_steps' ? 'border-bottom' : ''" @click="stage === 'final_steps' ? stage = '' : stage = 'final_steps'">
						<h5 class="uk-text-bold uk-margin-remove uk-width-expand">
							Final Steps
						</h5>
						<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-button-view click">
							<span class="mdi lni-large" :class="stage === 'final_steps' ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
						</div>
					</div>

					<template v-if="stage === 'final_steps'">

						<div class="uk-flex uk-flex-top tiny-padding">
							
							<div v-if="emporium.setups.has_stock" class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-background-primary uk-margin-small-right">
								<span class="mdi mdi-check lni-large uk-text-white"></span>
							</div>
							<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered uk-margin-small-right" v-else>
								1
							</div>

							<div class="uk-width-expand uk-flex uk-flex-column">
								<h5 class="tiny-margin-bottom">
									Stock your store
								</h5>
								<p class="uk-margin-remove">
									Now that you have imported your product catalog, variations and suppliers from the steps above, it's time to stock your store with purchases.
								</p>

								<div class="uk-flex uk-flex-middle uk-margin-small-top" v-if="!emporium.setups.has_stock">

									<onboarding-skip-step class="uk-margin-right" stage-key="has_stock"></onboarding-skip-step>	
									
									<purchase-actions-record-invoice v-if="can('record-purchases')" @completed="updateStage('has_stock')">
										<button class="uk-button uk-button-primary uk-border-rounded uk-button-small" slot="action-button">
											Record A Purchase
										</button>
									</purchase-actions-record-invoice>
								</div>
							</div>
						</div>

						<div class="uk-flex uk-flex-top tiny-padding border-top">
							<div v-if="emporium.setups.has_setup_branch" class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-background-primary uk-margin-small-right">
								<span class="mdi mdi-check lni-large uk-text-white"></span>
							</div>
							<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered uk-margin-small-right" v-else>
								2
							</div>


							<div class="uk-width-expand uk-flex uk-flex-column">
								<h5 class="tiny-margin-bottom">
									Set Up Your First Branch
								</h5>

								<p class="uk-margin-remove">
									Now that you have imported your product catalog, variations and suppliers from the steps above, it's time to stock your store with purchases.
								</p>

								<div class="uk-flex uk-flex-middle uk-margin-small-top" v-if="!emporium.setups.has_setup_branch">
									<onboarding-skip-step class="uk-margin-right" stage-key="has_setup_branch"></onboarding-skip-step>	
									<branch-actions-setup v-if="can('create-branches')" @done="updateStage('has_setup_branch')" @created="updateStage('has_setup_branch')">
										<button class="uk-button uk-button-primary uk-border-rounded uk-button-small" slot="action-button">
											Setup A Branch
										</button>
									</branch-actions-setup>
								</div>
							</div>
						</div>

						

						<div class="uk-flex uk-flex-top tiny-padding border-top">
							<div v-if="emporium.setups.has_stocked_branch" class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-background-primary uk-margin-small-right">
								<span class="mdi mdi-check lni-large uk-text-white"></span>
							</div>
							<div class="square-30 uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle background bordered uk-margin-small-right" v-else>
								3
							</div>
							<div class="uk-width-expand">
								<h5 class="tiny-margin-bottom">
									Complete Your First Transfer
								</h5>
								<p class="uk-margin-remove">
									You're almost there! Now that everything else is setup, all that is left is for you to complete a transfer of stock from your warehouse to any of your store's branches. Once you complete a transfer and a branch is stocked, you are finally through with your setup on {{$appName}}.
								</p>

								<div class="uk-flex uk-flex-middle uk-margin-small-top"  v-if="!emporium.setups.has_stocked_branch">
									<div class="chip bordered uk-border-rounded uk-margin-right click" @click="modals.transfer = true">
										<span class="text-small">
											Explain this to me
										</span>
									</div>

									<nuxt-link :to="{name: 'inventory'}" v-if="can(['create-transfers', 'view-products'])" class="uk-button uk-button-primary uk-button-small">
										Start Transferring Products
									</nuxt-link>
								</div>
							</div>
						</div>
					</template>
				</section>
			</div>




		</div>


		<vue-final-modal v-model="modals.variations" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="true" overlay-class="uk-overlay-primary" attach=".app">
			<div class="uk-width-1-1 uk-margin-top uk-flex uk-flex-column uk-flex-middle">
				<div class="uk-width-1-1 uk-width-large@s  background bordered  rounded raised-deep uk-animation-scale-up uk-animation-fast uk-margin-top">
					<div class="uk-padding">
						<h4 class="uk-text-center">
							Product Variations
						</h4>
						<p>
							Like the name suggests, product variations allow you to sell alternate offerings of the same product or multiple products without having to recreate the product(s) several times over. Think of product variations as child products with unique attributes like size, shape, size, texture, compositon etc. 
						</p>
						<p>
							A Product can have several variations. On {{$appName}}, stock, purchases, pricing and sales are all recorded against a combination of a product and a product variation.
						</p>
						<p>
							Product variations can serve multiple products at the same time. For example if you have a "Medium" variation in your store for products A,B and C, you are not required to create new variation for each product. Instead you can create a "Medium" variation and select it when recording a purchase for any one of the above listed products. 
						</p>
						<p>
							This is however not a strict rule you have to follow. If you feel comfortable with creating "Medium A", "Medium B" and "Medium C" respectively for each product, you are allowed to do so. Just note that two variations cannot bear the same name.
						</p>
						<p>
							Deactivating a product variation in your store will prevent you from selling products that are associated with that variation even if you have stock available.
						</p>
					</div>
					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger uk-margin-small-right" @click="modals.variations = false">
							Got It
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>

		<vue-final-modal v-model="modals.tags" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="true" overlay-class="uk-overlay-primary" attach=".app">
			<div class="uk-width-1-1 uk-margin-top uk-flex uk-flex-column uk-flex-middle">
				<div class="uk-width-1-1 uk-width-large@s  background bordered  rounded raised-deep uk-animation-scale-up uk-animation-fast uk-margin-top">
					<div class="uk-padding">
						<h4 class="uk-text-center">
							Tags / Categories
						</h4>
						<p>
							Tags / Catagories allow you to broadly categorize products in your store. This is not to be confused with product variations. Unlike variations, tags are very much optional and serve no purpose outside of analytics and filtering.
						</p>
						<p>
							Products can belong to multiple categories / tags. For example "Product A" in your store can belong to the "Clothing", "Fashion" and "Traditional Wear" tag / category.
						</p>

						<p>
							Deactivating a tag / category in your store has NO effect on the stock of products belonging to that stock.
						</p>
					</div>
					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger uk-margin-small-right" @click="modals.tags = false">
							Got It
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>


		<vue-final-modal v-model="modals.catalog" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="true" overlay-class="uk-overlay-primary" attach=".app">
			<div class="uk-width-1-1 uk-margin-top uk-flex uk-flex-column uk-flex-middle">
				<div class="uk-width-1-1 uk-width-large@s  background bordered  rounded raised-deep uk-animation-scale-up uk-animation-fast uk-margin-top">
					<div class="uk-padding">
						<h4 class="uk-text-center">
							Product Catalog
						</h4>
						<p>
							Your product catalog is the list of products you deal in as a store. This is NOT the same as your stock.
						</p>
						<p>
							You can add to list at any time you want. From this list, you will be able to select products and record purchases for them.
						</p>

						<p>
							When you deactivate a product that is in your catalog, you will not be able to record purchases for that product or sell stock of that product from your POS at any of your branches.
						</p>
					</div>
					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger uk-margin-small-right" @click="modals.catalog = false">
							Got It
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>

		<vue-final-modal v-model="modals.transfer" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical" :esc-to-close="true" overlay-class="uk-overlay-primary" attach=".app">
			<div class="uk-width-1-1 uk-margin-top uk-flex uk-flex-column uk-flex-middle">
				<div class="uk-width-1-1 uk-width-large@s  background bordered  rounded raised-deep uk-animation-scale-up uk-animation-fast uk-margin-top">
					<div class="uk-padding">
						<h4 class="uk-text-center">
							Product Transfers
						</h4>
						<p>
							Transfers are how you move products around in your store. All purchases are originally added to your Warehouse stock.
						</p>
						<p>
							To move stock from your warehouse to a branch, you will need to 
							<ol>
								<li>
									Go "Warehouse Stock" under inventory. 
								</li>
								<li>
									Select the products you want to transfer from the list provided
								</li>
								<li>
									Select a branch ppecify a reason for which you want to transfer the selected products
								</li>
								<li>
									Confirm the quantities of products to transfer and Submit the Transfer.
								</li>

							</ol>
						</p>

						<p>
							<span class="uk-text-bold uk-text-warning">
							Important!</span> Please note that transfers can go through a series of status changes before ending up at a branch or back at the warehouse. 
							This means you will need a staff account at the other end of the transfer to correspond with you on a transfer.
						</p>
					</div>
					<div class="tiny-padding border-top uk-flex uk-flex-center">
						<button class="uk-button uk-button-danger uk-margin-small-right" @click="modals.transfer = false">
							Got It
						</button>
					</div>
				</div>
			</div>
		</vue-final-modal>

	</div>	
</template>
<script>
import {setup} from "@/mixins/setup"
export default {
	mixins : [setup],
	data(){
		return {
			stage : 'basics',
			modals : {
				variations : false,
				tags : false,
				catalog : false,
				transfer : false
			}
		}
	},

}
</script>
