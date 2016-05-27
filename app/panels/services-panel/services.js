import './services.css!'
import tmpl from './services.html!text'
import Vue from 'vue'

import { filter_services } from 'app/vuex/actions'


export default Vue.extend({
    template: tmpl,
    data: () => ({
        error: null,
        search_term: '',
        search_services: [],
        busy: false,
        table_body_distance_from_top: 0,
        exhausted: false,
    }),
    computed: {
        searching() {
            return (this.search_term.length > 0)
        },
        services() {
            if (this.searching) return this.search_services
            return this.all_services
        },
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
            all_services: state => state.services,
        },
        actions: {
            filter_services,
        },
    },
    methods: {
        search() {
            const filter = {term:this.search_term, offset:0, limit:5}
            this.filter_services(filter)
                .then(services => (this.search_services = services))
                .catch(() => (this.exhausted = true))
        },
        fetch_next() {
            if (this.exhausted || this.searching) return

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
})
