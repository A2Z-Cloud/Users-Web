import './group_detail.css!'
import tmpl from './group_detail.html!text'
import Vue from 'vue'

import { get_group } from 'app/vuex/actions'


export default Vue.extend({
    template: tmpl,
    data: () => ({
        error: null,
        group: null,
        dirty_group: null,
    }),
    computed: {
    },
    ready() {
        const name = this.$route.params.name
        this.get_new_group(name)
    },
    vuex: {
        actions: {
            get_group,
        },
    },
    methods: {
        get_new_group(name) {
            this.error = null
            this.get_group({name})
                .then(group => (this.group = this.dirty_group = group))
                .catch(error => (this.error = error))
        },
    },
    watch: {
        '$route.params.name'(name) {
            this.get_new_group(name)
        },
    },
})
