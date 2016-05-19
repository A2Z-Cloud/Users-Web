import './users.css!'
import tmpl from './users.html!text'
import Vue from 'vue'

export default Vue.extend({
    template: tmpl,
    props: [
    ],
    data: () => ({
        error: '',
        deeds: [],
        new_deed: {
            description:'',
        },
    }),
    computed: {
    },
    ready() {
    },
    methods: {
    },
    events: {
    },
})
