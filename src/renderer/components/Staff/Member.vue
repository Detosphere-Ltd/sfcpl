<template>
	<div class="uk-flex uk-flex-middle uk-width-1-1 grid-padding">

		<div class="uk-margin-small-right" style="min-width: 30px">
			<partials-avatar :size="25" :media="staff.avatar"></partials-avatar>
		</div>
		<div class="uk-width-medium grid-gutter uk-flex uk-flex-column">
			{{ staff.name }}
		</div>

		<div class="uk-width-small grid-gutter uk-flex uk-flex-column">
			{{staff.is_branch_user ? 'Branch' : 'Corporate'}}
		</div>




		

		<div class="uk-width-small grid-gutter uk-flex uk-flex-column">
			<span class="uk-text-truncate" v-if="staff.is_branch_user" :title="staff.branch.name">
				{{ staff.branch.name }}
			</span>
			<span title="Corporate Staff" class="uk-text-truncate" v-else>
				Control Panel
			</span>
		</div>


		<div class="uk-width-small  grid-gutter uk-flex uk-flex-column">
			<span class="uk-text-truncate" v-if="staff.role && staff.role.name" :title="staff.role.name">
				{{ staff.role.name }}
			</span>
			<span title="Unassigned Staff" class="uk-text-truncate" v-else>
				- - -
			</span>
		</div>




		<div class="uk-width-small grid-gutter uk-flex uk-flex-column">
			<span class="uk-text-truncate">
				{{staff.email ? staff.email : '---'}}
			</span>
		</div>
		<div class="uk-width-small grid-gutter uk-flex uk-flex-column">
			<span class="uk-text-truncate">
				{{staff.phone ? staff.phone : '---'}}
			</span>
		</div>
		
		<div class="uk-width-small grid-gutter">
			<span>{{ staff.gender ?  staff.gender : '---' | capitalize}}</span>
		</div>

		<div class="uk-width-small grid-gutter uk-flex">
			<span class="label uk-margin-auto-right tiny-margin-bottom" :class="staff.active ? 'label-success' : 'label-danger'">
				<small>
					{{ staff.active ? "Active" : "Deactivated" }}
				</small>
			</span>
		</div>

		<div class="uk-width-x-small">
			<staff-actions-manage :staff="staff" @needs-to-refresh="handleSuccess">
				<div class="square-30 bordered uk-border-rounded uk-flex uk-flex-column uk-flex-center uk-flex-middle click" slot="action-button">
					<span class="mdi mdi-dots-horizontal lni-large"></span>
				</div>
			</staff-actions-manage>
		</div>
	</div>
</template>
<script>
export default{
	props:{
		staff : {
			type : Object,
			required : true
		}
	},

	methods : {
		async handleSuccess(){
			await this.$emit('needs-to-refresh')
		},
	},

};
</script>
