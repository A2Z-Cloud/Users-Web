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

import 'app/filters/nullify'

import ResizeMixin from 'vue-resize-mixin'
import infinateScroll from 'vue-infinite-scroll'

import {control_url} from './consts'


// –– Control
System.import(control_url).then(({Control}) => {  // eslint-disable-line no-undef
    Vue.use(infinateScroll)

    router.start({
        store,
        mixins: [ResizeMixin],
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
                user: state => state.user,
                ws_ready: state => state.auth_url && state.ws_status === 'open',
            },
        },
        events: {
            resize: size => store.dispatch({
                type: 'WINDOWS_SIZE_SET',
                silent: false,
                payload: size,
            }),
        },
    }, '#App')
})
