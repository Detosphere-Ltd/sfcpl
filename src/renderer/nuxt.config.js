require('dotenv').config()
module.exports = {
	ssr: false,
	target: 'static',
	head: {
		title: 'Storefront - Control Panel',
		meta: [
			{ charset: "utf-8" }]
	},
	loading: false,
	components : true,


	publicRuntimeConfig:{
		DOMAIN : process.env.DOMAIN,
		ROOT : process.env.ROOT,
		GH : process.env.GH_TOKEN,
		VERSION: process.env.VERSION,
	},

	plugins: [
		{src : "@/plugins/datePicker", mode: 'client'},
		{ src: '@/plugins/persist', mode : 'client' },
		{src : "@/plugins/telephone", mode: 'client'},
		{src : "@/plugins/uikit", mode : 'client'},
		{src : "@/plugins/ant", mode: 'client'},
		{src : "@/plugins/charts", mode: 'client'},
		{src : '@/plugins/permissions'},
		{src : '@/plugins/validation'},
		{src : '@/plugins/filters'},
		{src : '@/plugins/axios'},
		{src : '@/plugins/modal'},
		{src : '@/plugins/store'},
		{src : '@/plugins/api'},
		{src : '@/plugins/app'},
		],


	buildModules: [
		"@nuxtjs/axios",
		"@nuxtjs/auth-next",
		'@nuxtjs/moment',
		['@nuxtjs/dotenv', {
			path : './',
			filename : '.env'
		}]
		],
	modules: [],
	axios : {
		baseURL : process.env.DOMAIN,
	},
	auth: {
		strategies: {
			local:{
				token: {
					property: 'meta.token',
					required: true,
					type: 'Bearer',
					maxAge: 60 * 60 *60 * 60 * 24 * 30,
					prefix : 'stf_odin.'
				},
				user: {
					property: 'data',
				},
				endpoints: {
					login:  { url: '/login', method: 'post' },
					logout: { url: '/logout', method: 'post' },
					user:   { url: '/profile?include=branch,role,avatar,created_by,permissions,logo', method: 'get' }
				}
			} 
		},
		redirect: {
			login: "/login",
			logout: '/login',
			home : '/home'
		},
		localStorage: false,

		plugins: ['./plugins/auth'],
	},

	css : [
		{src: "@/assets/app", lang : "scss"},
		"@mdi/font/css/materialdesignicons.min.css"
		],


	router: {
		middleware: ["clearErrors"]
	},


	build: {
		babel: {
			plugins: [
				['@babel/plugin-proposal-private-property-in-object', { loose: true }]
				],
		},
		transpile: ['vue-final-modal'],
		loaders: {
			less: { 
				lessOptions : {
					javascriptEnabled: true 
				}
			}
		},

	}
};  
