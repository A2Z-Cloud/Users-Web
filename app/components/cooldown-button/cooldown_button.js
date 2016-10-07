import './cooldown_button.css!'
import tmpl from './cooldown_button.html!text'
import Vue from 'vue'


export default Vue.extend({
    template: tmpl,
    props: {
        activeText: {default: ''},
        sendingText: {default: ''},
        cooldownText: {default: ''},
        cooldownDuration: {default: 15},
        onClick: {default: null},
        disabled: {default: false},
    },
    data: () => ({
        sending: false,
        recently_sent: false,
        timeout_id: null,
    }),
    computed: {
        button_text() {
            if (this.sending) return this.sendingText
            else if (this.recently_sent) return this.cooldownText
            return this.activeText
        },
    },
    methods: {
        go() {
            this.sending       = true
            this.recently_sent = true

            clearTimeout(this.timeout_id)

            const release_now      = () => (this.recently_sent = false)
            const release_later    = () => (this.timeout_id = setTimeout(release_now, this.cooldownDuration * 1000))
            const finished_sending = () => (this.sending = false)
            const sending_success  = () => {
                finished_sending()
                release_later()}
            const sending_failure  = () => {
                finished_sending()
                release_now()}

            this.onClick()
                .then(sending_success)
                .catch(sending_failure)
        },
    },
})
