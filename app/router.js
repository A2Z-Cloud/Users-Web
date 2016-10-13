// JS Imports
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'app/vuex/store'

import { debug, hash_routing } from './consts'

// -- Route Panels
import UserDetailPanel from "./panels/user-detail-panel/user_detail"
import ServciesPanel from "./panels/services-panel/services"
import UsersPanel from "./panels/users-panel/users"
import GroupsPanel from "./panels/groups-panel/groups"
import GroupDetailPanel from "./panels/group-detail-panel/group_detail"
import EmailConfirmation from "./panels/email-confirmation-panel/email_confirmation"
import InvitePanel from './panels/invite-panel/invite'
import ForgotPasswordPanel from './panels/forgot-password-panel/forgot_password'
import ResetPasswordPanel from './panels/reset-password-panel/reset_password'

import { authenticate } from 'app/vuex/actions'


Vue.use(VueRouter)
Vue.config.debug = debug

const router = new VueRouter({
    history: !hash_routing,
    hashbang: hash_routing,
})

router.map({
    '/': {
        name: 'me',
        component: UserDetailPanel,
        authenticated: true,
    },
    '/services': {
        name: 'services',
        component: ServciesPanel,
        authenticated: true,
    },
    '/users': {
        name: 'users',
        component: UsersPanel,
        authenticated: true,
    },
    '/users/:id': {
        name: 'user',
        component: UserDetailPanel,
        authenticated: true,
    },
    '/groups': {
        name: 'groups',
        component: GroupsPanel,
        authenticated: true,
    },
    '/groups/:name': {
        name: 'group',
        component: GroupDetailPanel,
        authenticated: true,
    },
    '/invite': {
        name: 'invite',
        component: InvitePanel,
        authenticated: false,
    },
    '/confirm-email': {
        name: 'confirm email',
        component: EmailConfirmation,
        authenticated: false,
    },
    '/forgot-password': {
        name: 'forgot password',
        component: ForgotPasswordPanel,
        authenticated: false,
    },
    '/reset-password': {
        name: 'reset password',
        component: ResetPasswordPanel,
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
