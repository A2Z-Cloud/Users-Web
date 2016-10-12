import './reset_password.css!'
import tmpl from './reset_password.html!text'
import Vue from 'vue'

import { password_errors } from 'app/utils/validation'

import { reset_password } from 'app/vuex/actions'


export default Vue.extend({
    template: tmpl,
    data: () => ({
        new_password: '',
        new_password_confirm: '',
        visible: false,
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
        },
        form_filled() {
            return this.new_password
                && this.new_password_confirm
        },
        field_type() {
            return this.visible ? 'text' : 'password'
        },
    },
    ready() {

    },
    vuex: {
        actions: {
            reset_password,
        },
    },
    methods: {
        reset_password() {
            if(this.enable_button) {
                const token = this.$route.query.token
                const new_password = this.new_password
                return this.reset_password({token, new_password})
                           .then(console.log)
                           .catch(e => (this.error=e.message))
            }
        },
    },
    events: {

    },
})
