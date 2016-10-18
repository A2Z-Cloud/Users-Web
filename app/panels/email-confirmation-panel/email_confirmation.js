import './email_confirmation.css!'
import tmpl from './email_confirmation.html!text'
import Vue from 'vue'

import { confirm_email } from 'app/vuex/actions'


export default Vue.extend({
    template: tmpl,
    props: [
        'user',
    ],
    data: () => ({
        error: null,
        success: false,
    }),
    computed: {
    },
    ready() {
        const token = this.$route.query.token
        this.confirm_email({token})
            .then(() => (this.success = true))
            .catch(error => (this.error = error))
    },
    vuex: {
        actions: {
            confirm_email,
        },
    },
    methods: {

    },
    events: {

    },
})
