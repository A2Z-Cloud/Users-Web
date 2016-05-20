// JS Imports
import Vue from 'vue'
import VueRouter from 'vue-router'

import {debug} from './consts'

// -- Route Panels
import AccountPanel from "./panels/account-panel/account"
import ServciesPanel from "./panels/services-panel/services"
import UsersPanel from "./panels/users-panel/users"
import GroupsPanel from "./panels/groups-panel/groups"


Vue.use(VueRouter)
Vue.config.debug = debug

const router = new VueRouter({
    history: false,
})

router.map({
    '/': {
        name: 'Account',
        component: AccountPanel,
    },
    '/services': {
        name: 'Services',
        component: ServciesPanel,
    },
    '/users': {
        name: 'Users',
        component: UsersPanel,
    },
    '/groups': {
        name: 'Groups',
        component: GroupsPanel,
    },
})

// For debugging against the web console
if (debug) {
    window.app = router
}

export default router
