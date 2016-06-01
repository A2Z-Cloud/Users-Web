import './user_creator.css!'
import tmpl from './user_creator.html!text'
import Vue from 'vue'

import { invite_user } from 'app/vuex/actions'


export default Vue.extend({
    template: tmpl,
    data: () => ({
        error: null,
        user: {
            email: '',
            first_name: '',
            last_name: '',
            phone: '',
            birthday: null,
            zcrm_id: null,
            send_email_invite: true,
        },
    }),
    computed: {
        enable_create_button() {
            return this.user.email
                && this.user.first_name
                && this.user.last_name
        },
    },
    ready() {
    },
    vuex: {
        getters: {

        },
    },
    methods: {
        cancel() {
            return
        },
        create_user({finish=true}) {
            return
        },
    },
})
