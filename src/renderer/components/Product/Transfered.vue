<template>
	<div class="uk-width-1-1 uk-flex">
		<slot></slot>
		<div class="uk-width-expand">
			<h5 class="tiny-margin-bottom">{{item.product.name}}</h5>
			
			<div class="uk-flex">
				<div class="uk-width-expand uk-text-capitalize" uk-leader>
					<span>{{item.variation.name}}</span>
				</div>
				<div>
					<span class="text-small"> &nbsp; &nbsp;{{ item.quantity_transferred | pluralize('Unit') }} Transfered</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	props : {
		item : {
			type : Object,
			required : true
		}
	}
};
</script>
