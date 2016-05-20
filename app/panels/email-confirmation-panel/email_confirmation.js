import './email_confirmation.css!'
import tmpl from './email_confirmation.html!text'
import Vue from 'vue'

export default Vue.extend({
    template: tmpl,
    props: [
        'user',
    ],
    data: () => ({
        error: {},
        success: false,
    }),
    computed: {
    },
    ready() {
        this.control
            .confirm_email(this.$route.query.token)
            .then(() => (this.success = true))
            .catch(error => (this.error = error))
    },
    methods: {

    },
    events: {

    },
})
