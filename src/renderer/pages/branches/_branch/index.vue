<template>
	<div class="uk-width-1-1">
		<div class="uk-width-5-6@xl tiny-padding">

			<div class="uk-width-large grid-gutter">
				<branch-manager :manager="branch.manager" class="bordered uk-border-rounded"></branch-manager>
			</div>

			<div class="uk-width-1-1 uk-flex uk-flex-wrap uk-grid-collapse" uk-grid="masonry: true"> 

				<div class="grid-gutter uk-width-1-2@m uk-flex uk-flex-wrap">
					<div class="uk-width-1-1 uk-margin-small-bottom">
						<stats-branch-general :branch="branch" class="bordered"></stats-branch-general>
					</div>

					<div class="uk-width-1-1">
						<stats-branch-last-thirty :branch="branch" class="bordered"></stats-branch-last-thirty>
					</div>
				</div>

				<div class="grid-gutter uk-width-1-2@m" v-if="can('view-sales-statistics')">
					<stats-branch-top-products :branch="branch" class="bordered uk-width-1-1">
					</stats-branch-top-products>
				</div>
			</div>

		</div>
	</div>
</template>
<script>
import {bindProps} from "@/mixins/branches/singleton"
export default{
	mixins : [bindProps],
};
</script>
