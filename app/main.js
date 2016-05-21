// CSS Imports
// –– Root Styles
import './main.css!'

// JS Imports
// –– Vue
import Vue from 'vue'
import router from './router'
import store from 'app/vuex/store'

import {control_url} from './consts'


// –– Control
System.import(control_url).then(({Control}) => {  // eslint-disable-line no-undef
    Control.prototype.install = function(Vue) {
        Vue.prototype.$control = this
    }

    Vue.use(new Control())

    router.start({
        store,
        ready() {
            // catch websocket broadcasts
            this.$control
                .init((signal, message) => store.dispatch(signal, message))
                .then(status => store.dispatch('SET_WS_STATUS', status))
                .catch(() => store.dispatch('SET_ERROR', {
                    message: "Cannot connect to server.",
                }))
        },
        vuex: {
            getters: {
                user: store => store.user,
            },
        },
    }, '#App')
})
