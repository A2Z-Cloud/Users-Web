import './account.css!'
import tmpl from './account.html!text'
import Vue from 'vue'

import { save_user, send_email_confirmation, change_password } from 'app/vuex/actions'

import { password_errors, valid_email } from 'app/utils/validation'


export default Vue.extend({
    template: tmpl,
    data: () => ({
        error: {},
        salutation: 'Hi',
        changing_password: false,
        sending_verification_email: false,
        recently_sent_verification: false,
        recently_sent_timeout_id: null,
        recently_changed_password: false,
        saving_user: false,
        saving_password: false,
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
        valid_first_name() {
            return this.dirty_user.first_name.length > 0
        },
        valid_last_name() {
            return this.dirty_user.last_name.length > 0
        },
        valid_dirty_email() {
            return valid_email(this.dirty_user.email)
        },
        valid_form() {
            return this.valid_first_name
                && this.valid_last_name
                && this.valid_dirty_email
        },
        new_password_errors() {
            const {new_password} = this.password_data
            return password_errors(new_password)
        },
        confirm_password_errors() {
            const {new_password, new_password_confirmation} = this.password_data
            const errors = []
            if (new_password && new_password_confirmation && new_password !== new_password_confirmation) {
                errors.push("New password and confirmation do not match")
            }
            return errors
        },
        enable_change_password_button() {
            const {old_password, new_password, new_password_confirmation} = this.password_data
            return old_password
                && new_password
                && new_password_confirmation
                && !this.new_password_errors.length
                && !this.confirm_password_errors.length
                && new_password === new_password_confirmation
                && !this.saving_password
        },
    },
    ready() {
        this.dirty_user.email      = this.user.email
        this.dirty_user.first_name = this.user.first_name
        this.dirty_user.last_name  = this.user.last_name
        this.dirty_user.phone      = this.user.phone

        const salutations = ['Hi', 'Greetings', 'Salut', 'Hallo', 'Ciao', 'Ahoj', 'Hola', 'Hej', 'こんにちは', '你好', 'السلام عليكم', 'שלום', 'Olá', 'سلام']
        this.salutation   = salutations[Math.floor(Math.random()*salutations.length)]
    },
    vuex: {
        getters: {
            user: state => state.user,
        },
        actions: {
            save_user,
            send_email_confirmation,
            remote_change_password: change_password,
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
            const release_later   = () => (this.recently_sent_timeout_id = setTimeout(release_now, 15000))
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
        change_password(password_data) {
            this.saving_password = true
            const sending_success = () => {
                this.clear_password_form()
                this.saving_password = false
                this.changing_password = false
            }
            const sending_failure = () => {
                this.saving_password = false
            }
            this.remote_change_password(password_data)
                .then(sending_success)
                .catch(sending_failure)
        },
        clear_password_form() {
            this.password_data.old_password = this.password_data.new_password = this.password_data.new_password_confirmation = ''
        },
    },
    watch: {
        changing_password() {
            this.clear_password_form()
        },
    },
})
