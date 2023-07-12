<template>
	<div class="uk-width-1-1 uk-flex uk-flex-top">
		<div class="grid-gutter uk-width-medium uk-margin-auto-right">
			<p class="uk-text-truncate uk-margin-remove uk-text-bold">
				{{unit.name}}
			</p>
		</div>

		<div class="uk-width-small uk-flex uk-flex-middle grid-gutter uk-padding-remove-vertical">
			<unit-actions-toggle class="uk-margin-small-right uk-text-center" :unit="unit" @done="$emit('needs-to-refresh')">
				<div class="square-30 click uk-border-circle uk-flex uk-flex-column uk-flex-center uk-flex-middle"  slot="action-button" :class="unit.active ? 'uk-background-danger' : 'uk-background-primary'">
					<span class="mdi uk-text-white" :class="unit.active ? 'mdi-archive-minus-outline' : 'mdi-archive-plus-outline'"></span>
				</div>
			</unit-actions-toggle>
			<unit-actions-edit :unit="unit" @done="$emit('needs-to-refresh')"></unit-actions-edit>
		</div>

		<div class="grid-gutter uk-width-medium uk-margin-auto-left">
			<div class="uk-width-1-1 uk-flex uk-flex-column uk-padding-small uk-padding-remove-vertical uk-padding-remove-left">
				<p class="uk-text-break uk-margin-remove text-small">
					{{unit.description ? unit.description : 'No Description' | truncate(truncateBy)}}
				</p>


				<span class="status uk-margin-auto-right tiny-margin-top pill background bordered click" v-if="unit.description && unit.description.length > 70" @click="truncateBy = truncateBy > 70 ? 70 : unit.description.length">
					<small>
						{{ truncateBy > 70 ? "Show Less" : "Show More" }}
					</small>
				</span>
			</div>


		</div>

		<div class="grid-gutter uk-width-small">
			<div class="uk-width-1-1">
				<nuxt-link :to="{name: 'inventory-purchases', query : {unit : unit.uuid}}" v-if="can('view-purchases')" class="uk-text-truncate highlight-text underlined">
					{{unit.total_purchases | pluralize('Purchase')}}
				</nuxt-link>
				<p class="uk-text-truncate uk-margin-remove text-small" v-else>
					{{unit.total_purchases | pluralize('Purchase')}}
				</p>
			</div>
		</div>
		

		<div class="grid-gutter uk-width-small">
			<div class="uk-width-1-1">
				<p class="uk-text-truncate uk-margin-remove text-small">
					{{$moment(unit.created_at).format('DD MMM, YYYY')}}
				</p>
			</div>
		</div>

		<div class="grid-gutter uk-width-small">
			<div class="uk-width-1-1 uk-flex uk-flex-middle">
				<partials-avatar size="25" class="tiny-margin-right" v-if="unit.created_by && unit.created_by.avatar" :media="unit.created_by.avatar"></partials-avatar>
				<p class="uk-text-truncate uk-margin-remove text-small">
					{{unit.created_by && unit.created_by.name !== undefined ? unit.created_by.name : 'System Generated'}}
				</p>
			</div>
		</div>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/unit"
export default {
	mixins : [bindProps],

	data(){
		return {
			truncateBy : 70
		}
	}
}
</script>
