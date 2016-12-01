import './users.css!'
import tmpl from './users.html!text'
import Vue from 'vue'

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
    computed: {},
    ready() {},
    vuex: {
        getters: {
            users: state => state.users,
        },
        actions: {
            filter_users,
        },
    },
    methods: {
        close_create_component() {
            this.show_create_component = false
        },
        fetch(term, offset=0) {
            const filter = {term, offset, limit:20}
            return this.filter_users(filter)
                       .then(items => this.users.filter(u => items.includes(u.id))
                                                .sort((a,b) => items.indexOf(a.id) > items.indexOf(b.id)))
        },
        display_table_cell_type(user, {column}) {
            if (column === 'invite_accepted') return 'html'
            if (column === 'invite_link' && user.invitation_token) return 'component'
            return 'raw'
        },
        display_table_cell(user, {column}) {
            if (column === 'invite_accepted' && !user.invitation_token) return '<span class="lnr lnr-checkmark-circle"></span>'
            else if (column === 'invite_accepted' && user.invitation_token) return '<span class="lnr lnr-cross-circle"></span>'
            else if (column === 'invite_link' && user.invitation_token) return 'link-copier'

            return user[column]
        },
        item_clicked(item) {
            const id = item.id
            this.$router.go({name: 'user', params: {id}})
        },
    },
})
