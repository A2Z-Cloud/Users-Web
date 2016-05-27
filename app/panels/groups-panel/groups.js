import './groups.css!'
import tmpl from './groups.html!text'
import Vue from 'vue'

import { filter_groups } from 'app/vuex/actions'
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
            groups: state => state.groups,
        },
        actions: {
            filter_groups,
        },
    },
    methods: {
        fetch_next(offset=0) {
            const filter = {offset, limit:10}
            return this.filter_groups(filter)
        },
        fetch_next_search(term, offset=0) {
            const filter = {term, offset, limit:10}
            return this.filter_groups(filter)
        },
    },
})
