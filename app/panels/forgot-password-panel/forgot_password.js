import './forgot_password.css!'
import tmpl from './forgot_password.html!text'
import Vue from 'vue'

import { auth_client_url } from 'app/consts'

import { send_password_reset } from 'app/vuex/actions'

import { get_query_param } from 'app/utils/url_helpers'
import { valid_email } from 'app/utils/validation'


export default Vue.extend({
    template: tmpl,
    data: () => ({
        return_address: null,
        email: '',
        message: null,
        error: null,
    }),
    computed: {
        enable_button() {
            return valid_email(this.email)
        },
    },
    ready() {
        this.return_address = get_query_param('next')
    },
    vuex: {
        actions: {
            send_password_reset,
        },
    },
    methods: {
        request_reset() {
            if(valid_email(this.email)) {
                this.error = null
                const email = this.email
                return this.send_password_reset({email})
                           .then(r => {this.cooldown_redirect()})
                           .catch(e => (this.error=e.message))
            }
        },
        cooldown_redirect() {
            if(this.error == null) {
                // warn user of redirect
                this.message = "An email is on it's way. You will be redirected back to the login page shortly."

                setTimeout(() => {
                    // redirect to return address or use history to go back
                    if (this.return_address) {
                        window.location = this.return_address
                    } else {
                        window.location = auth_client_url
                    }
                }, 10000);
            }
        },
    },
    events: {

    },
})
