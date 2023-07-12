<template>
	<div class="uk-width-1-1 uk-inline">
		<div class="uk-flex uk-flex-middle tiny-padding">

			<div class="uk-width-max-large grid-gutter uk-flex uk-flex-column uk-margin-small-right">
				<span class="uk-text-truncate">
					{{branch.name | branchize}}
				</span>
			</div>
			<div class="uk-width-small grid-gutter uk-flex uk-flex-column uk-margin-small-right">
				<span class="uk-text-truncate">
					{{ branch.city ? branch.city : 'No Location Set' }} 
				</span>
			</div>

			<div class="uk-width-small grid-gutter uk-flex uk-flex-column uk-margin-small-right">
				<div class="uk-flex uk-flex-middle" v-if="branch.manager && branch.manager.name">
					<partials-avatar :size="20" :media="branch.manager.avatar" class="tiny-margin-right"></partials-avatar>

					<span class="uk-text-truncate uk-width-expand" :title="branch.manager.name">
						{{ branch.manager.name }}
					</span>
				</div>
				<span title="Unassigned Staff" class="uk-text-truncate" v-else>
					Unassigned
				</span>
			</div>

			<div class="uk-width-small grid-gutter uk-flex uk-flex-column uk-margin-small-right">
				<span class="uk-text-truncate">
					{{branch.total_users | pluralize(['Staff Member', 'Staff Members'])}}
				</span>
			</div>

			<div class="uk-width-small grid-gutter uk-flex uk-flex-column uk-visible@xl uk-margin-small-right">
				<span class="uk-text-truncate">
					{{$moment(branch.created_at).format("DD MMMM, YYYY")}}
				</span>
			</div>
			<div class="uk-width-small grid-gutter uk-flex uk-margin-small-right">
				<span class="label uk-margin-auto-right" :class="branch.active ? 'label-success' : 'label-danger'">
					<small>
						{{ branch.active ? "Active Branch" : "Closed Branch" }}
					</small>
				</span>
			</div>

			<div class="uk-width-small grid-gutter uk-flex">
				<nuxt-link class="uk-button uk-button-small uk-button-primary" :to="{name: 'branches-branch', params: {branch: branch.uuid}}">
					Visit Branch
				</nuxt-link>
			</div>


			<div class="uk-width-auto">
				<branch-options :branch="branch" @done="$emit('done')">
					<div class="square-30 bordered uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle click" slot="action-button">
						<span class="mdi mdi-dots-horizontal lni-large"></span>
					</div>
				</branch-options>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	props: {
		branch : {
			required : true,
			type : Object
		}
	}
};
</script>
