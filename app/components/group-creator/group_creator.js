import './group_creator.css!'
import tmpl from './group_creator.html!text'
import Vue from 'vue'

import { save_group, filter_zoho_groups, get_zoho_group } from 'app/vuex/actions'

import searchable_lookup from 'app/components/searchable-lookup/searchable_lookup'
import value_bubble from 'app/components/value-bubble/value_bubble'


export default Vue.extend({
    template: tmpl,
    components: {
        'searchable-lookup': searchable_lookup,
        'value-bubble': value_bubble,
    },
    props: ['completed'],
    data: () => ({
        error: null,
        creating_group: false,
        will_finish: false,
        group: {
            name: '',
            zcrm_id: '',
            zprojects_id: '',
            zsupport_id: '',
        },
    }),
    computed: {
        enable_create_button() {
            return this.group.name
                && !this.creating_group
        },
    },
    ready() {
    },
    vuex: {
        getters: {

        },
        actions: {
            save_group,
            filter_zoho_groups,
            get_zoho_group,
        },
    },
    methods: {
        clear_group() {
            this.group.name         = ''
            this.group.zcrm_id      = ''
            this.group.zprojects_id = ''
            this.group.zsupport_id  = ''
        },
        create_group({finish=true}) {
            this.creating_group = true
            this.will_finish    = finish
            const sending_success = () => {
                this.clear_group()
                this.creating_group = false

                if (finish) this.completed()
            }
            const sending_failure = () => {
                this.creating_group = false
            }
            this.save_group(this.group)
                .then(sending_success)
                .catch(sending_failure)
        },
        search_zoho_groups(term, {service='crm', offset=0, limit=5}={}) {
            return this.filter_zoho_groups({service, term, offset, limit})
        },
        zoho_account(service) {
            let zgroup_id = null

            if(service == 'crm')           zgroup_id = this.group.zcrm_id
            else if(service == 'projects') zgroup_id = this.group.zprojects_id
            else if(service == 'support')  zgroup_id = this.group.zsupport_id

            return zgroup_id ? this.get_zoho_group({service: service, id: zgroup_id}) : 'unknown'
        },
        set_zoho_id(record, {service='crm'}={}) {
            if(service == 'crm')           this.group.zcrm_id      = record.id
            else if(service == 'projects') this.group.zprojects_id = record.id
            else if(service == 'support')  this.group.zsupport_id  = record.id
        },
        format_zoho_group(record) {
            // if value was not set to the record then return it (may be 'unknown' or 'undefined')
            return record && record.name ? record.name : record
        },
    },
})
