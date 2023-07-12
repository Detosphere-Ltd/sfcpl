<template>
	<header class="uk-width-expand border-bottom">
		<div class="uk-width-1-1 grid-padding uk-flex uk-flex-between uk-flex-middle top-top uk-width-1-1">
			<partials-back-forth></partials-back-forth>
			<div class="uk-flex uk-flex-middle uk-table-expand uk-flex-right uk-margin-right">
				<acl-transfer-ownership v-if="isOwner" class="uk-margin-right"></acl-transfer-ownership>
				<user-dropdown class="uk-margin-medium-right"></user-dropdown>
				<partials-themer></partials-themer>
			</div>
		</div>
	</header>
</template>
<script>
export default{

};
</script>
