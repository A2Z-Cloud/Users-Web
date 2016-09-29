import './group_detail.css!'
import tmpl from './group_detail.html!text'
import Vue from 'vue'

import { get_group, save_group, get_membership, filter_users,
         save_membership, delete_membership, filter_zoho_groups, get_zoho_group } from 'app/vuex/actions'

import searchable_lookup from 'app/components/searchable-lookup/searchable_lookup'


export default Vue.extend({
    template: tmpl,
    components: {
        'searchable-lookup': searchable_lookup,
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

            const resolve  = ([group]) => {
                const result = { dirty_group: group, group_id: group.id }

                const zoho_promises = [
                    this.get_zoho_group({service: 'crm',      id: group.zcrm_id}),
                    this.get_zoho_group({service: 'projects', id: group.zprojects_id}),
                    this.get_zoho_group({service: 'support',  id: group.zsupport_id})]

                const finish = () => result
                return Promise.all(zoho_promises)
                              .catch(finish)
                              .then(finish)
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
        },
        filtered_searched_members(records) {
            // remove members from search
            const member_ids = this.group_membership.map(m => m.user.id)
            const not_member = m => member_ids.indexOf(m.id) === -1
            return records.filter(not_member)
        },
        display_search_member(member) {
            return member.first_name + " " + member.last_name + " - " + member.email
        },
        search_zoho_groups(term, {service='crm', offset=0, limit=5}={}) {
            return this.filter_zoho_groups({service, term, offset, limit})
        },
        set_zoho_id(record, {service='crm'}={}) {
            switch (service) {
            case 'projects':
                this.dirty_group.zprojects_id = record.id
                break
            case 'support':
                this.dirty_group.zsupport_id = record.id
                break
            default:
                this.dirty_group.zcrm_id = record.id
            }
        },
        display_zoho_group(record) {
            return record.name
        },
        zoho_account_name(id, service) {
            const groups = this.zoho_groups.filter(zg => (zg.id === id && zg.service === service))
            return (groups.length === 1) ? groups[0].name : null
        },
    },
})
