<template>
	<div class="tiny-padding uk-border-rounded uk-width-1-1 uk-margin-large-bottom">
		<div class="grid-padding uk-width-1-1">
			<h3 class="uk-text-bold">
				{{$appName}} Permissions
			</h3>
			<p class="uk-margin-small-top">
				The list of all available permsissions on this software and the levels applicable.
			</p>
		</div>

		<div v-if="$fetchState.pending" class="uk-width-1-1 uk-flex uk-flex-column  uk-border-rounded uk-margin-small-top grid-padding uk-padding-remove-vertical">
			<div class="uk-width-1-1 uk-padding-small uk-flex uk-flex-center bordered background uk-border-rounded uk-margin-small-top">
				<loaders-spinner></loaders-spinner>
			</div>
		</div>


		<div v-else>
			<div v-if="failed"  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-background-white uk-width-large@s  uk-border-rounded uk-margin-auto uk-margin-large-top">
				<acl-parse-error :errorData="errData">
				</acl-parse-error>
			</div>

			<div v-else>

				<div  class="uk-width-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-width-1-1  uk-border-rounded">



					<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-4@l uk-grid-collapse uk-grid-match role-filters" uk-grid="masonry: true">
						<div class="grid-padding" v-for="(permission, key) in permissions" :key="key">
							<acl-permission :permission="permission"></acl-permission>
						</div>
					</div>

				</div>

			</div>
		</div>
	</div>
	
</template>
<script>
import {mapGetters} from "vuex"
export default{
	fetchOnServer : false,
	data(){
		return {
			failed : false,
			errData : undefined,
			searchTerm : ''
		}
	},
	async fetch(){
		await this.$store.dispatch('access/getPermissions')
		.catch((err)=>{
			this.failed = true
			this.errData = err
		})
	},

	computed : {
		...mapGetters({
			permissions : 'access/permissions'
		})
	}
};
</script>