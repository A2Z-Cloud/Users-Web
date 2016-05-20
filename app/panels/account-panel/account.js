import './account.css!'
import tmpl from './account.html!text'
import Vue from 'vue'

import {email_confirmation_url} from 'app/consts'


export default Vue.extend({
    template: tmpl,
    props: [
        'user',
    ],
    data: () => ({
        error: {},
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
    }),
    computed: {
        changed() {
            return this.email      !== this.user.email
                || this.first_name !== this.user.first_name
                || this.last_name  !== this.user.last_name
                || this.phone      !== this.user.phone
        },
    },
    ready() {
        this.email      = this.user.email
        this.first_name = this.user.first_name
        this.last_name  = this.user.last_name
        this.phone      = this.user.phone
    },
    methods: {
        save_changes() {
            this.control
                .save_user(
                    this.email,
                    this.first_name,
                    this.last_name,
                    this.phone,
                    this.user.birthday,
                    this.user.zcrm_id,
                    email_confirmation_url,
                    this.user.id
                )
                .then(r => {
                    console.log(r)
                })
                .catch(r => {
                    console.log(r)
                })
        },
    },
    events: {

    },
})
