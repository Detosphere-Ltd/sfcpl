<template>
	<div class="uk-flex sidebar">
		<aside class="uk-width-auto icon-sidebar uk-flex uk-flex-column grid-padding uk-padding-remove-vertical border-right">
			<nuxt-link :to="{name : 'home'}" class="uk-margin-small-bottom uk-margin-small-bottom uk-margin-auto uk-margin-small-top">
				<partials-app-logo></partials-app-logo>
			</nuxt-link>

			<div class="uk-flex uk-flex-column">
				<nuxt-link :to="{name: 'home'}" class="uk-flex uk-flex-column uk-flex-middle uk-margin-small-bottom sidebar-icon" :class="$route.name.startsWith('home') || $route.name.startsWith('customize') ? 'active-sidebar-link' : ''">
					<span class="square-30 uk-flex uk-flex-column uk-flex-center uk-flex-middle tiny-margin-bottom">
						<span class="mdi mdi-home-plus-outline lni-large uk-margin-remove"></span>
					</span>
					<span>
						Dashboard
					</span>
				</nuxt-link>
				<nuxt-link :to="{name: 'inventory'}" class="uk-flex uk-flex-column uk-flex-middle uk-margin-small-bottom sidebar-icon" :class="$route.name.startsWith('inventory') ? 'active-sidebar-link' : ''" v-if="can('view-products')">
					<span class="square-30 uk-flex uk-flex-column uk-flex-center uk-flex-middle tiny-margin-bottom">
						<span class="mdi mdi-database lni-large uk-margin-remove"></span>
					</span>
					<span>
						Inventory
					</span>
				</nuxt-link>

				<nuxt-link :to="{name: 'sales'}" class="uk-flex uk-flex-column uk-flex-middle uk-margin-small-bottom sidebar-icon" :class="$route.name.startsWith('sales') ? 'active-sidebar-link' : ''"  v-if="can('view-sales')">
					<span class="square-30 uk-flex uk-flex-column uk-flex-center uk-flex-middle tiny-margin-bottom">
						<span class="mdi mdi-sale lni-large uk-margin-remove"></span>
					</span>
					<span>
						Sales
					</span>
				</nuxt-link>


				<nuxt-link :to="{name: 'branches'}" class="uk-flex uk-flex-column uk-flex-middle uk-margin-small-bottom sidebar-icon" :class="$route.name.startsWith('branches') ? 'active-sidebar-link' : ''" v-if="can('view-branches')">
					<span class="square-30 uk-flex uk-flex-column uk-flex-center uk-flex-middle tiny-margin-bottom">
						<span class="mdi mdi-store lni-large uk-margin-remove"></span>
					</span>
					<span>
						Branches
					</span>
				</nuxt-link>


				<nuxt-link :to="{name: 'staff'}" class="uk-flex uk-flex-column uk-flex-middle uk-margin-small-bottom sidebar-icon" :class="$route.name.startsWith('staff') || $route.name.startsWith('access') ? 'active-sidebar-link' : ''" v-if="can('view-users')">
					<span class="square-30 uk-flex uk-flex-column uk-flex-center uk-flex-middle tiny-margin-bottom">
						<span class="mdi mdi-account-group-outline lni-large uk-margin-remove"></span>
					</span>
					<span>
						Staff
					</span>
				</nuxt-link>

				<nuxt-link :to="{name: 'suppliers'}" class="uk-flex uk-flex-column uk-flex-middle uk-margin-small-bottom sidebar-icon" :class="$route.name.startsWith('suppliers') ? 'active-sidebar-link' : ''" v-if="can('view-suppliers')">
					<span class="square-30 uk-flex uk-flex-column uk-flex-center uk-flex-middle tiny-margin-bottom">
						<span class="mdi mdi-cart-arrow-down lni-large uk-margin-remove"></span>
					</span>
					<span>
						Suppliers
					</span>
				</nuxt-link>

				<nuxt-link :to="{name: 'customers'}" class="uk-flex uk-flex-column uk-flex-middle uk-margin-small-bottom sidebar-icon" :class="$route.name.startsWith('customers') ? 'active-sidebar-link' : ''" v-if="can('view-customers')">
					<span class="square-30 uk-flex uk-flex-column uk-flex-center uk-flex-middle tiny-margin-bottom">
						<span class="mdi mdi-drama-masks lni-large uk-margin-remove"></span>
					</span>
					<span>
						Customers
					</span>
				</nuxt-link>

				

				



				<nuxt-link :to="{name: 'reports'}" class="uk-flex uk-flex-column uk-flex-middle uk-margin-small-bottom sidebar-icon" :class="$route.name.startsWith('reports') ? 'active-sidebar-link' : ''" v-if="can('view-reports')">
					<span class="square-30 uk-flex uk-flex-column uk-flex-center uk-flex-middle tiny-margin-bottom">
						<span class="mdi mdi-poll lni-large uk-margin-remove"></span>
					</span>
					<span>
						Reports
					</span>
				</nuxt-link>

				

			</div>

			<div></div>
			<nuxt-link :to="{name: 'customize'}" class="uk-flex uk-flex-column uk-flex-middle  sidebar-icon uk-margin-small-bottom uk-margin-auto-vertical uk-margin-remove-bottom" :class="$route.name === 'customize' ? 'active-sidebar-link' : ''" v-if="can(['update-store', 'manage-store-logo', 'setup-store'])">
				<span class="square-30 uk-flex uk-flex-column uk-flex-center uk-flex-middle tiny-margin-bottom">
					<span class="mdi mdi-cog-outline lni-large uk-margin-remove"></span>
				</span>
				<span>
					Settings
				</span>
			</nuxt-link>
		</aside>





		<aside class="menu-sidebar background uk-height-1-1 uk-padding-small uk-flex uk-flex-column uk-flex-between uk-overflow-auto border-light-right uk-visible@s uk-width-1-1 uk-animation-slide-left-small uk-animation-fast border-right" v-show="noPerms && !dontShow.includes($route.name)">

			<div class="uk-padding-large uk-padding-remove-horizontal uk-padding-remove-top">

				<span class="text-small">
					Control Panel
				</span>
				<h5 class="uk-text-bold uk-margin-remove-top uk-margin-bottom">
					{{$auth.user.store.name}}
				</h5>

				<div v-if="$route.name.startsWith('staff') || $route.name.startsWith('access')">

					<ul class="uk-nav-default uk-nav-parent-icon" uk-nav>	
						<li class="uk-nav-header uk-margin-remove-top">
							<span class="uk-text-capitlize text-small">
								Staff & Access Control
							</span>
						</li>
						<li class="uk-margin-small-bottom">
							<nuxt-link :to="{name: 'staff'}" exact exact-active-class="active-text">
								<span class="uk-margin-small-right lni-large mdi mdi-account-group-outline"></span>
								<span>
									Staff Members
								</span>
							</nuxt-link>
						</li>

						<li class="uk-margin-small-bottom">
							<nuxt-link :to="{name: 'staff-activity'}" exact exact-active-class="active-text">
								<span class="uk-margin-small-right lni-large mdi mdi-post"></span>
								<span>
									Activity Logs
								</span>
							</nuxt-link>
						</li>

						<li v-if="can('view-roles')" class="uk-margin-small-bottom">
							<nuxt-link :to="{name: 'access'}" exact exact-active-class="active-text">
								<span class="uk-margin-small-right lni-large mdi mdi-account-key-outline"></span>
								<span>
									Store Roles
								</span>
							</nuxt-link>
						</li>

						<li v-if="can('view-permissions')" class="uk-margin-small-bottom">
							<nuxt-link :to="{name: 'access-permissions'}" exact exact-active-class="active-text">
								<span class="uk-margin-small-right lni-large mdi mdi-shield-half-full"></span>
								<span>
									Store Permissions
								</span>
							</nuxt-link>
						</li>

					</ul>
				</div>



				
				<div  v-else-if="$route.name.startsWith('profile')">
					<ul class="uk-nav-default uk-nav-parent-icon" uk-nav>	
						<li class="uk-nav-header uk-margin-remove-top">
							<span class="uk-text-capitlize text-small">
								Profile
							</span>
						</li>
						<li>
							<nuxt-link :to="{name: 'profile'}" exact exact-active-class="active-text">
								<span class="uk-margin-small-right mdi mdi-account-outline lni-large"></span>
								<span>
									My Profile
								</span>
							</nuxt-link>
						</li>
					</ul>


					<nuxt-link :to="{name: 'logout'}" class="uk-button uk-button-danger uk-border-rounded uk-flex uk-flex-middle uk-margin-top uk-margin-auto-right">
						<span class="uk-margin-small-right mdi mdi-power lni-large"></span>
						<span class="uk-text-bold text-small-spaced uk-text-uppercase">
							Logout
						</span>
					</nuxt-link>
				</div>

				<div  v-else-if="$route.name.startsWith('inventory')">
					<ul class="uk-nav-default uk-nav-parent-icon" uk-nav>	
						<li class="uk-nav-header uk-margin-remove-top">
							<span class="uk-text-capitlize text-small">
								Inventory
							</span>
						</li>

						<li class="uk-margin-small-bottom" v-if="can('view-products')">
							<nuxt-link :to="{name: 'inventory'}" exact exact-active-class="active-text">
								<span class="mdi mdi-warehouse lni-large uk-margin-remove"></span>
								<span>
									Warehouse Stock
								</span>
							</nuxt-link>
						</li>

						<li class="uk-margin-small-bottom" v-if="can('view-products')">
							<nuxt-link :to="{name: 'inventory-catalog'}" exact exact-active-class="active-text">
								<span class="mdi mdi-package lni-large uk-margin-remove"></span>
								<span>
									Products Catalog
								</span>
							</nuxt-link>
						</li>

						<li class="uk-margin-small-bottom"  v-if="can('view-purchases')">
							<nuxt-link :to="{name: 'inventory-purchases'}" exact exact-active-class="active-text">
								<span class="mdi mdi-receipt lni-large uk-margin-remove"></span>
								<span>
									Purchases
								</span>
							</nuxt-link>
						</li>

						<li class="uk-margin-small-bottom"  v-if="can('view-purchases')">
							<nuxt-link :to="{name: 'inventory-purchases-invoices'}" exact exact-active-class="active-text">
								<span class="mdi mdi-receipt lni-large uk-margin-remove"></span>
								<span>
									Purchase Invoices
								</span>
							</nuxt-link>
						</li>

						<li class="uk-margin-small-bottom"  v-if="can('view-unit-types')">
							<nuxt-link :to="{name: 'inventory-purchases-units'}" exact exact-active-class="active-text">
								<span class="mdi mdi-scale-balance lni-large uk-margin-remove"></span>
								<span>
									Purchasable Units
								</span>
							</nuxt-link>
						</li>
						


						<li class="uk-margin-small-bottom" v-if="can('view-variations')">
							<nuxt-link :to="{name: 'inventory-variations'}" exact exact-active-class="active-text">
								<span class="mdi mdi-ab-testing lni-large uk-margin-remove"></span>
								<span>
									Product Variations
								</span>
							</nuxt-link>
						</li>

						<li class="uk-margin-small-bottom" v-if="can('view-tags')">
							<nuxt-link :to="{name: 'inventory-tags'}" exact exact-active-class="active-text">
								<span class="mdi mdi-tag-multiple lni-large uk-margin-remove"></span>
								<span>
									Product Tags
								</span>
							</nuxt-link>
						</li>

						<li class="uk-margin-small-bottom"  v-if="can('view-transfers')">
							<nuxt-link :to="{name: 'inventory-transfers'}" exact exact-active-class="active-text">
								<span class="mdi mdi-swap-horizontal lni-large uk-margin-remove"></span>
								<span>
									Stock Transfers
								</span>
							</nuxt-link>
						</li>

						<li class="uk-margin-small-bottom" v-if="can('view-transfer-requests')">
							<nuxt-link :to="{name: 'inventory-requests'}" exact exact-active-class="active-text">
								<span class="mdi mdi-transfer lni-large uk-margin-remove"></span>
								<span>
									Stock Requests
								</span>
							</nuxt-link>
						</li>

						<li class="uk-margin-small-bottom" v-if="can('view-stock-adjustments')">
							<nuxt-link :to="{name: 'inventory-adjustments'}" exact exact-active-class="active-text">
								<span class="mdi mdi-wrap lni-large uk-margin-remove"></span>
								<span>
									Stock Adjustments
								</span>
							</nuxt-link>
						</li>


						

						
						
					</ul>
				</div>
				<div v-else-if="$route.name.startsWith('reports')">

					<ul class="uk-nav-default uk-nav-parent-icon" uk-nav>	
						<li class="uk-nav-header uk-margin-remove-top">
							<span class="uk-text-capitlize text-small">
								Reports
							</span>
						</li>
						<li class="uk-margin-small-bottom">
							<nuxt-link :to="{name: 'reports'}" exact exact-active-class="active-text">
								<span class="uk-margin-small-right lni-large mdi mdi-poll"></span>
								<span>
									Overview
								</span>
							</nuxt-link>
						</li>

						
						<li class="uk-margin-small-bottom">
							<nuxt-link :to="{name: 'reports-stock'}" :class="$route.name.startsWith('reports-stock') ? 'active-text' : ''">
								<span class="uk-margin-small-right lni-large mdi mdi-database"></span>
								<span>
									Stock Report
								</span>
							</nuxt-link>
						</li>



						<li class="uk-margin-small-bottom">
							<nuxt-link :to="{name: 'reports-sales'}" :class="$route.name.startsWith('reports-sales') ? 'active-text' : ''">
								<span class="uk-margin-small-right lni-large mdi mdi-sale"></span>
								<span>
									Sales Report
								</span>
							</nuxt-link>
						</li>
						
						<li class="uk-margin-small-bottom">
							<nuxt-link :to="{name: 'reports-performance'}" exact exact-active-class="active-text">
								<span class="uk-margin-small-right lni-large mdi mdi-chart-line-variant"></span>
								<span>
									Performance
								</span>
							</nuxt-link>
						</li>

						<li class="uk-margin-small-bottom">
							<nuxt-link :to="{name: 'reports-compare'}" :class="$route.name.startsWith('reports-compare') ? 'active-text' : ''">
								<span class="uk-margin-small-right lni-large mdi mdi-compare"></span>
								<span>
									Comparisons
								</span>
							</nuxt-link>
						</li>

						<li class="uk-margin-small-bottom">
							<nuxt-link :to="{name: 'reports-suppliers'}" exact exact-active-class="active-text">
								<span class="uk-margin-small-right lni-large mdi mdi-cart-arrow-down"></span>
								<span>
									Suppliers Report
								</span>
							</nuxt-link>
						</li>

						<li class="uk-margin-small-bottom">
							<nuxt-link :to="{name: 'reports-customers'}" exact exact-active-class="active-text">
								<span class="uk-margin-small-right lni-large mdi mdi-drama-masks"></span>
								<span>
									Customers Report
								</span>
							</nuxt-link>
						</li>

						<li class="uk-margin-small-bottom">
							<nuxt-link :to="{name: 'reports-years'}" :class="$route.name.startsWith('reports-years') ? 'active-text' : ''">
								<span class="uk-margin-small-right lni-large mdi mdi-calendar-text"></span>
								<span>
									Period Reports
								</span>
							</nuxt-link>
						</li>

					</ul>
				</div>
			</div>
		</aside>

	</div>
</template>
<script>
import config from "@/mixins/config"
export default{
	mixins : [config]
};
</script>
