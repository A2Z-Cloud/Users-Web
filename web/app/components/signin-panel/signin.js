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
            background_url: "https://s3-eu-west-1.amazonaws.com/com-a2zcloud-assets/images/a2z-users/landscapes/",
            username: null,
            password: null,
            result: null,
            error: null,
        }
    },
    components: {

    },
    created() {
        this.background_url += "land" + Math.floor((Math.random() * 11) + 1) + ".jpg"
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
            this.control.sign_in(this.username,this.password).
                then((result) => {
                    console.log(result)
                }).
                catch((error) => {
                    console.log(error)
                })

            return false
        },
    },
    computed: {},
    events: {
        resize(size) {
            this.resize_panel(size)
            return true
        },
    }
})
