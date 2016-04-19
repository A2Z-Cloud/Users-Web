// CSS Imports
// –– Root Styles
import './main.css!'

// JS Imports
// –– Vue
import Vue from "vue"
import ResizeMixin from 'vue-resize-mixin'

// –– Dependencies
// NONE

// –– App panels
import signin_panel  from "app/components/signin-panel/signin"

// Vue global settings
Vue.config.debug = true

// –– Control
Control.prototype.install = function(Vue){
	Vue.prototype.control = this;
};

Vue.use(new Control());


// Init App
var app = new Vue({
    mixins: [ResizeMixin],
	el: 'body',
	data: {
        user: null,
        url: "a2z-users.herokuapp.com",
        status: null,
        error: null,
	},
    components: {
        "signin-panel": signin_panel,
    },
	computed: {

	},
	methods: {
        window_size() {
            return { height: window.innerHeight, width: window.innerWidth }
        },

	},
    created() {
        this.control.init((signal, message) => {
			this.$dispatch(signal, message);
			this.$broadcast(signal, message);
		}).
		then((status) => {
			this.status = status;
		}).
		catch((err) => {
			this.error = err;
		});
    },
    ready(){

    },
    events: {
        resize(size) {
            this.$broadcast('resize', size)
        },
    }
})

// For debugging against the web console
// window.app = app
