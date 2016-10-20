import './tooltip_input.css!'
import tmpl from './tooltip_input.html!text'
import Vue from 'vue'


export default Vue.extend({
    template: tmpl,
    props: [
        'value',
        'show',
        'placeholder',
        'icon',
        'message',
        'color',
        'type',
    ],
    data: () => ({
    }),
    computed: {
        field_type() {
            return this.type ? this.type : 'text'
        },
        active_icon() {
            // The Vue binding is expecting an object keyed with
            // the class name and a boolean value to track if it
            // should be active on the element or not.
            return {[this.icon]:true}
        }
    },
})
