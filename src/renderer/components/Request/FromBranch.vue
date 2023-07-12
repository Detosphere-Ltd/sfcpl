<template>
	<div>
		<div class="uk-width-1-1 uk-flex uk-flex-top tiny-padding">
			<div class="square-30 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
				<span class="mdi mdi-arrow-right-circle lni-large uk-text-success"></span>
			</div>

			<div class="uk-width-expand uk-margin-left uk-margin-right">
				<div class="uk-flex uk-flex-column">
					<h5 class="uk-margin-small-bottom uk-text-bold">
						Request Received from {{transfer.branch.name | branchize }} for {{transfer.total_units | pluralize('unit')}} of {{transfer.total_products | pluralize('product')}} 

					</h5>
					<template v-if="transfer.status === 'submitted'">
						<div class="uk-flex uk-flex-middle tiny-margin-top">
							<partials-avatar :size="25" :media="transfer.created_by.avatar" class="uk-margin-small-right"></partials-avatar>
							<p class="uk-margin-remove">
								{{transfer.current_state.responsible.name}} Submitted A Stock Request
							</p>
						</div>
					</template>

					<template v-else>
						<p class="uk-flex uk-flex-wrap uk-flex-middle uk-margin-remove-bottom text-small">
							
							
							<span class="label status tiny-margin-right tiny-margin-left text-small uk-border-rounded uk-text-capitalize" :class="transfer.current_state.from">
								<span>{{transfer.current_state.from.split('_').join(' ')}}</span>
							</span> 
							
							&rarr;

							<span class="label status tiny-margin-right tiny-margin-left text-small uk-border-rounded uk-text-capitalize" :class="transfer.current_state.to">
								<span>{{transfer.current_state.to.split('_').join(' ')}} </span>
							</span>

							by {{transfer.current_state.responsible.name}}
							
							at {{$moment(transfer.current_state.created_at).format('hh:mm a')}} 

							on {{$moment(transfer.current_state.created_at).format('dddd, DD MMM, YYYY')}}
						</p>
					</template>
				</div>

				<template v-if="can('change-transfer-request-status') && allowedStateChanges.includes(transfer.status)">
					<div class="uk-width-1-1 uk-margin-small-top tiny-padding uk-padding-remove-horizontal uk-padding-remove-bottom border-top uk-flex uk-flex-middle" v-show="showActions">
						<request-actions-reject :transfer="transfer" class="tiny-margin-right" @done="$emit('needs-to-refresh')" v-if="transfer.status === 'submitted' || transfer.status === 'processing'"></request-actions-reject>
						<request-actions-accept :transfer="transfer" class="tiny-margin-right" @done="$emit('needs-to-refresh')" v-if="transfer.status === 'submitted'"></request-actions-accept>
					</div>
				</template>


			</div>

			<div class="uk-width-auto uk-flex uk-flex-right">
				<div class="chip bordered uk-border-rounded tiny-margin-right text-small click" @click="showActions = !showActions" v-if="can('change-transfer-request-status') && allowedStateChanges.includes(transfer.status)">
					{{showActions ? 'Hide' : 'Show'}} Actions
				</div>

				<request-actions-view-details :transfer="transfer"></request-actions-view-details>
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
	},

	computed : {
		allowedStateChanges(){
			return ['submitted']
		}
	}
};
</script>
