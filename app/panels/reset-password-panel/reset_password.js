import './reset_password.css!'
import tmpl from './reset_password.html!text'
import Vue from 'vue'

import { reset_password } from 'app/vuex/actions'


export default Vue.extend({
    template: tmpl,
    data: () => ({
        new_password: '',
        new_password_confirm: '',
    }),
    computed: {
    },
    ready() {

    },
    vuex: {
        actions: {
            reset_password,
        },
    },
    methods: {
        request_reset() {
            const token = this.$route.query.token
            const new_password = this.new_password
            return this.reset_password({token, new_password})
                       .then(() => (console.log('success')))
                       .catch(() => (console.log('error')))
        },
    },
    events: {

    },
})
