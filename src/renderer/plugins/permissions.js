import {mapGetters} from 'vuex'
import Vue from 'vue'

const ABILITY = {
	install (Vue, options){
		Vue.mixin({
			computed : {
				...mapGetters({
					details : 'user',
					authenticated : 'authenticated'
				}),

				noPerms(){
					return this.authenticated && this.details.permissions.length > 1
				},
				
				isOwner(){
					return this.authenticated && this.details.role.name === 'Owner'
				}
			},
			methods : {
				can(permission){

					if (!this.authenticated) {
						return false
					}

					if (typeof(permission) === 'string') {
						return this.details.permissions.includes(permission)
					}

					return permission.every( item => this.details.permissions.includes(item))
				},

				any(permission){

					if (!this.authenticated) {
						return false
					}

					if (typeof(permission) === 'string') {
						return this.details.permissions.includes(permission)
					}

					return permission.some( item => this.details.permissions.includes(item))
				},

				isOwnerRole(role){
					return role.name && role.name.toLowerCase() === 'owner'
				}
			}
		})
	}
}

Vue.use(ABILITY)