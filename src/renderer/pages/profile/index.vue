<template>
	<div class="uk-padding-small uk-padding-remove-top uk-border-rounded uk-width-1-1 table uk-margin-auto uk-margin-medium-top">
		<div class="uk-container uk-container-xlarge">
			<div class="uk-flex uk-flex-column">
				<div class="uk-width-2xlarge@m uk-margin-auto uk-flex uk-flex-column">
					
					<div class="uk-width-1-1 background bordered uk-padding-small uk-width-1-1 rounded  uk-margin-small-bottom uk-flex uk-flex-top">
						<div class="square-80 uk-border-circle uk-cover-container uk-margin-bottom uk-margin-right" v-if="$auth.user.avatar && $auth.user.avatar.large">
							<img :src="$auth.user.avatar.large" alt="User avatar">
						</div>

						<div class="uk-width-expand uk-flex uk-flex-column tiny-padding uk-padding-remove-horizontal">
							<h4 class="uk-margin-remove uk-text-bold">
								{{$auth.user.name}}
							</h4>
							<span class="uk-text-meta">
								{{$auth.user.email}}
							</span>

							<span v-if="$auth.user.role && $auth.user.role.name !== undefined" class="uk-text-capitalize">
								{{$auth.user.role.name}}
							</span>

							<div class="uk-margin-small-top">
								<nuxt-link :to="{name : 'logout'}" class="uk-button uk-button-danger uk-button-small uk-border-rounded">
									Logout
								</nuxt-link>
							</div>
						</div>
					</div>
				</div>

				<div class="background bordered  uk-width-1-1 uk-width-2xlarge@m uk-border-rounded uk-margin-auto uk-flex uk-child-width-1-2 uk-margin-small-bottom">
					
					<div class="tab uk-flex uk-flex-center click" :class="scope === 'profile' ? 'tabActive' : ''" @click="scope = 'profile'">
						<span>
							My Profile
						</span>
					</div>

					<div class="tab uk-flex uk-flex-center click" :class="scope === 'perms' ? 'tabActive' : ''" @click="scope = 'perms'">
						<span>
							My Permissions
						</span>
					</div>
				</div>



				<div class="background bordered uk-padding uk-width-1-1 uk-width-2xlarge@m rounded uk-margin-auto" v-if="scope === 'profile'">
					<h4 class="uk-margin-remove">
						Change Password
					</h4>

					<hr class="hr-black uk-margin-small-bottom uk-margin-small-top">

					<user-change-password></user-change-password>
				</div>


				<div class="background bordered uk-padding uk-width-1-1 uk-width-2xlarge@m rounded uk-margin-auto" v-else>
					<h4 class="uk-margin-remove">
						Allowed Permissions
					</h4>
					<p class="uk-margin-remove-bottom">
						Here are all the permisions associated with your {{$auth.user.store.name}} account on {{$appName}}.
					</p>

					<hr class="hr-black uk-margin-small-bottom uk-margin-small-top">

					<div class="uk-width-1-1 uk-flex uk-flex-wrap">
						<span class="chip uk-flex-middle uk-border-rounded tiny-margin-right tiny-margin-bottom uk-text-capitalize bordered" v-for="tag in $auth.user.permissions" :key="tag">
							<span class="mdi mdi-check-circle tiny-margin-right"></span>
							<span>
								Can {{tag.split('-').join(' ')}}
							</span>
						</span>
					</div>
				</div>


				
			</div>
		</div>
	</div>
</template>
<script>
export default{
	data(){
		return {
			scope : 'profile'
		}
	}
};
</script>
