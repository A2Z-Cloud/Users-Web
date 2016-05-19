// CSS Imports
// –– Root Styles
import './main.css!'

// JS Imports
// –– Vue
import Vue from 'vue'
import router from './router'

import {control_url} from './consts'


// –– Control
System.import(control_url).then(({Control}) => {  // eslint-disable-line no-undef
    Control.prototype.install = function(Vue) {
        Vue.prototype.control = this
    }

    Vue.use(new Control())

    router.start({
        data: () => ({
            status: null,
            error: null,
        }),
        ready() {
            // catch websocket broadcasts
            this.control.init((signal, message) => {
                this.$dispatch(signal, message)
                this.$broadcast(signal, message)
            })
            .then(status => {
                // set socket status
                this.status = status
            })
            .catch(() => {
                // TODO: error page for dead websocket
                this.error = "Cannot connect to server."
            })
        },
    }, '#Main')
})
