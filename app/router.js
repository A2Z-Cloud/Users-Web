// JS Imports
import Vue from 'vue'
import VueRouter from 'vue-router'

import {debug} from './consts'

// -- Route Panels
// import SomePanel from "./components/some-panel/some_panel"


Vue.use(VueRouter)
Vue.config.debug = debug

const router = new VueRouter({
    history: false,
})

router.map({
    // '/': {
    //     name: 'SomePage',
    //     component: SomePanel,
    // },
})

// For debugging against the web console
if (debug) {
    window.app = router
}

export default router
