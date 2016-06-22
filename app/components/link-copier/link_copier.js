import './link_copier.css!'
import tmpl from './link_copier.html!text'
import Vue from 'vue'

import { invite_url } from 'app/consts'


// TODO: this is not generic. should be seperated into a item cell
// and a link-copier component.
export default Vue.extend({
    template: tmpl,
    props: ['item'],
    computed: {
        href() {
            return encodeURI(invite_url) + '?email=' + encodeURIComponent(this.item.email) + '&token=' + encodeURIComponent(this.item.invitation_token)
        },
    },
})
