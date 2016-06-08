import './group_detail.css!'
import tmpl from './group_detail.html!text'
import Vue from 'vue'

import { get_group, save_group, get_membership, filter_users,
         save_membership, delete_membership } from 'app/vuex/actions'
import { clamp } from 'app/utils/clamp'


export default Vue.extend({
    template: tmpl,
    data: () => ({
        error: null,
        group_id: null,
        dirty_group: null,
        member_search_term: null,
        searched_members: [],
        focus_index: 0,
    }),
    route: {
        data(transition) {
            const name     = transition.to.params.name
            const promises = [
                this.get_group({name}),
                this.get_membership({group_name: name})]
            const resolve  = ([group]) => ({dirty_group: group, group_id: group.id})
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
        filtered_searched_members() {
            // remove ones in members already and clamp the focus index in range
            const member_ids = this.group_membership.map(m => m.user.id)
            const not_member = m => member_ids.indexOf(m.id) === -1
            const result     = this.searched_members.filter(not_member)
            // Clamp the focus index to inbounds of filtered search
            this.focus_index = clamp(0, this.focus_index, result.length-1)
            return result
        },
    },
    ready() {
        this.dirty_group = this.group
    },
    vuex: {
        getters: {
            memberships: state => state.memberships,
            groups: state => state.groups,
        },
        actions: {
            get_group,
            save_group,
            get_membership,
            filter_users,
            save_membership,
            delete_membership,
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
        add_member({index}) {
            if (index < this.searched_members.length) {
                const group_id = this.group.id
                const user_id  = this.filtered_searched_members[index].id
                const clean_up = () => {
                    this.focus_index = 0
                    this.member_search_term = ''
                }
                this.save_membership({group_id, user_id})
                    .then(clean_up)
                    .catch(clean_up)
            }
        },
        remove_member(id) {
            this.delete_membership(id)
        },
        search_members(term) {
            // Add the number of member so can filter out members that
            // already exist and keep same number of results
            const limit  = 5 + this.searched_members.length
            const filter = {term, offset: 0, limit}
            this.filter_users(filter)
                .then(members => (this.searched_members = members))
                .catch(error => {
                    this.searched_members = []
                    this.error = error})
        },
    },
})
