<template>
	<div>
		<div class="tiny-padding uk-padding-remove-vertical border-bottom border-lite background">
			<div  class="uk-flex uk-flex-column">
				<div class="uk-width-1-1 uk-flex uk-flex-middle uk-flex-between uk-margin-bottom uk-margin-small-top">
					<div class="uk-width-expand uk-flex uk-flex-column" >
						
						<div>
							<h4 class="uk-margin-remove uk-text-bold uk-margin-small-bottom">
								{{supplier.name}}
							</h4>
							<div class="uk-flex uk-flex-middle uk-margin-small-top">

								<div class="uk-flex uk-flex-middle  tiny-margin-bottom uk-margin-small-right">
									<span class="mdi mdi-map-marker tiny-margin-right"></span>
									<span>
										{{supplier.country && supplier.city ? `${supplier.country}, ${supplier.city}` : 'No Location Info' }}
									</span>
								</div>
								<div class="uk-flex uk-flex-middle  tiny-margin-bottom uk-margin-small-right">
									<span class="mdi mdi-phone tiny-margin-right"></span>
									<span>
										{{supplier.phone ? supplier.phone : 'No Phone Number Record' }}
									</span>
								</div>

								<div class="uk-flex uk-flex-middle  tiny-margin-bottom uk-margin-small-right">
									<span class="mdi mdi-email tiny-margin-right"></span>
									<span>
										{{supplier.email ? supplier.email : 'No Email Record' }}
									</span>
								</div>

								

								<div class="tiny-margin-bottom label" :class="supplier.active ? 'uk-background-success' : 'uk-background-danger'">	
									<span class="uk-text-white">{{ supplier.active ? "Active" : "Deactivated" }} Supplier</span> 
								</div>
							</div>
						</div>
					</div>

					<div class="uk-flex uk-flex-middle uk-flex-wrap">
						<supplier-actions-edit :supplier="supplier" @supplier-updated="$nuxt.refresh()" class="tiny-margin-bottom uk-margin-small-right">
						</supplier-actions-edit>
						<supplier-actions-toggle-status :supplier="supplier" @supplier-status-changed="$nuxt.refresh()" class="tiny-margin-bottom">
						</supplier-actions-toggle-status>


					</div>
				</div>
			</div>
		</div>


		<div class="tiny-padding">
			<nuxt-child :supplier="supplier"/>	
		</div>	
	</div>	
</template>
<script>
export default{
	async asyncData({$axios, params, error}){
		let supplier = {}
		await $axios.$get(`/suppliers/${params.supplier}?include=created_by`)
		.then(res => {
			supplier = res.data
		})
		.catch((err)=>{
			error({statusCode : 404, message : "Supplier Info No Found"})
		})
		return {supplier}
	},

};
</script>
