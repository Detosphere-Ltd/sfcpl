<template>
	<div class="uk-width-1-1">

		<div class="uk-width-1-1 uk-flex tiny-padding">

			

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{transfer.reference_no}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-medium">
					<p class="uk-text-break uk-margin-remove uk-text-capitalize">
						{{transfer.total_units | pluralize('unit')}} of {{transfer.total_products | pluralize('Product')}}
					</p>
					<span class="text-small uk-text-capitalize">
						{{ transfer.from_transfer_request ? 'Generated from Request' : 'Direct Transfer' }} &bull; {{ transfer.type }}
					</span>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						Warehouse
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{transfer.branch.name | branchize}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-small uk-flex">
					<span class="label" :class="transfer.current_state.to">
						<small class="uk-text-capitalize">{{transfer.current_state.to.split('_').join(' ')}}</small>
					</span>
				</div>
			</div>
			<div class="grid-gutter uk-visible@xl">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{$moment(transfer.current_state.created_at).format('DD MMM, YYYY')}} <br>
						<small>{{$moment(transfer.current_state.created_at).format('hh:mm A')}}</small>
					</p>
				</div>
			</div>

			<div class="grid-gutter uk-visible@xl">
				<div class="uk-width-small">
					<p class="uk-text-truncate uk-margin-remove uk-text-capitalize text-small">
						{{transfer.current_state.responsible.name}}
					</p>
				</div>
			</div>

			<div class="grid-gutter  uk-margin-small-right">
				<div class="uk-flex uk-flex-right uk-flex-middle">
					<div class="chip bordered uk-margin-small-right uk-border-rounded click" @click="showActions = !showActions" v-if="can('change-transfer-status') && (transfer.status !== 'confirmed' && transfer.status !== 'cancelled')">
						<span class="text-small"> {{showActions ? 'Hide' : 'Show'}} Actions</span>
					</div>

					<transfer-actions-details :transfer="transfer" :tab="'products'"></transfer-actions-details>
				</div>
			</div>
		</div>


		<!-- Can change transfer statuses -->
		<div v-if="showActions">
			<div v-if="can('change-transfer-status')">

				<div class="uk-width-1-1 tiny-padding border-top uk-flex uk-flex-middle uk-flex-wrap uk-flex-center">
					

					<transfer-actions-cancel class="uk-margin-small-right" :transfer="transfer" @done="$emit('needs-to-refresh')">
					</transfer-actions-cancel>

					<template v-if="transfer.status === 'created'">
						<transfer-actions-auto-dispatch class="uk-margin-small-right" :transfer="transfer" @done="$emit('needs-to-refresh')" v-if="transfer.type === 'automatic'">
						</transfer-actions-auto-dispatch>
						<transfer-actions-dispatch class="uk-margin-small-right" :transfer="transfer" @done="$emit('needs-to-refresh')" v-else>
						</transfer-actions-dispatch>
					</template>


					<template v-if="transfer.status === 'raised_issue'">
						<transfer-actions-auto-resolve class="uk-margin-small-right" :transfer="transfer" @done="$emit('needs-to-refresh')" v-if="transfer.type === 'automatic'">
						</transfer-actions-auto-resolve>

						<transfer-actions-manual-resolve class="uk-margin-small-right" :transfer="transfer" @done="$emit('needs-to-refresh')" v-else>
						</transfer-actions-manual-resolve>	
					</template>


				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/transfer"
export default{
	mixins : [bindProps],
	data(){
		return {
			showActions : false
		}
	}
};
</script>


