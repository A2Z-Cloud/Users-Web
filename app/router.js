// JS Imports
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'app/vuex/store'

import {debug} from './consts'

// -- Route Panels
import AccountPanel from "./panels/account-panel/account"
import ServciesPanel from "./panels/services-panel/services"
import UsersPanel from "./panels/users-panel/users"
import GroupsPanel from "./panels/groups-panel/groups"
import InvitePanel from './panels/invite-panel/invite'
import EmailConfirmation from "./panels/email-confirmation-panel/email_confirmation"

import { authenticate } from 'app/vuex/actions'


Vue.use(VueRouter)
Vue.config.debug = debug

const router = new VueRouter({
    history: false,
})

router.map({
    '/': {
        name: 'Account',
        component: AccountPanel,
        authenticated: true,
    },
    '/services': {
        name: 'Services',
        component: ServciesPanel,
        authenticated: true,
    },
    '/users': {
        name: 'Users',
        component: UsersPanel,
        authenticated: true,
    },
    '/groups': {
        name: 'Groups',
        component: GroupsPanel,
        authenticated: true,
    },
    '/invite': {
        name: 'Invite',
        component: InvitePanel,
        authenticated: false,
    },
    '/confirm-email': {
        name: 'Confirm Email',
        component: EmailConfirmation,
        authenticated: false,
    },
})


router.beforeEach(function({to, next}) {
    if (to.authenticated && store.state.user === null) {
        const go_auth = auth_url => (window.location = auth_url)
        authenticate(store).then(next).catch(go_auth)
    } else {
        next()
    }
})


// For debugging against the web console
if (debug) {
    window.app = router
}

export default router
