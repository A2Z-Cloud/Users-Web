import './users.css!'
import tmpl from './users.html!text'
import Vue from 'vue'

import { invite_url } from 'app/consts'

import { filter_users } from 'app/vuex/actions'
import infinite_table from 'app/components/infinite-table/infinite_table'
import user_creator from 'app/components/user-creator/user_creator'


export default Vue.extend({
    template: tmpl,
    components: {
        'infinite-table': infinite_table,
        'user-creator': user_creator,
    },
    data: () => ({
        error: null,
        show_create_component: false,
    }),
    computed: {
    },
    ready() {
    },
    vuex: {
        getters: {
            users: state => state.users,
        },
        actions: {
            filter_users,
        },
    },
    methods: {
        display_table_cell(user, {column}) {
            if (column === 'invite_accepted') return !user.invitation_token
            else if (column === 'invite_link' && !user.invitation_token) return '-'
            else if (column === 'invite_link' && user.invitation_token) return encodeURI(invite_url + '?email=' + user.email + '&token=' + user.invitation_token)
            return user[column]
        },
        close_create_component() {
            this.show_create_component = false
        },
        fetch_next(offset=0) {
            const filter = {offset, limit:10}
            return this.filter_users(filter)
        },
        fetch_next_search(term, offset=0) {
            const filter = {term, offset, limit:10}
            return this.filter_users(filter)
        },
    },
})
