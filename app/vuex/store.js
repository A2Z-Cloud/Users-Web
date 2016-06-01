import Vue from 'vue'
import Vuex from 'vuex'

import { merge } from 'app/utils/merge'
import { debug } from 'app/consts'

import { User } from 'app/model/user'

Vue.use(Vuex)


const state = {
    window_size: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    control: null,
    ws_status: null,
    error: null,
    user: null,
    services: [],
    users: [],
    groups: [],
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
    CURRENT_USER_SET(state, user) {
        state.user = user
    },
    USERS_SET(state, users) {
        state.users = users
    },
    USER_INSERT(state, user) {
        user = new User(user)
        state.users.push(user)
    },
    USER_UPDATE(state, user) {
        user = new User(user)
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
}


export default new Vuex.Store({
    state,
    mutations,
    strict: debug,
})
