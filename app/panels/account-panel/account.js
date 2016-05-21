import './account.css!'
import tmpl from './account.html!text'
import Vue from 'vue'

import { save_user } from 'app/actions'


export default Vue.extend({
    template: tmpl,
    data: () => ({
        error: {},
        dirty_user: {
            email: '',
            first_name: '',
            last_name: '',
            phone: '',
        },
    }),
    computed: {
        changed() {
            return this.dirty_user.email      !== this.user.email
                || this.dirty_user.first_name !== this.user.first_name
                || this.dirty_user.last_name  !== this.user.last_name
                || this.dirty_user.phone      !== this.user.phone
        },
    },
    ready() {
        this.dirty_user.email      = this.user.email
        this.dirty_user.first_name = this.user.first_name
        this.dirty_user.last_name  = this.user.last_name
        this.dirty_user.phone      = this.user.phone
    },
    vuex: {
        getters: {
            user: store => store.user,
        },
        actions: {
            save_user,
        },
    },
    methods: {
    },
})
