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
        fetch(term, offset=0) {
            const filter = {all_services:true, term, offset, limit:20}
            return this.filter_services(filter)
                       .then(items => this.services.filter(s => items.includes(s.id))
                                                   .sort((a,b) => items.indexOf(a.id) > items.indexOf(b.id)))
        },
        display_table_cell_type(service, {column}) {
            return 'html'
        },
        display_table_cell(service, {column}) {
            const broken_link = service.client_url ? "" : "<span class='lnr lnr-warning'></span>"
            return "<div class='service'>"+service.name+broken_link+"</div>"
        },
        item_clicked(service) {
            if(service.client_url) window.location = service.client_url
        },
    },
})
