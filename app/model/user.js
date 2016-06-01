import { invitation_url } from 'app/consts'


export class User {

    constructor({id=null, email=null, first_name=null, last_name=null, invitation_token=null}={}) {
        this.id               = id
        this.email            = email
        this.first_name       = first_name
        this.last_name        = last_name
        this.invitation_token = invitation_token
    }

    invite_url() {
        if (!this.invitation_token) return null
        return encodeURI(invitation_url + '?email=' + this.email + '&token=' + this.invitation_token)
    }

    accepted_invite() {
        return !this.invitation_token
    }
    
}

export class Admin extends User {

}
