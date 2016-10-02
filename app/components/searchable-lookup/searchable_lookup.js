import './searchable_lookup.css!'
import tmpl from './searchable_lookup.html!text'
import Vue from 'vue'

import { clamp } from 'app/utils/clamp'


export default Vue.extend({
    template: tmpl,
    props: [
        'search',
        'skwargs',
        'filter',
        'action',
        'akwargs',
        'format',
        'placeholder',
    ],
    data: () => ({
        error: null,
        term: null,
        results: [],
        focus_index: 0,
        searching: false,
    }),
    computed: {
        filtered_results() {
            let filtered_result = this.results
            if(typeof this.filter === 'function') {
                filtered_result = this.filter(this.results)
            }

            // clamp the focus index within bounds of filtered search
            this.focus_index = clamp(0, this.focus_index, filtered_result.length-1)

            return filtered_result
        },
    },
    methods: {
        do_search() {
            // set search flag
            this.searching = true

            // trigger search
            let resolve = this.search(this.term, this.skwargs)
            if(typeof resolve.then === 'function') {
                // resolve as promise
                resolve.then(results => {
                            this.results = results
                            this.error = null})
                       .catch(error => {
                            this.results = []
                            this.error = error})
            }
            else {
                // execute function
                this.results = resolve
            }
        },
        do_action(item) {
            let resolve = this.action(item, this.akwargs)
            if(resolve && typeof resolve.then === 'function') {
                // resolve reset as promise response
                resolve.then(this.reset)
                       .catch(this.reset)
            }
            else {
                // reset lookup now
                this.reset()
            }
        },
        reset() {
            this.searching = false
            this.focus_index = 0
            this.term = ''
        }
    },
    watch: {
        results(value, old_value) {
            this.searching = false
        },
    }
})
