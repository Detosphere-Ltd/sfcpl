<template>
	<div>
		<partials-logo class="uk-margin-medium-bottom"></partials-logo>
		<div class="uk-flex uk-margin-small-bottom">
			<span class="chip bordered uk-border-rounded text-small">{{$variant}}</span>
		</div>
		<h2>
			{{$provider}} {{$appName}}
		</h2>
		<p class="uk-width-large">
			Smart & simple and operations software for modern retail shops.
		</p>
		<span>
			All Rights Reserved {{$provider}} &bull; &copy; 2022  {{ $moment().format('YYYY') === '2022' ? '' : ` - ${$moment().format('YYYY')}` }}
		</span>
	</div>
</template>