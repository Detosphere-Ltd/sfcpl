<template>
	<div>
		<div class="uk-flex">
			<div class="uk-width-expand uk-flex uk-flex-column border-right tiny-padding">
				<p class="uk-margin-remove">
					{{levy.name}}
				</p>
				<span class="text-small">
					{{levy.applies_to === 'sale' ? 'Applies to all products in a sale' : 'Applies to specific products in a sale'}}
				</span>
			</div>

			<div class="uk-width-x-small border-right tiny-padding center">
				<span>
					{{levy.percent / 100 | percent}}
				</span>
			</div>

			<div class="uk-width-x-small tiny-padding center border-right">

				<div class="label" :class="levy.active ? 'confirmed' : 'cancelled'">
					<small>
						{{ levy.active ? 'Active' : 'Inactive' }}
					</small>
				</div>
			</div>

			<div class="uk-width-small border-right tiny-padding center">
				<span class="uk-width-1-1 uk-text-truncate">
					{{levy.created_by && levy.created_by.name ? levy.created_by.name : 'System Generated' }}
				</span>
			</div>


			<div class="uk-width-x-small tiny-padding center" v-if="any(['update-levies' , 'change-levy-active-status'])">
				<div class="click" @click.prevent="$uikit.drop($refs.options).show()">
					<slot name="action-button">
						<div class="square-30 center bordered rounded click">
							<span class="mdi mdi-dots-vertical uk-text-large"></span>
						</div>
					</slot>
				</div>

				<div uk-drop="mode : click; delay-hide : 0; delay-show : 0; pos: bottom-right; offset: 0" ref="options">
					<div class="background bordered rounded uk-width-medium stripped-bottom">
						<levy-actions-update :levy="levy" v-if="can('update-levies')" @done="$emit('done')" @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()">
							<template #action-button>
								<div class="uk-flex click tiny-padding">
									<div class="square-30 rounded uk-button-view center uk-margin-small-right">
										<span class="mdi mdi-pencil"></span>
									</div>
									<div class="uk-flex uk-flex-column uk-width-expand">
										<span class="uk-text-truncate uk-text-bold">Update Levy</span>
										<span class="text-small uk-text-truncate">
											Update settings for this levy
										</span>
									</div>
								</div>
							</template>
						</levy-actions-update>


						<levy-actions-attach-products :url="`products?paginate=0`" :levy="levy" v-if="can(['change-levy-active-status']) && levy.active" @done="$emit('done')" @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()">
							<template #action-button>
								<div class="uk-flex click tiny-padding">
									<div class="square-30 center uk-button-view uk-margin-small-right rounded">
										<span class="mdi mdi-checkbook uk-text-large"></span>
									</div>
									<div class="uk-flex uk-flex-column uk-width-expand">
										<span class="uk-text-truncate uk-text-bold">Attach Products</span>
										<span class="text-small uk-text-truncate">
											Attach Products to this Levy
										</span>
									</div>
								</div>
							</template>
						</levy-actions-attach-products>


						<levy-actions-toggle :levy="levy" v-if="can('change-levy-active-status')" @done="$emit('done')" @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()">
							<template #action-button>
								<div class="uk-flex click tiny-padding">
									<div class="square-30 center uk-margin-small-right rounded" :class="levy.active ? 'uk-background-danger uk-text-white' : 'uk-background-success uk-text-white'">
										<span class="mdi uk-text-large" :class="levy.active ? 'mdi-cancel' : 'mdi-check'"></span>
									</div>
									<div class="uk-flex uk-flex-column uk-width-expand">
										<span class="uk-text-truncate uk-text-bold">{{levy.active ? 'Deactivate Levy' : 'Activate Levy'}}</span>
										<span class="text-small uk-text-truncate">
											{{ levy.active ? 'Deactivate this levy in your store' : 'Activate this levy in your store' }}
										</span>
									</div>
								</div>
							</template>
						</levy-actions-toggle>


					</div>
				</div>
			</div>

		</div>
	</div>	
</template>
<script>
import {bindProps} from "@/mixins/levy"
export default {
	mixins : [bindProps]
}
</script>
