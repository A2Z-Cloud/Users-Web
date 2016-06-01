import './user_creator.css!'
import tmpl from './user_creator.html!text'
import Vue from 'vue'

import { invite_user } from 'app/vuex/actions'


export default Vue.extend({
    template: tmpl,
    props: ['completed'],
    data: () => ({
        error: null,
        creating_user: false,
        will_finish: false,
        user: {
            email: '',
            first_name: '',
            last_name: '',
            phone: '',
            birthday: null,
            zcrm_id: '',
            send_email_invite: true,
        },
    }),
    computed: {
        enable_create_button() {
            return this.user.email
                && this.user.first_name
                && this.user.last_name
                && !this.creating_user
        },
    },
    ready() {
    },
    vuex: {
        getters: {

        },
        actions: {
            invite_user,
        },
    },
    methods: {
        clear_user() {
            this.user.email      = ''
            this.user.first_name = ''
            this.user.last_name  = ''
            this.user.phone      = ''
            this.user.birthday   = null
            this.user.zcrm_id    = ''
        },
        create_user({finish=true}) {
            this.creating_user = true
            this.will_finish   = finish
            const sending_success = () => {
                this.clear_user()
                this.creating_user = false

                if (finish) this.completed()
            }
            const sending_failure = () => {
                this.creating_user = false
            }
            this.invite_user(this.user)
                .then(sending_success)
                .catch(sending_failure)
        },
    },
})
