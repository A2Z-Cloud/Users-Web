// Linear Icons
import 'https://cdn.linearicons.com/free/1.0.0/icon-font.min.css!'

// Panel Styles
import './signin.css!'

// Panel Template
import tmpl from './signin.html!text'

// VueJS
import Vue from 'vue'


// Setup Panel
export default Vue.extend({
    template: tmpl,
    props: [],
    data() {
        return {
            username: null,
            password: null,
            result: null,
        }
    },
    components: {

    },
    ready() {
        // window.signin_panel = this

        // attempt to get user with cookie
        // this.access_control.get_user();
    },
    methods: {
        resize_panel(size) {
            // Not Reactive
        },
        sign_in() {
            // send login request
            this.access_control.login()

            console.log(this.username);
            console.log(this.password);
        },
    },
    computed: {},
    events: {
        resize(size) {
            this.resize_panel(size)
            return true
        },
        get_user(result) {
            this.user = result
        },
    }
})
