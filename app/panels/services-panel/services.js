import './services.css!'
import tmpl from './services.html!text'
import Vue from 'vue'

import { filter_services } from 'app/vuex/actions'
import infinite_table from 'app/components/infinite-table/infinite_table'


export default Vue.extend({
    template: tmpl,
    components: {
        'infinite-table': infinite_table,
    },
    data: () => ({
        error: null,
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
