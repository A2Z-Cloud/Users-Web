// JS Imports
import Vue from 'vue'
import VueRouter from 'vue-router'

import {debug} from './consts'

// -- Route Panels
import UsersPanel from "./panels/users-panel/users"


Vue.use(VueRouter)
Vue.config.debug = debug

const router = new VueRouter({
    history: false,
})

router.map({
    '/users': {
        name: 'Users',
        component: UsersPanel,
    },
})

// For debugging against the web console
if (debug) {
    window.app = router
}

export default router
