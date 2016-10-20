import Vue from 'vue'
import Vuex from 'vuex'

import { merge } from 'app/utils/merge'
import { debug } from 'app/consts'

Vue.use(Vuex)


const state = {
    window_size: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    control: null,
    ws_status: null,
    error: null,
    notifications: [],
    auth_client_url: null,
    user: null,
    services: [],
    users: [],
    groups: [],
    memberships: [],
    zoho_groups: [],
    zoho_contacts: [],
}


const mutations = {
    WINDOWS_SIZE_SET(state, size) {
        state.window_size = size
    },
    WS_STATUS_SET(state, status) {
        state.ws_status = status
    },
    ERROR_SET(state, error) {
        state.error = error
    },
    NOTIFICATION_INSERT(state, notification) {
        const max_length = 5
        const length     = state.notifications.unshift(notification)
        if (length > max_length) state.notifications.pop()
    },
    NOTIFICATION_DELETE(state, notification) {
        const index = state.notifications.indexOf(notification)
        if (index === -1) return
        state.notifications.splice(index, 1)
    },
    AUTH_CLIENT_URL_SET(state, url) {
        state.auth_client_url = url
    },
    CURRENT_USER_SET(state, user) {
        state.user = user
    },
    USERS_SET(state, users) {
        state.users = users
    },
    USER_INSERT(state, user) {
        state.users.push(user)
    },
    USER_UPDATE(state, user) {
        if (state.user && user.id === state.user.id) state.user = merge(state.user, user)
        const index    = state.users.findIndex(u => u.id === user.id)
        const new_user = merge(state.users[index], user)
        if (index !== -1) state.users.$set(index, new_user)
        else state.users.push(user)
    },
    USER_DELETE(state, user_id) {
        if (state.user && user_id === state.user.id) state.user = null
        const index = state.users.findIndex(u => u.id === user_id)
        if (index !== -1) state.users.splice(index, 1)
    },
    SERVICES_SET(state, services) {
        state.services = services
    },
    SERVICE_INSERT(state, service) {
        state.services.push(service)
    },
    SERVICE_UPDATE(state, service) {
        const index       = state.services.findIndex(s => s.id === service.id)
        const new_service = merge(state.services[index], service)
        if (index !== -1) state.services.$set(index, new_service)
        else state.services.push(service)
    },
    SERVICE_DELETE(state, service_id) {
        const index = state.services.findIndex(s => s.id === service_id)
        if (index !== -1) state.services.splice(index, 1)
    },
    GROUPS_SET(state, groups) {
        state.groups = groups
    },
    GROUP_INSERT(state, group) {
        state.groups.push(group)
    },
    GROUP_UPDATE(state, group) {
        const index     = state.groups.findIndex(g => g.id === group.id)
        const new_group = merge(state.groups[index], group)
        if (index !== -1) state.groups.$set(index, new_group)
        else state.groups.push(new_group)
    },
    GROUP_DELETE(state, group_id) {
        const index = state.groups.findIndex(g => g.id === group_id)
        if (index !== -1) state.groups.splice(index, 1)
    },
    MEMBERSHIP_INSERT(state, membership) {
        state.memberships.push(membership)
    },
    MEMBERSHIP_UPDATE(state, membership) {
        const index = state.memberships.findIndex(r => r.id === membership.id)
        const new_membership = merge(state.memberships[index], membership)
        if (index !== -1) state.memberships.$set(index, new_membership)
        else state.memberships.push(new_membership)
    },
    MEMBERSHIP_DELETE(state, id) {
        const index = state.memberships.findIndex(m => m.id === id)
        if (index !== -1) state.memberships.splice(index, 1)
    },
    ZOHO_GROUP_UPDATE(state, group) {
        const index     = state.zoho_groups.findIndex(g => g.id === group.id)
        const new_group = merge(state.zoho_groups[index], group)
        if (index !== -1) state.zoho_groups.$set(index, new_group)
        else state.zoho_groups.push(new_group)
    },
    ZOHO_CONTACTS_UPDATE(state, contact) {
        const index       = state.zoho_contacts.findIndex(c => c.id === contact.id)
        const new_contact = merge(state.zoho_contacts[index], contact)
        if (index !== -1) state.zoho_contacts.$set(index, new_contact)
        else state.zoho_contacts.push(new_contact)
    },
}


export default new Vuex.Store({
    state,
    mutations,
    strict: debug,
})
