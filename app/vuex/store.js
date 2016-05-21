import Vue from 'vue'
import Vuex from 'vuex'

import { debug } from 'app/consts'

Vue.use(Vuex)


const state = {
    ws_status: null,
    error: null,
    user: null,
    services: [],
    users: [],
    groups: [],
}


const mutations = {
    SET_WS_STATUS(state, status) {
        state.ws_status = status
    },
    SET_ERROR(state, error) {
        state.error = error
    },
    SET_CURRENT_USER(state, {user, auth_url}) {
        if (user === null) window.location = auth_url
        state.user = user
    },
    SET_USERS(state, users) {
        state.users = users
    },
    INSERT_USER(state, user) {
        state.users.push(user)
    },
    UPDATE_USER(state, user) {
        if (user.id === state.user.id) state.user = user
        const index = state.users.findIndex(u => u.id === user.id)
        if (index !== -1) state.users.$set(index, user)
    },
    DELETE_USER(state, user_id) {
        if (user_id === state.user.id) state.user = null
        const index = state.users.findIndex(u => u.id === user_id)
        if (index !== -1) state.users.splice(index, 1)
    },
    SET_SERVICES(state, services) {
        state.services = services
    },
    INSERT_SERVICE(state, service) {
        state.services.push(service)
    },
    UPDATE_SERVICE(state, service) {
        const index = state.services.findIndex(s => s.id === service.id)
        if (index !== -1) state.services.$set(index, service)
    },
    DELETE_SERVICE(state, service_id) {
        const index = state.services.findIndex(s => s.id === service_id)
        if (index !== -1) state.services.splice(index, 1)
    },
    SET_GROUPS(state, groups) {
        state.groups = groups
    },
    INSERT_GROUP(state, group) {
        state.groups.push(group)
    },
    UPDATE_GROUP(state, group) {
        const index = state.groups.findIndex(g => g.id === group.id)
        if (index !== -1) state.groups.$set(index, group)
    },
    DELETE_GROUP(state, group_id) {
        const index = state.groups.findIndex(g => g.id === group_id)
        if (index !== -1) state.groups.splice(index, 1)
    },
}


export default new Vuex.Store({
    state,
    mutations,
    strict: debug,
})
