import {mapGetters} from 'vuex'
import Vue from 'vue'

const Emporium = {
	install (Vue, options){
		Vue.mixin({
			computed : {
				...mapGetters({
					userDetails : 'user',
					app : 'app/application',
					colorMode : 'theme/theme'
				}),

				emporium(){
					return this.userDetails.store
				},

				application(){
					return this.app
				},
			},

			methods : {
				colorize(value){
					if (value < 0) {
						return 'uk-text-danger'
					}

					if (value > 0) {
						return 'uk-text-success'
					}

					return ''
				}
			}
		})
	}
}

Vue.use(Emporium)