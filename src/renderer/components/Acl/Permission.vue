<template>
	<div>
		<div class="background bordered uk-padding-small rounded uk-width-1-1 uk-flex uk-flex-column">
			<h4 class="uk-text-bold uk-margin-remove">
				{{permission[0].module}}
			</h4>
			<p class="tiny-margin-bottom tiny-margin-top">
				Available Permissions
			</p>

			<div class="uk-flex uk-flex-column">
				<div class="uk-margin-small-bottom" v-for="(privilege, index) in permission" :key="privilege.slug">
					<div class="uk-flex uk-flex-top">
						<div class="square-25 uk-border-circle bordered tiny-margin-right uk-flex uk-flex-column uk-flex-center uk-flex-middle">
							<small>
								{{index+1}}
							</small>
						</div>
						<div class="uk-width-1-1 uk-flex uk-flex-column uk-width-expand uk-flex-column-reverse">
							<div class="uk-flex uk-flex-middle">

								<span class="label uk-padding-remove uk-margin-auto-right uk-text-capitalize text-small">
									{{privilege.level === 'both' ? 'Branch & Corporate' : privilege.level }} Level
								</span>
							</div>
							<div class="uk-flex uk-flex-column uk-width-expand">

								<span class="uk-text-capitalize uk-text-bold">
									{{privilege.name}}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	props:{
		permission : {
			type : Array,
			required : true
		}
	}
};
</script>
