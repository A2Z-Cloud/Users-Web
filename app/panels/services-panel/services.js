import './services.css!'
import tmpl from './services.html!text'
import Vue from 'vue'

import { filter_services } from 'app/vuex/actions'
import infinite_table from 'app/components/infinite-table/infinite_table'
import service_creator from 'app/components/service-creator/service_creator'


export default Vue.extend({
    template: tmpl,
    components: {
        'infinite-table': infinite_table,
        'service-creator': service_creator,
    },
    data: () => ({
        error: null,
        show_create_component: false,
    }),
    computed: {
    },
    ready() {
    },
    vuex: {
        getters: {
            services: state => state.services,
        },
        actions: {
            filter_services,
        },
    },
    methods: {
        close_create_component() {
            this.show_create_component = false
        },
        fetch_next(offset=0) {
            const filter = {offset, limit:10}
            return this.filter_services(filter)
        },
        fetch_next_search(term, offset=0) {
            const filter = {term, offset, limit:10}
            return this.filter_services(filter)
        },
    },
})
