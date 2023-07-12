<template>
	<div class="uk-width-1-1 background uk-padding-small uk-border-rounded bordered uk-height-1-1  uk-flex uk-flex-column uk-flex-between uk-inline">

		<span class="uk-position-top-right uk-margin-small-right label uk-margin-small-top" :class="role.active ? 'uk-background-primary' : 'uk-background-danger'">
			<span class="uk-text-white">
				{{ role.active ? "Active" : "Inactive" }}
			</span>
		</span>

		<div class="uk-flex uk-flex-column">
			<h5 class=" uk-margin-remove uk-text-truncate uk-text-bold">
				{{role.name}}
			</h5>

			<span class="text-small uk-text-capitalize">
				{{role.level}} level
			</span>
			
			<p class="uk-text-small uk-margin-remove-bottom" v-if="role.description">
				{{role.description}}
			</p>	
		</div>

		<template v-if="role.editable">
			<div class="uk-flex uk-flex-column">
				<div class="uk-width-1-1 uk-flex uk-flex-middle tiny-padding uk-padding-remove-horizontal border-top uk-margin-small-top">
					<div class="uk-width-expand uk-margin-small-right">
						{{role.users_count | pluralize("Member")}}
					</div>

					<!-- <div class="uk-width-auto uk-flex uk-flex-right">
						<div class="chip bordered uk-border-rounded">
							<span class="text-small">
								View Users
							</span>
						</div>
					</div> -->
				</div>

				<div class="uk-width-1-1 uk-flex uk-flex-middle tiny-padding uk-padding-remove-horizontal border-top border-bottom uk-margin-small-bottom">
					<div class="uk-width-expand uk-margin-small-right">
						{{role.permissions.length | pluralize("Permission")}}
					</div>

					<div class="uk-width-auto uk-flex uk-flex-right">
						<acl-role-manage :role="role"  @role-status-changed="$emit('needs-to-refresh')" @role-updated="$emit('needs-to-refresh')" state="MANAGE_ROLE_PERMISSIONS">
							<div class="chip bordered uk-border-rounded click uk-text-truncate" slot="action-button">
								<span class="text-small uk-text-truncate">
									Manage Permissions
								</span>
							</div>
						</acl-role-manage>

					</div>
				</div>
			</div>

			<acl-role-manage :role="role"  @role-status-changed="$emit('needs-to-refresh')" @role-updated="$emit('needs-to-refresh')">
				<button class="uk-button uk-button-primary uk-width-1-1 uk-border-rounded" slot="action-button" :disabled="!role.editable">
					Manage Role
				</button>
			</acl-role-manage>
		</template>
	</div>


</template>
<script>
export default{
	props:{
		role : {
			required : true,
			type : Object
		}
	}
};
</script>
