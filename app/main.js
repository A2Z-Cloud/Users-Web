// CSS Imports
// –– Root Styles
import 'skeleton-css/css/normalize.css!'
import 'skeleton-css/css/skeleton.css!'
import './main.css!'

// JS Imports
// –– Vue
import Vue from 'vue'
import router from './router'
import store from 'app/vuex/store'

import {control_url} from './consts'


// –– Control
System.import(control_url).then(({Control}) => {  // eslint-disable-line no-undef
    router.start({
        store,
        ready() {
            // catch websocket broadcasts
            store.control = new Control()
            store.control
                 .init((signal, message) => store.dispatch(signal, message))
                 .then(status => store.dispatch('WS_STATUS_SET', status))
                 .catch(() => store.dispatch('ERROR_SET', {
                     message: "Cannot connect to server.",
                 }))
        },
        vuex: {
            getters:  {
                user: store => store.user,
                ws_ready: store => store.auth_url && store.ws_status === 'open',
            },
        },
    }, '#App')
})
