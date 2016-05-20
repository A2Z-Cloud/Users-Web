import './services.css!'
import tmpl from './services.html!text'
import Vue from 'vue'

export default Vue.extend({
    template: tmpl,
    props: [
        'user',
    ],
    data: () => ({
        error: {},
        services: [],
    }),
    computed: {
    },
    ready() {
        this.control
            .filter_services()
            .then(services => (this.services = services))
            .catch(error => (this.error = error))
    },
    methods: {

    },
    events: {

    },
})
