<template>
	<div>
		<div class="click" @click.prevent="$uikit.drop($refs.options).show()">
			<slot name="action-button">
				<div class="square-30 center bordered rounded click">
					<span class="mdi mdi-dots-vertical"></span>
				</div>
			</slot>
		</div>

		<div uk-drop="mode : click; delay-hide : 0; delay-show : 0; pos: bottom-right; offset: 0" ref="options">
			<div class="background bordered rounded uk-width-medium stripped-bottom">
				<branch-actions-edit :branch="branch" v-if="can('update-branches')" @done="$emit('done')" @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()">
					<template #action-button>
						<div class="uk-flex click tiny-padding ">
							<div class="square-30 rounded bordered center uk-margin-small-right">
								<span class="mdi mdi-pencil"></span>
							</div>
							<div class="uk-flex uk-flex-column uk-width-expand">
								<span class="uk-text-truncate uk-text-bold">Update Branch Info</span>
								<span class="text-small uk-text-truncate">
									Update basic information for this branch
								</span>
							</div>
						</div>
					</template>
				</branch-actions-edit>

				<branch-actions-assign-manager :branch="branch" v-if="can('update-branches')" @done="$emit('done')" @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()">
					<template #action-button>
						<div class="uk-flex click tiny-padding ">
							<div class="square-30 rounded uk-background-primary uk-text-white center uk-margin-small-right">
								<span class="mdi mdi-account"></span>
							</div>
							<div class="uk-flex uk-flex-column uk-width-expand">
								<span class="uk-text-truncate uk-text-bold">Assign Manager</span>
								<span class="text-small uk-text-truncate">
									Assign a manager to {{branch.name | branchize }}
								</span>
							</div>
						</div>
					</template>
				</branch-actions-assign-manager>
				<branch-actions-toggle-active-status v-if="can('change-branch-active-status')" :branch="branch" @done="$emit('done')" @opening="$uikit.drop($refs.options).hide()" @closing="$uikit.drop($refs.options).show()">
					<template #action-button>
						<div class="uk-flex click tiny-padding ">
							<div class="square-30 rounded center uk-margin-small-right uk-text-white" :class="branch.active ? 'uk-background-danger' : 'uk-background-success'">
								<span class="mdi" :class="branch.active ? 'mdi-cancel' : 'mdi-check'"></span>
							</div>
							<div class="uk-flex uk-flex-column uk-width-expand">
								<span :class="branch.active ? 'uk-text-danger' : 'uk-text-success'" class="uk-text-truncate uk-text-bold">{{ branch.active ? "Close" : "Activate" }} Branch</span>
								<span class="text-small uk-text-truncate">
									{{ branch.active ? "Close" : "Activate" }} the {{branch.name | branchize }}
								</span>
							</div>
						</div>
					</template>
				</branch-actions-toggle-active-status>
			</div>
		</div>

	</div>
</div>	
</template>
<script>
import {bindProps} from "@/mixins/branches/singleton"
export default {
	mixins : [bindProps]
}
</script>
