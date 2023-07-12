<template>
	<div>
		
		<div class="uk-width-1-1 uk-flex uk-flex-middle">

			<div class="grid-gutter uk-width-small tiny-margin-right">
				<div>
					<p class="uk-text-truncate uk-margin-remove text-small">
						{{$moment(adjustment.created_at).format('DD MMMM, YYYY')}}
					</p>
				</div>
			</div>


			<div class="grid-gutter uk-width-small tiny-margin-right">
				<div>
					<p class="uk-text-truncate uk-margin-remove text-small">
						{{$moment(adjustment.created_at).format('hh:mm A')}}
					</p>
				</div>
			</div>



			<div class="grid-gutter uk-width-small tiny-margin-right">
				<div>
					<p class="uk-text-truncate uk-margin-remove text-small" >
						<template v-if="adjustment.branch && adjustment.branch.name !== undefined">		
							{{adjustment.branch.name | branchize}}
						</template>
						<template v-else>
							Warehouse
						</template>
					</p>
					
				</div>
			</div>

			<div class="grid-gutter uk-width-small tiny-margin-right">
				<div>
					<p class="uk-text-truncate uk-margin-remove text-small">
						{{adjustment.quantity | number('0,0') | pluralize('Unit') }}
					</p>
				</div>
			</div>

			<div class="grid-gutter uk-width-small tiny-margin-right">
				<div>
					<p class="uk-text-truncate uk-margin-remove text-small uk-text-capitalize">
						{{adjustment.tags[0].name}}
					</p>
				</div>
			</div>

			<div class="grid-gutter uk-width-small tiny-margin-right">
				<div>
					<p class="uk-text-truncate uk-margin-remove text-small uk-text-capitalize">
						{{adjustment.created_by.name}}
					</p>
				</div>
			</div>

			<div class="grid-gutter">
				<div class="uk-width-x-small uk-flex">
					<div class="label" :class="adjustment.is_reversed ? 'label-danger' : 'label-success'">
						<span>
							{{  adjustment.is_reversed ? 'Reversed' : 'Valid' }}
						</span>
					</div>
				</div>
			</div>


			<div class="grid-gutter uk-width-expand uk-visible@xl uk-margin-small-right">
				<div class="uk-width-1-1">
					<p class="uk-text-truncate uk-margin-remove text-small" :class="{'click underlined' : adjustment.note}" @click="adjustment.note ? noteModal = true : null">
						{{adjustment.note ? adjustment.note : '- - -' | truncate(70)}}					
					</p>
				</div>
			</div>

			<div class="grid-gutter" v-if="can('reverse-stock-adjustments')">
				<div class="uk-width-x-small">
					<div class="square-30 uk-border-rounded uk-button-view click uk-flex uk-flex-column uk-flex-center uk-flex-middle" @click="$emit('focused', adjustment.uuid)">
						<span class="mdi lni-large" :class="adjustment.uuid === focusedEntry ? ' mdi-chevron-up' : ' mdi-chevron-down'"></span>
					</div>
				</div>
			</div>
		</div>

		<div class="uk-flex uk-flex-center tiny-padding uk-padding-remove-horizontal uk-width-1-1 border-top uk-margin-small-top" v-if="focusedEntry === adjustment.uuid">
			

			<stock-actions-reverse-adjustment v-if="can('reverse-stock-adjustments') && !adjustment.is_reversed && adjustment.model_type === 'purchase'" @done="$emit('needs-to-refresh')" :adjustment="adjustment" class="uk-margin-auto-vertical"></stock-actions-reverse-adjustment>

			<a class="uk-text-truncate uk-margin-remove-vertical chip uk-border-rounded uk-button-view uk-margin-small-left" @click="detailsModal = true">
				<small class="text-small">
					View Adjustment Details
				</small>
			</a>
		</div>

		<vue-final-modal v-model="noteModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" @before-open="detailsModal = false" attach=".app">
			<div class="uk-width-1-1 uk-margin-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Adjustment Notes
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="noteModal = false">
							Close
						</a>
					</div>

					<div class="uk-overflow-auto modal-content">
						<div class="tiny-padding uk-flex uk-flex-column">
							<div class="uk-flex uk-flex-column">
								<p class="uk-margin-remove">
									Recorded by {{adjustment.created_by.name}}
								</p>
								<span>
									{{$moment(adjustment.created_at).format('ddd MMM DD, YYYY')}} at {{$moment(adjustment.created_at).format('hh:mm A')}}

									&nbsp;&bull;&nbsp;
									
									<template v-if="adjustment.branch && adjustment.branch.name">
										At {{adjustment.branch.name | branchize}}
									</template>
									<template v-else>
										At Warehouse
									</template>

									
								</span>
								<span>
									Reason : {{ adjustment.tags[0].name | capitalize }}
								</span>
							</div>
							<div class="tiny-padding uk-padding-remove-top uk-padding-remove-horizontal uk-flex uk-flex-top tiny-margin-top" v-if="adjustment.note">
								<span class="text-small-spaced uk-text-uppercase tiny-margin-top">Note : </span>
								<p class="uk-margin-remove-bottom uk-width-expand uk-margin-small-left">
									{{ adjustment.note }}
								</p>
							</div>
						</div>

						<div class="tiny-padding border-top" v-if="adjustment.is_reversed">

							<div class="uk-flex uk-flex-column">
								<p class="uk-margin-remove">
									Reversed by {{adjustment.reversed_by.name}}
								</p>
								<span>
									{{$moment(adjustment.reversed_at).format('ddd MMM DD, YYYY')}} at {{$moment(adjustment.reversed_at).format('hh:mm A')}}

									&nbsp;&bull;&nbsp;
									
									<template v-if="adjustment.branch && adjustment.branch.name">
										At {{adjustment.branch.name | branchize}}
									</template>
									<template v-else>
										At Warehouse
									</template>

									
								</span>

								<div class="tiny-padding uk-padding-remove-top uk-padding-remove-horizontal uk-flex uk-flex-top tiny-margin-top" v-if="adjustment.reversal_reason">
									<span class="text-small-spaced uk-text-uppercase tiny-margin-top">Reason : </span>
									<p class="uk-margin-remove-bottom uk-width-expand uk-margin-small-left">
										{{ adjustment.reversal_reason }}
									</p>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</vue-final-modal>

		<vue-final-modal v-model="detailsModal" classes="uk-width-1-1 uk-flex uk-flex-center" content-classes="uk-margin-auto uk-margin-auto-vertical " :esc-to-close="false" :click-to-close="false" overlay-class="uk-overlay-primary" @before-open="noteModal = false" attach=".app">
			<div class="uk-width-1-1 uk-margin-top">
				<div class="uk-width-1-1 background bordered rounded raised-deep uk-animation-scale-up uk-animation-fast uk-width-large@s">
					<div class="uk-flex uk-flex-between uk-flex-middle tiny-padding border-bottom">
						<h5 class="uk-margin-remove uk-text-bold">
							Adjustment Details
						</h5>
						<a class="uk-button uk-button-small uk-button-danger uk-border-rounded" @click="detailsModal = false">
							Close
						</a>
					</div>

					<div class="uk-overflow-auto modal-content">
						<div class="uk-flex uk-flex-column border-bottom tiny-padding">
							<h5 class="uk-margin-remove">
								{{ adjustment.quantity | number('0,0') | pluralize('Unit') }} of {{ adjustment.model.product_variation.product.name }}
							</h5>

							<span class="text-small">
								Product Code : {{ adjustment.model.product_variation.product.code }} 
							</span>

							<span class="text-small">
								Variation : {{adjustment.model.product_variation.variation.name}} 
							</span>
						</div>
						<div class="tiny-padding uk-flex uk-flex-column">
							<div class="uk-flex uk-flex-column">
								<p class="uk-margin-remove">
									Recorded by {{adjustment.created_by.name}}
								</p>
								<span>
									{{$moment(adjustment.created_at).format('ddd MMM DD, YYYY')}} at {{$moment(adjustment.created_at).format('hh:mm A')}}

									&nbsp;&bull;&nbsp;
									
									<template v-if="adjustment.branch && adjustment.branch.name">
										At {{adjustment.branch.name | branchize}}
									</template>
									<template v-else>
										At Warehouse
									</template>

									
								</span>
								<span>
									Reason : {{ adjustment.tags[0].name | capitalize }}
								</span>
							</div>
							<div class="tiny-padding uk-padding-remove-horizontal uk-flex uk-flex-top tiny-margin-top" v-if="adjustment.note">
								<span class="text-small-spaced uk-text-uppercase tiny-margin-top">Note : </span>
								<p class="uk-margin-remove-bottom uk-width-expand uk-margin-small-left">
									{{ adjustment.note }}
								</p>
							</div>
						</div>

						<div class="tiny-padding border-top" v-if="adjustment.is_reversed">

							<div class="uk-flex uk-flex-column">
								<p class="uk-margin-remove">
									Reversed by {{adjustment.reversed_by.name}}
								</p>
								<span>
									{{$moment(adjustment.reversed_at).format('ddd MMM DD, YYYY')}} at {{$moment(adjustment.reversed_at).format('hh:mm A')}}

									&nbsp;&bull;&nbsp;
									
									<template v-if="adjustment.branch && adjustment.branch.name">
										At {{adjustment.branch.name | branchize}}
									</template>
									<template v-else>
										At Warehouse
									</template>

									
								</span>

								<div class="tiny-padding uk-padding-remove-top uk-padding-remove-horizontal uk-flex uk-flex-top tiny-margin-top" v-if="adjustment.reversal_reason">
									<span class="text-small-spaced uk-text-uppercase tiny-margin-top">Reason : </span>
									<p class="uk-margin-remove-bottom uk-width-expand uk-margin-small-left">
										{{ adjustment.reversal_reason }}
									</p>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</vue-final-modal>
	</div>
</template>
<script>
export default {
	props : {
		adjustment : {
			type : Object,
			required : true
		},

		focusedEntry : {
			required : true
		}
	},

	data(){
		return {
			noteModal : false,
			detailsModal : false,
			showOptions : false
		}
	}
}
</script>
