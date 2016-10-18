import './reset_password.css!'
import tmpl from './reset_password.html!text'
import Vue from 'vue'

import { auth_client_url } from 'app/consts'

import { reset_password } from 'app/vuex/actions'

import { password_errors } from 'app/utils/validation'

import tooltip_input from 'app/components/tooltip-input/tooltip_input'


export default Vue.extend({
    template: tmpl,
    components: {
        'tooltip-input': tooltip_input,
    },
    data: () => ({
        new_password: '',
        new_password_confirm: '',
        visible: false,
        lock_form: false,
        message: null,
        error: null,
    }),
    computed: {
        new_password_errors() {
            return password_errors(this.new_password)
        },
        invalid_password_confirmation() {
            return this.form_filled
                && this.new_password_confirm !== this.new_password
        },
        enable_button() {
            return this.form_filled
                && !this.new_password_errors.length
                && !this.invalid_password_confirmation
                && !this.lock_form
        },
        form_filled() {
            return this.new_password
                && this.new_password_confirm
        },
        field_type() {
            return this.visible ? 'text' : 'password'
        },
        display_password_errors() {
            let message = ""
            let i, item, items = this.new_password_errors.length

            // put errors on new lines
            for(i=0; i<items; i++) {
                message += "<div>" + this.new_password_errors[i] + "</div>"
            }

            return message == "" ? null : message
        },
    },
    vuex: {
        actions: {
            reset_password,
        },
    },
    methods: {
        send_reset() {
            if(this.enable_button) {
                this.error = null
                const token = this.$route.query.token
                const new_password = this.new_password
                return this.reset_password({token, new_password})
                           .then(this.cooldown_redirect)
                           .catch(this.parse_error)
            }
        },
        parse_error(response) {
            const payload = response.original_payload

            // check the response from the server
            if(payload.message == "Invalid reset token") {
                // if the token is bad then we must lock the form to stop it being submitted again
                this.error = "The token for this reset is invalid. You may have recieved and expired link in your email or perhaps followed the link in an old one. Please try again from the login screen."
                this.lock_form = true
            }
            else {
                this.error=payload.message
            }

            // get the main input element, clear and set focus
            this.new_password = null
            this.new_password_confirm = null
            this.$els.mainInput.getElementsByTagName("input")[0].focus()
        },
        sign_in_redirect() {
            // redirect back to users at root url
            const root_url = window.location.protocol + '//' + window.location.host
            return auth_client_url + '?next=' + encodeURIComponent(root_url)
        },
        cooldown_redirect() {
            if(this.error == null) {
                // warn user of redirect
                this.message = "Your password has been reset. You will be redirected back to the login page shortly."
                this.lock_form = true

                // get redirect url
                const location = this.sign_in_redirect()

                // redirect to auth url after 10 seconds
                setTimeout(() => { window.location = location }, 10000);
            }
        },
    },
})
