import './invite.css!'
import tmpl from './invite.html!text'
import Vue from 'vue'

import { accept_invite } from 'app/vuex/actions'

import { password_errors, valid_email } from 'app/utils/validation'

import tooltip_input from 'app/components/tooltip-input/tooltip_input'


export default Vue.extend({
    template: tmpl,
    components: {
        'tooltip-input': tooltip_input,
    },
    data: () => ({
        error: {},
        creating_account: false,
        password_visible: false,
        payload: {
            token: '',
            email: '',
            password: '',
            password_confirmation: '',
        },
    }),
    computed: {
        is_valid_email() {
            return valid_email(this.payload.email)
        },
        new_password_errors() {
            return password_errors(this.payload.password)
        },
        invalid_password_confirmation() {
            return this.payload.password
                && this.payload.password_confirmation
                && this.payload.password_confirmation !== this.payload.password
        },
        enable_create_account_button() {
            return this.payload.email
                && this.payload.password
                && this.payload.password_confirmation
                && this.is_valid_email
                && !this.new_password_errors.length
                && !this.invalid_password_confirmation
                && !this.creating_account
        },
        email_warning() {
            if( !this.payload.email  ) return "Email is required."
            if( !this.is_valid_email ) return "Invalid email. Try something like bill@billson.net instead."
        },
    },
    ready() {
        this.payload.token = this.$route.query.token
        this.payload.email = this.$route.query.email
    },
    vuex: {
        actions: {
            accept_invite,
        },
    },
    methods: {
        create_account() {
            this.creating_account = true
            this.accept_invite(this.payload)
                .then(() => {
                    this.creating_account  = false
                    this.$router.go('/')
                })
                .catch(error => {
                    this.creating_account = false
                    console.log(error.message)
                })
        },
    },
    events: {

    },
})
