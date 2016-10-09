import './forgot_password.css!'
import tmpl from './forgot_password.html!text'
import Vue from 'vue'

import { send_password_reset } from 'app/vuex/actions'
import { valid_email } from 'app/utils/validation'


export default Vue.extend({
    template: tmpl,
    data: () => ({
        email: '',
        error: null,
    }),
    computed: {
        enable_button() {
            return valid_email(this.email)
        },
    },
    ready() {

    },
    vuex: {
        actions: {
            send_password_reset,
        },
    },
    methods: {
        request_reset() {
            if(valid_email(this.email)) {
                const email = this.email
                return this.send_password_reset({email})
                           .then(r => (console.log('success')))
                           .catch(e => (this.error=e.message))
            }
        },
    },
    events: {

    },
})
