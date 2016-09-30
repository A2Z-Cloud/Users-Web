import './value_bubble.css!'
import tmpl from './value_bubble.html!text'
import Vue from 'vue'


export default Vue.extend({
    template: tmpl,
    props: [
        'display',
        'format',
        'link',
        'pop',
    ],
    data: () => ({
        value: null,
        error: null,
    }),
    computed: {
        show() {
            if(this.error) return "unknown"
            else if(!this.value) return "loading..."
            else return (this.format ? this.format(this.value) : this.value)
        },
        link_type() {
            if(this.link && typeof this.link == 'object') return 'router'
            if(this.link) return 'href'
        },
    },
    methods: {
        set_value(value) {
            this.value = value
            this.error = null
        },
        set_error(value) {
            this.value = null
            this.error = value
        },
        get_value() {
            // clear value
            this.set_value(null)

            if(this.display) {
                // trigger
                if(typeof this.display.then === 'function') {
                    // resolve as promise
                    this.display.then(this.set_value)
                                .catch(this.set_error)
                }
                else if(typeof this.display === 'function') {
                    // resolve as function
                    this.set_value( this.display() )
                }
                else {
                    // resolve as value
                    this.set_value( this.display )
                }
            }
        },
    },
    watch: {
        display(value, old_value) {
            this.get_value()
        },
    },
    ready() {
        this.get_value()
    },
})
