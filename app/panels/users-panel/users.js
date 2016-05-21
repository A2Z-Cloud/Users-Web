import './users.css!'
import tmpl from './users.html!text'
import Vue from 'vue'

import { filter_users } from 'app/actions'


export default Vue.extend({
    template: tmpl,
    data: () => ({
        new_user: {
            email: '',
            first_name: '',
            last_name: '',
        },
    }),
    ready() {
        this.filter_users()
    },
    vuex: {
        getters: {
            users: store => store.users,
        },
        actions: {
            filter_users,
        },
    },
})
