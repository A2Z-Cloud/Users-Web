import './user_detail.css!'
import tmpl from './user_detail.html!text'
import Vue from 'vue'

import { Success } from 'app/model/notification'

import { password_errors, valid_email } from 'app/utils/validation'

import { merge } from 'app/utils/merge'

import {
    get_user,
    save_user,
    send_invite,
    send_email_confirmation,
    change_password,
    insert_notification,
    filter_zoho_contacts,
    get_zoho_contact } from 'app/vuex/actions'

import searchable_lookup from 'app/components/searchable-lookup/searchable_lookup'
import value_bubble from 'app/components/value-bubble/value_bubble'


export default Vue.extend({
    template: tmpl,
    components: {
        'searchable-lookup': searchable_lookup,
        'value-bubble': value_bubble,
    },
    data: () => ({
        user_id: null,
        error: {},
        salutation: 'Hi',
        changing_password: false,
        recently_changed_password: false,
        saving_user: false,
        saving_password: false,
        dirty_user: {
            email: '',
            first_name: '',
            last_name: '',
            phone: '',
            zcrm_id: '',
        },
        password_data: {
            old_password: '',
            new_password: '',
            new_password_confirmation: '',
        },
    }),
    route: {
        data(transition) {
            const id       = (transition.to.params.id) ? transition.to.params.id : this.signed_in_user.id
            const promises = [this.get_user({id})]
            const resolve  = ([user]) => ({dirty_user: merge({}, user), user_id: user.id})
            return Promise.all(promises).then(resolve)
        },
    },
    computed: {
        user() {
            const selected = u => u.id === this.user_id
            const index    = this.users.findIndex(selected)
            return (index !== -1) ? this.users[index] : null
        },
        zoho_contact() {
            return this.dirty_user.zcrm_id ? this.get_zoho_contact(this.dirty_user.zcrm_id) : 'unknown'
        },
        editing_signed_in_user() {
            return this.user_id === this.signed_in_user.id
        },
        show_send_user_invite() {
            return this.user.invitation_token
                && this.dirty_user.email === this.user.email
        },
        show_verify_email_button() {
            return this.editing_signed_in_user
                && !this.user.email_confirmed
                && this.dirty_user.email === this.user.email
                && !this.changing_password
                && !this.show_send_user_invite
        },
        show_change_password_button() {
            return this.editing_signed_in_user
                && !this.user.invitation_token
                && !this.saving_password
        },
        changed() {
            return this.dirty_user.email      !== this.user.email
                || this.dirty_user.first_name !== this.user.first_name
                || this.dirty_user.last_name  !== this.user.last_name
                || this.dirty_user.phone      !== this.user.phone
                || this.dirty_user.zcrm_id    !== this.user.zcrm_id
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
        const salutations = ['Hi', 'Greetings', 'Salut', 'Hallo', 'Ciao', 'Ahoj', 'Hola', 'Hej', 'こんにちは', '你好', 'السلام عليكم', 'שלום', 'Olá', 'سلام']
        this.salutation   = salutations[Math.floor(Math.random()*salutations.length)]
    },
    vuex: {
        getters: {
            signed_in_user: state => state.user,
            users: state => state.users,
        },
        actions: {
            get_user,
            save_user,
            send_invite,
            send_email_confirmation,
            remote_change_password: change_password,
            insert_notification,
            get_zoho_contact,
            filter_zoho_contacts,
        },
    },
    methods: {
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
        search_zoho_contacts(term, {offset=0, limit=5}={}) {
            return this.filter_zoho_contacts({term, offset, limit})
        },
        set_zoho_id(record) {
            this.dirty_user.zcrm_id = record.id
        },
        format_zoho_contact(contact) {
            let name = contact
            // attempt to parse name
            if(contact && contact.last_name) {
                name = contact.last_name
                if(contact.first_name) name = contact.first_name + " " + name
            }
            return name
        },
        clear_zoho_contact() {
            this.dirty_user.zcrm_id = null
        },
        change_password(password_data) {
            this.saving_password = true
            const sending_success = () => {
                this.clear_password_form()
                this.saving_password = false
                this.changing_password = false
                this.insert_notification({
                    message: 'Password Changed',
                    type: Success})
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
        send_user_invite() {
            const user_id = this.user_id
            return this.send_invite({user_id})
        },
    },
    watch: {
        changing_password() {
            this.clear_password_form()
        },
    },
})
