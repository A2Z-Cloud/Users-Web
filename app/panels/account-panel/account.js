import './account.css!'
import tmpl from './account.html!text'
import Vue from 'vue'

import { save_user, send_email_confirmation } from 'app/vuex/actions'


export default Vue.extend({
    template: tmpl,
    data: () => ({
        error: {},
        changing_password: false,
        sending_verification_email: false,
        recently_sent_verification: false,
        recently_sent_timeout_id: null,
        saving_user: false,
        dirty_user: {
            email: '',
            first_name: '',
            last_name: '',
            phone: '',
        },
        password_data: {
            old_password: '',
            new_password: '',
            new_password_confirmation: '',
        },
        password_requirements: {
            length: 8,
        },
    }),
    computed: {
        changed() {
            return this.nullify(this.dirty_user.email)      !== this.nullify(this.user.email)
                || this.nullify(this.dirty_user.first_name) !== this.nullify(this.user.first_name)
                || this.nullify(this.dirty_user.last_name)  !== this.nullify(this.user.last_name)
                || this.nullify(this.dirty_user.phone)      !== this.nullify(this.user.phone)
        },
        verify_email_button_text() {
            if (this.sending_verification_email) return 'Sending'
            else if (this.recently_sent_verification) return 'Check Your Inbox'
            return 'Verify Email'
        },
        save_user_button_text() {
            if (!this.valid_form) return 'Complete Form'
            else if (this.saving_user) return 'Saving'
            else if (!this.changed) return 'Saved'
            return 'Save'
        },
        change_password_button_text() {
            return 'Change Password'
        },
        valid_first_name() {
            return this.dirty_user.first_name
        },
        valid_last_name() {
            return this.dirty_user.last_name
        },
        valid_email() {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(this.dirty_user.email)
        },
        valid_form() {
            return this.valid_first_name
                && this.valid_last_name
                && this.valid_email
        },
        valid_new_password() {
            return this.password_data.new_password.length >= this.password_requirements.length
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
            send_email_confirmation,
        },
    },
    methods: {
        nullify: value => (value === '') ? null : value,
        verify_email() {
            this.sending_verification_email = true
            this.recently_sent_verification = true
            clearTimeout(this.recently_sent_timeout_id)
            const release_now      = () => (this.recently_sent_verification = false)
            const release_later    = () => (this.recently_sent_timeout_id = setTimeout(release_now, 15000))
            const finished_sending = () => (this.sending_verification_email = false)
            const sending_success  = () => {
                finished_sending()
                release_later()
            }
            const sending_failure  = () => {
                finished_sending()
                release_now()
            }
            this.send_email_confirmation()
                .then(sending_success)
                .catch(sending_failure)
        },
        save(user) {
            this.saving_user = true
            this.recently_sent_verification = this.dirty_user.email !== this.user.email || this.recently_sent_verification
            clearTimeout(this.recently_sent_timeout_id)
            const release_now     = () => (this.recently_sent_verification = false)
            const release_later    = () => (this.recently_sent_timeout_id = setTimeout(release_now, 15000))
            const sending_success = () => {
                this.saving_user = false
                release_later()
            }
            const sending_failure  = () => {
                this.saving_user = false
                release_now()
            }
            this.save_user(user)
                .then(sending_success)
                .catch(sending_failure)
        },
    },
})
