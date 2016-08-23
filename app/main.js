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
import 'app/filters/strip_underscores'

import link_copier from 'app/components/link-copier/link_copier'

import ResizeMixin from 'vue-resize-mixin'
import infinateScroll from 'vue-infinite-scroll'

import {control_url} from './consts'

import {delete_notification} from 'app/vuex/actions'


// –– Control
System.import(control_url).then(({Control}) => {  // eslint-disable-line no-undef
    Vue.use(infinateScroll)
    Vue.component('link-copier', link_copier)

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
        computed: {
            sign_out_url() {
                // Take the user to the A2Z Auth with a redirect to the
                // auth sign in page after they sign out.
                // Additionally after they sign in again have the next
                // parameter be set back to this url
                const delimiter   = this.$router.mode === 'hash' ? '/#!' : ''
                const current_url = window.location.protocol + '//' + window.location.host + delimiter + this.$route.path
                const sign_in_url = this.auth_client_url
                const sign_in_url_return = sign_in_url + '?next=' + encodeURIComponent(current_url)

                return this.auth_client_url + '/sign-out?next=' + encodeURIComponent(sign_in_url_return)
            },
            content_height() {
                return this.window_size.height - this.$els.navigation.offsetHeight
            },
            content_style() {
                return {
                    height: this.content_height + 'px',
                }
            },
        },
        vuex: {
            getters:  {
                user: state => state.user,
                ws_ready: state => state.auth_client_url && state.ws_status === 'open',
                auth_client_url: state => state.auth_client_url,
                window_size: state => state.window_size,
                notifications: state => state.notifications,
            },
            actions: {
                delete_notification,
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
