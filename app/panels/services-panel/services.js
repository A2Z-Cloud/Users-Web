import './services.css!'
import tmpl from './services.html!text'
import Vue from 'vue'

import { filter_services } from 'app/vuex/actions'


export default Vue.extend({
    template: tmpl,
    data: () => ({
        error: null,
        busy: false,
        table_body_distance_from_top: 0,
        exhausted: false,
    }),
    computed: {
        table_height() {
            return (this.window_height - this.table_body_distance_from_top - 32) + 'px'
        },
        filter() {
            return {
                offset: this.services.length,
                limit: 10,
            }
        },
    },
    ready() {
        this.table_body_distance_from_top = this.$els.tableBody.getBoundingClientRect().top
    },
    vuex: {
        getters: {
            window_height: state => state.window_size.height,
            services: state => state.services,
        },
        actions: {
            filter_services,
        },
    },
    methods: {
        fetch_next() {
            if (this.exhausted) return

            this.busy = true
            const success = services => {
                this.exhausted = services.length === 0
                this.busy = false
            }

            this.filter_services(this.filter)
                .then(success)
                .catch(() => (this.exhausted = true))
        },
    },
    watch: {
    },
})
