import './users.css!'
import tmpl from './users.html!text'
import Vue from 'vue'


export default Vue.extend({
    template: tmpl,
    props: [
        'user',
    ],
    data: () => ({
        error: {},
        users: [],
        new_user: {
            email: '',
            first_name: '',
            last_name: '',
        },
    }),
    computed: {
    },
    ready() {
        this.$control
            .filter_users()
            .then(users => (this.users = users))
            .catch(error => (this.error = error))
    },
    methods: {

    },
    events: {

    },
})
