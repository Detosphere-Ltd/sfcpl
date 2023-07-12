<template>
	<div class="uk-width-1-1 uk-flex uk-flex-middle">

		<div class="uk-width-small grid-gutter uk-margin-right">
			<span>
				{{$moment(year.started_at).format('DD MMMM, YYYY')}}
			</span>
		</div>

		<div class="uk-width-small grid-gutter">
			<span>
				{{$moment(year.ended_at).format('DD MMMM, YYYY')}}
			</span>
		</div>
		<div class="uk-width-small grid-gutter">
			<div class="uk-flex">
				<span class="status label" :class="statuses[year.status]">
					<span>
						{{year.status | capitalize}}
					</span>
				</span>
			</div>
		</div>

		<div class="uk-width-small grid-gutter">
			<span>
				{{year.store_opening_stock | number('0,0') | pluralize('Unit')}}
			</span>
		</div>

		<div class="uk-width-small grid-gutter">
			<span>
				{{year.sellable_purchase_quantity | number('0,0') | pluralize('Unit')}}
			</span>
		</div>

		<div class="uk-width-small grid-gutter">
			<span>
				{{year.store_closing_stock | number('0,0') | pluralize('Unit')}}
			</span>
		</div>

		<div class="uk-width-small grid-gutter">
			<template v-if="year.status === 'cancelled'">
				<span>
					{{year.cancelled_by && year.cancelled_by.name !== undefined ? year.cancelled_by.name : 'System Admin'}}
				</span>
			</template>

			<template v-else>
				<span>
					{{year.closed_by && year.closed_by.name !== undefined ? year.closed_by.name : 'System Admin'}}
				</span>
			</template>
		</div>

		<div class="grid-gutter uk-width-small" v-if="year.status === 'completed' || year.status === 'pending'">
			<div class="uk-flex">
				<period-actions-cancel-closure  :year="year" class="uk-margin-small-right" @done="$emit('needs-to-refresh')"  v-if="year.status === 'pending'">
					<template #action-button>
						<button class="uk-button uk-button-danger uk-button-small" :disabled="year.status !== 'pending'">
							Cancel Closure
						</button>
					</template>
				</period-actions-cancel-closure>


				<period-actions-view-detail :year="year" v-if="year.status === 'completed'">
					<template #action-button>
						<button class="uk-button uk-button-primary uk-button-small">
							View Report
						</button>
					</template>
				</period-actions-view-detail>
			</div>
		</div>

	</div>
</template>
<script>
import {bindProps} from "@/mixins/periods/singleton"
export default {
	mixins : [bindProps]
}
</script>
