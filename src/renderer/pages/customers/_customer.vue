<template>
	<div class="uk-width-1-1">
		<div class="tiny-padding uk-padding-remove-vertical uk-width-1-1 background border-bottom">
			<div class="uk-width-1-1 uk-margin-small-top uk-margin-bottom">
				<h4>{{customer.name}}</h4>
				<div class="uk-flex uk-flex-middle uk-margin-small-top">

					<div class="tiny-margin-bottom label uk-margin-small-right" :class="customer.active ? 'uk-background-success' : 'uk-background-danger'">	
						<span class="uk-text-white">{{ customer.active ? "Active" : "Deactivated" }} Customer</span> 
					</div>


					<div class="uk-flex uk-flex-middle  tiny-margin-bottom uk-margin-small-right">
						<span class="mdi mdi-phone tiny-margin-right"></span>
						<span>
							{{customer.phone ? customer.phone : 'N/A' }}
						</span>
					</div>

					<div class="uk-flex uk-flex-middle  tiny-margin-bottom uk-margin-small-right">
						<span class="mdi mdi-email tiny-margin-right"></span>
						<span>
							{{customer.email ? customer.email : 'N/A' }}
						</span>
					</div>


					<div class="uk-flex uk-flex-middle  tiny-margin-bottom uk-margin-small-right">
						<span class="mdi mdi-gender-male tiny-margin-right"></span>
						<span class="uk-text-capitalize">
							Gender : {{customer.gender ? customer.gender : 'N/A' }}
						</span>
					</div>





				</div>



				<p class="uk-margin-remove-bottom tiny-margin-top">
					Added {{$moment(customer.created_at).fromNow()}} at
					<template v-if="customer.branch && customer.branch.name !== undefined">
						<nuxt-link :to="{name : 'branches-branch', params : {branch : customer.branch.uuid}}" v-if="can('view-branches')">
							<span class="highlight-text underlined">
								{{customer.branch.name | branchize }}
							</span>
						</nuxt-link>

						<template v-else>
							{{customer.branch.name | branchize }}
						</template>
					</template>
					<template v-else>Control Panel</template>

				</p>

				<div class="uk-flex">
					<div class="tiny-padding uk-border-rounded uk-margin-small-top uk-flex uk-width-medium uk-margin-small-right" :class="customer.has_debt ? 'uk-background-danger uk-text-white' : 'bordered'">
						<div class="uk-width-expand uk-flex uk-flex-column">
							<span class="text-small">
								Total Debt
							</span>
							<h5 class="uk-margin-remove">{{customer.total_debt | currency(`${emporium.currency} `)}}</h5>
						</div>
					</div>

					<div class="bordered tiny-padding uk-border-rounded uk-margin-small-top uk-flex uk-width-medium" v-if="customer.created_by && customer.created_by.name">

						<partials-avatar :size="35" :media="customer.created_by.avatar" v-if="customer.created_by.avatar && customer.created_by.avatar.medium !== undefined" class="uk-margin-small-right"></partials-avatar>
						<div class="uk-width-expand uk-flex uk-flex-column">
							<span class="text-small">
								Added By
							</span>
							<h5 class="uk-margin-remove">{{customer.created_by.name}}</h5>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div>
			<nuxt-child :customer="customer"/>
		</div>
	</div>
</template>
<script>
export default{
	async asyncData({$axios, params, error}){
		let customer = {}
		await $axios.$get(`/customers/${params.customer}?include=branch,created_by,last_sale`)
		.then(res => {
			customer = res.data
		})
		.catch((err)=>{
			error({statusCode : 404, message : "Customer Info No Found"})
		})
		return {customer}
	}

};
</script>

