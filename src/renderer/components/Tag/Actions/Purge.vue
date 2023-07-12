<template>
	<div>
		<div class="uk-background-danger-op square-25 click uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle"  @click="showModal = true">
			<span class="mdi mdi-delete uk-text-danger"></span>
		</div>
		<vue-final-modal v-model="showModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-class="uk-margin-auto uk-margin-large-top" :esc-to-close="true" overlay-class="uk-overlay-primary">
			<div class="uk-card rounded background bordered raised-deep uk-margin-auto uk-margin-auto-vertical uk-margin-remove-top uk-width-1-1 uk-inline uk-margin-auto uk-overflow-auto uk-width-medium@m uk-padding-remove">
				<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
					<h5 class="uk-margin-remove uk-text-bold">
						Delete Tag
					</h5>
					<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="showModal = false" :disabled="loading">
						Close
					</a>
				</div>
				<div class="uk-padding-small">
					<p>
						Are you sure you want to delete this tag? 
					</p>

					<button class="uk-button uk-button-danger uk-border-rounded uk-button-small" :disabled="loading" @click.prevent="deleteTag">
						<partials-loader v-if="loading"></partials-loader>
						<template v-else>
							Delete Tag
						</template>
					</button>

				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
import {bindProps, purge} from "@/mixins/productTag"
export default{
	mixins : [bindProps , purge],
	data(){
		return {
			showModal : false,
		}
	},
};
</script>
