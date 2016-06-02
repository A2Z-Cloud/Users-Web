import './group_creator.css!'
import tmpl from './group_creator.html!text'
import Vue from 'vue'

import { save_group } from 'app/vuex/actions'


export default Vue.extend({
    template: tmpl,
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
    },
})
