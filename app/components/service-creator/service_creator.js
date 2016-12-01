import './service_creator.css!'
import tmpl from './service_creator.html!text'
import Vue from 'vue'

import { save_service } from 'app/vuex/actions'


export default Vue.extend({
    template: tmpl,
    props: ['completed'],
    data: () => ({
        error: null,
        creating_service: false,
        will_finish: false,
        service: {
            name: null,
            secret: null,
            client_url: null,
            cors: null,
            sign_in_url: null,
            sign_out_url: null,
        },
    }),
    computed: {
        enable_create_button() {
            return this.service.name
                && this.service.secret
                && this.service.client_url
                && this.service.cors
                && this.service.sign_in_url
                && this.service.sign_out_url
                && !this.creating_service
        },
    },
    ready() {
    },
    vuex: {
        getters: {

        },
        actions: {
            save_service,
        },
    },
    methods: {
        clear_service() {
            this.service.name         = null
            this.service.secret       = null
            this.service.client_url   = null
            this.service.cors         = null
            this.service.sign_in_url  = null
            this.service.sign_out_url = null
        },
        create_service({finish=true}) {
            this.creating_service = true
            this.will_finish   = finish
            const sending_success = () => {
                this.clear_service()
                this.creating_service = false

                if (finish) this.completed()
            }
            const sending_failure = () => {
                this.creating_service = false
            }
            this.save_service(this.service)
                .then(sending_success)
                .catch(sending_failure)
        },
    },
})
