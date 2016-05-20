import './groups.css!'
import tmpl from './groups.html!text'
import Vue from 'vue'

export default Vue.extend({
    template: tmpl,
    props: [
        'user',
    ],
    data: () => ({
        error: {},
        groups: [],
    }),
    computed: {
    },
    ready() {
        this.control
            .filter_groups()
            .then(groups => (this.groups = groups))
            .catch(error => (this.error = error))
    },
    methods: {

    },
    events: {

    },
})
