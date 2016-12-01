import './group_detail.css!'
import tmpl from './group_detail.html!text'
import Vue from 'vue'

import { get_group, save_group, get_membership, filter_users,
         save_membership, delete_membership, filter_zoho_groups, get_zoho_group } from 'app/vuex/actions'

import searchable_lookup from 'app/components/searchable-lookup/searchable_lookup'
import value_bubble from 'app/components/value-bubble/value_bubble'


export default Vue.extend({
    template: tmpl,
    components: {
        'searchable-lookup': searchable_lookup,
        'value-bubble': value_bubble,
    },
    data: () => ({
        error: null,
        group_id: null,
        dirty_group: null,
    }),
    route: {
        data(transition) {
            const name     = transition.to.params.name
            const promises = [
                this.get_group({name}),
                this.get_membership({group_name: name})]

            const resolve = ([group]) => {
                // prepare function to finish loading group
                const finish = () => ({ dirty_group: group, group_id: group.id })

                // create promises for loading zoho data
                const zoho_promises = []
                if(group.zcrm_id)       zoho_promises.push(this.get_zoho_group({service: 'crm',      id: group.zcrm_id}))
                if(group.zprojects_id)  zoho_promises.push(this.get_zoho_group({service: 'projects', id: group.zprojects_id}))
                if(group.zsupport_id)   zoho_promises.push(this.get_zoho_group({service: 'support',  id: group.zsupport_id}))

                // load zoho data
                if(zoho_promises.length > 0) {
                    return Promise.all(zoho_promises)
                                  .catch(finish)
                                  .then(finish)
                }
                else {
                    // if no zoho ids were present just finish here
                    finish()
                }
            }

            return Promise.all(promises).then(resolve)
        },
    },
    computed: {
        valid_form() {
            return this.dirty_group && this.dirty_group.name
        },
        changed() {
            if (this.dirty_group && this.group) {
                return this.dirty_group.name         !== this.group.name
                    || this.dirty_group.zcrm_id      !== this.group.zcrm_id
                    || this.dirty_group.zprojects_id !== this.group.zprojects_id
                    || this.dirty_group.zsupport_id  !== this.group.zsupport_id
            }
            return false
        },
        save_group_button_text() {
            if (!this.valid_form) return 'Complete Form'
            else if (this.saving_group) return 'Saving'
            else if (!this.changed) return 'Saved'
            return 'Save'
        },
        group() {
            try {return this.groups.filter(g => g.id === this.group_id)[0]}
            catch(error) {return null}
        },
        group_membership() {
            return this.memberships.filter(m => m.group.id === this.group_id)
        },
    },
    ready() {
        this.dirty_group = this.group
    },
    vuex: {
        getters: {
            groups: state => state.groups,
            users: state => state.users,
            memberships: state => state.memberships,
            zoho_groups: state => state.zoho_groups,
        },
        actions: {
            get_group,
            save_group,
            get_membership,
            filter_users,
            save_membership,
            delete_membership,
            filter_zoho_groups,
            get_zoho_group,
        },
    },
    methods: {
        save(group) {
            this.saving_group = true
            const finshed_saving = () => (this.saving_group = false)
            this.save_group(group)
                .then(finshed_saving)
                .catch(finshed_saving)
        },
        add_member(member) {
            if (member != null && member.id != null) {
                const group_id = this.group.id
                const user_id  = member.id
                return this.save_membership({group_id, user_id})
            }
        },
        remove_member(id) {
            this.delete_membership(id)
        },
        search_members(term) {
            // Limit must be extended to include those already added to group
            const limit  = 5 + this.group_membership.length
            const filter = {term, offset: 0, limit}
            return this.filter_users(filter)
                       .then(items => this.users.filter(u => items.includes(u.id))
                                                .sort((a,b) => items.indexOf(a.id) > items.indexOf(b.id)))
        },
        filter_searched_members(records) {
            // remove members from search
            const member_ids = this.group_membership.map(m => m.user.id)
            const not_member = m => member_ids.indexOf(m.id) === -1
            return records.filter(not_member)
        },
        format_searched_member(member) {
            return member.first_name + " " + member.last_name + " - " + member.email
        },
        search_zoho_groups(term, {service='crm', offset=0, limit=5}={}) {
            return this.filter_zoho_groups({service, term, offset, limit})
        },
        set_zoho_id(record, {service='crm'}={}) {
            if(service == 'crm')           this.dirty_group.zcrm_id      = record.id
            else if(service == 'projects') this.dirty_group.zprojects_id = record.id
            else if(service == 'support')  this.dirty_group.zsupport_id  = record.id
        },
        format_zoho_group(record) {
            // if value was not set to the record then return it (may be 'unknown' or 'undefined')
            return record && record.name ? record.name : record
        },
        zoho_account_name(id, service) {
            const groups = this.zoho_groups.filter(zg => (zg.id === id && zg.service === service))
            return (groups.length === 1) ? groups[0].name : 'unknown'
        },
    },
})
