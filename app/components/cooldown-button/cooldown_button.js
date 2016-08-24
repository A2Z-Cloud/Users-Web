import './cooldown_button.css!'
import tmpl from './cooldown_button.html!text'
import Vue from 'vue'


export default Vue.extend({
    template: tmpl,
    props: [
        'active_text',
        'sending_text',
        'cooldown_text',
        'cooldown_duration',
        'on_click',
    ],
    data: () => ({
        sending: false,
        recently_sent: false,
        timeout_id: null,
    }),
    computed: {
        button_text() {
            if (this.sending) return this.sending_text
            else if (this.recently_sent) return this.cooldown_text
            return this.active_text
        },
    },
    methods: {
        go() {
            this.sending       = true
            this.recently_sent = true

            clearTimeout(this.timeout_id)

            const release_now      = () => (this.recently_sent = false)
            const release_later    = () => (this.timeout_id = setTimeout(release_now, 15000))
            const finished_sending = () => (this.sending = false)
            const sending_success  = () => {
                finished_sending()
                release_later()}
            const sending_failure  = () => {
                finished_sending()
                release_now()}

            this.on_click()
                .then(sending_success)
                .catch(sending_failure)
        },
    },
})
