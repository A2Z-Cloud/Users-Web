import './groups.css!'
import tmpl from './groups.html!text'
import Vue from 'vue'

import { filter_groups } from 'app/vuex/actions'
import infinite_table from 'app/components/infinite-table/infinite_table'
import group_creator from 'app/components/group-creator/group_creator'


export default Vue.extend({
    template: tmpl,
    components: {
        'infinite-table': infinite_table,
        'group-creator': group_creator,
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
            groups: state => state.groups,
        },
        actions: {
            filter_groups,
        },
    },
    methods: {
        close_create_component() {
            this.show_create_component = false
        },
        fetch(term, offset=0) {
            const filter = {term, offset, limit:20}
            return this.filter_groups(filter)
                       .then(items => this.groups.filter(s => items.includes(s.id))
                                                 .sort((a,b) => items.indexOf(a.id) > items.indexOf(b.id)))
        },
        item_clicked(item) {
            const name = item.name
            this.$router.go({name: 'group', params: {name}})
        },
    },
})
