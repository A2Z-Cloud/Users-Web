import './account.css!'
import tmpl from './account.html!text'
import Vue from 'vue'

export default Vue.extend({
    template: tmpl,
    props: [
    ],
    data: () => ({
        error: '',
        account: {},
    }),
    computed: {
    },
    ready() {
        this.control
            .get_user(1)
            .then(account => (this.account = account))
            .catch(error => (this.error = error))
    },
    methods: {

    },
    events: {

    },
})
