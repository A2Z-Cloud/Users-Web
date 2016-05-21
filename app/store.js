import Vue from 'vue'
import Vuex from 'vuex'

import { debug } from './consts'

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
}


export default new Vuex.Store({
    state,
    mutations,
    strict: debug,
})
