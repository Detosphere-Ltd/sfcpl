<template>
	<div>
		<a class="chip uk-border-rounded" @click="showModal = true" :class="supplier.active ? 'uk-background-danger' : 'uk-background-primary'">
			<span class="text-small uk-text-white">
				{{supplier.active ? "Deactivate" : "Activate" }} 
			</span>
		</a>
		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-large-top" :esc-to-close="true" overlay-class="uk-overlay-primary">
			<div class="uk-card rounded background raised-deep uk-margin-auto uk-margin-auto-vertical uk-margin-remove-top uk-width-1-1 uk-inline uk-margin-auto uk-overflow-auto uk-width-medium@m uk-padding-remove bordered">
				<div class="uk-width-1-1 grid-padding uk-background-close uk-flex uk-flex-middle">
					<div class="square-25 uk-background-danger uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle click" @click.prevent="showModal = false">
						<span class="mdi mdi-close uk-text-white"></span>
					</div>
				</div>
				<div class="tiny-padding">
					<div class="uk-flex uk-flex-wrap uk-flex-column">
						
						<h5 class="uk-text-bold uk-text-dark uk-margin-remove">
							Are you sure you want to {{supplier.active ? "deactivate" : "activate" }} this supplier?
						</h5>
					</div>
					
					<hr class="uk-margin-small-bottom uk-margin-small-top">
					<p class="uk-margin-remove">
						This will {{supplier.active ? "deactivate" : "activate" }} {{supplier.name}} in your store's suppliers list.
					</p>
					<hr class="uk-margin-small-bottom">
					<div>
						<button class="uk-button uk-button-small" :disabled="loading" :class="supplier.active ? 'uk-button-danger' : 'uk-button-primary'" @click="toggle">
							<partials-loader v-if="loading"></partials-loader>
							<template v-else>
								{{supplier.active ? "Deactivate" : "Activate" }}
							</template>
						</button>

					</div>

				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import { bindProps , toggleActiveState } from "@/mixins/suppliers"
export default{
	mixins : [ bindProps , toggleActiveState ],
	data(){
		return {
			showModal : false,
		}
	},
};
</script>