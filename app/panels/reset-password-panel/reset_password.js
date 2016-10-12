import './reset_password.css!'
import tmpl from './reset_password.html!text'
import Vue from 'vue'

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
        enable_button() {
            return this.form_filled && this.new_password == this.new_password_confirm
        },
        form_filled() {
            return this.new_password && this.new_password_confirm
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
                           .then(r => (console.log('success')))
                           .catch(e => (this.error=e.message))
            }
        },
        toggle_visibility() {
            this.visible = !this.visible
        },
    },
    events: {

    },
})
