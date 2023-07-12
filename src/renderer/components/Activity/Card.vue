<template>
	<div class="uk-width-1-1 uk-flex uk-flex-middle">

		<div class="grid-gutter uk-width-medium uk-margin-right">
			<div>
				<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
					{{ activity.caused_by ? activity.caused_by : 'System Automation' }}
				</p>
			</div>
		</div>



		<div class="grid-gutter">
			<div class="uk-width-medium">
				<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
					{{activity.activity}}
				</p>
			</div>
		</div>

		<div class="grid-gutter">
			<div class="uk-width-small">
				<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
					{{activity.description}}
				</p>
			</div>
		</div>

		<!-- <div class="grid-gutter">
			<div class="uk-width-small">
				<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
					Action
				</p>
			</div>
		</div> -->
		

		<div class="grid-gutter">
			<div class="uk-width-auto">
				<p class="uk-text-break uk-margin-remove uk-text-capitalize text-small">
					{{$moment(activity.created_at).format('D MMM, YYYY')}} &bull; {{$moment(activity.created_at).format('hh:mm A')}}
				</p>
			</div>
		</div>

	</div>
</template>

<script>
export default {
	props : {
		activity : {
			type : Object,
			required : true
		}
	}
}
</script>
