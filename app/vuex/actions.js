import { email_confirmation_url, invite_url } from 'app/consts'
import { Notification } from 'app/model/notification'


function handle_reject(reject, store) {
    return error => {
        const notification = Notification.from_error(error)
        store.dispatch('NOTIFICATION_INSERT', notification)
        setTimeout(
            () => (store.dispatch('NOTIFICATION_DELETE', notification)),
            10000)
        reject(error)
    }
}

export const authenticate = function(store) {
    return new Promise((resolve, reject) => {
        const handle_error = error => (store.dispatch('ERROR_INSERT', error))
        store.control
             .get_current_user()
             .then(({user, auth_client_url}) => {
                 store.dispatch('CURRENT_USER_SET', user)
                 store.dispatch('AUTH_CLIENT_URL_SET', auth_client_url)
                 if (user) resolve(user)
                 else reject(auth_client_url)
             })
             .catch(handle_error)
    })
}

export const delete_notification = function(store, notification) {
    store.dispatch('NOTIFICATION_DELETE', notification)
}

export const accept_invite = function(store, {token, email, password}) {
    return new Promise((resolve, reject) => {
        store.control
             .accept_invite(token, email, password, email_confirmation_url)
             .then(resolve)
             .catch(handle_reject(reject, store))
    })
}

export const confirm_email = function(store, {token}) {
    return new Promise((resolve, reject) => {
        store.control
             .confirm_email(token)
             .then(resolve)
             .catch(handle_reject(reject, store))
    })
}

export const save_user = function(store, {email, first_name, last_name, phone}) {
    return new Promise((resolve, reject) => {
        const current_user = store.state.user
        store.control
             .save_user(
                 email,
                 first_name,
                 last_name,
                 null,
                 null,
                 phone,
                 current_user.birthday,
                 current_user.zcrm_id,
                 email_confirmation_url,
                 current_user.id)
             .then(resolve)
             .catch(handle_reject(reject, store))
    })
}

export const change_password = function (store, {old_password, new_password}) {
    return new Promise((resolve, reject) => {
        const current_user = store.state.user
        store.control
             .save_user(
                 current_user.email,
                 current_user.first_name,
                 current_user.last_name,
                 old_password,
                 new_password,
                 current_user.phone,
                 current_user.birthday,
                 current_user.zcrm_id,
                 null,
                 current_user.id)
             .then(resolve)
             .catch(handle_reject(reject, store))
    })
}

export const send_email_confirmation = function(store) {
    return new Promise((resolve, reject) => {
        store.control
             .send_email_confirmation(email_confirmation_url)
             .then(resolve)
             .catch(handle_reject(reject, store))
    })
}

export const filter_users = function(store, {term=null, offset=0, limit=20, order_by='last_name'}={}) {
    return new Promise((resolve, reject) => {
        const handle_success = users => {
            users.forEach(u => store.dispatch('USER_UPDATE', u))
            resolve(users)
        }
        store.control
             .filter_users(term, offset, limit, order_by)
             .then(handle_success)
             .catch(handle_reject(reject, store))
    })
}

export const filter_services = function(store, {term=null, offset=0, limit=20, order_by='name'}={}) {
    return new Promise((resolve, reject) => {
        const handle_success = services => {
            services.forEach(s => store.dispatch('SERVICE_UPDATE', s))
            resolve(services)
        }
        store.control
             .filter_services(term, offset, limit, order_by)
             .then(handle_success)
             .catch(handle_reject(reject, store))
    })
}

export const filter_groups = function(store, {user_id=null, term=null, offset=0, limit=20, order_by='name'}={}) {
    return new Promise((resolve, reject) => {
        const handle_success = groups => {
            groups.forEach(g => store.dispatch('GROUP_UPDATE', g))
            resolve(groups)
        }
        store.control
             .filter_groups(user_id, term, offset, limit, order_by)
             .then(handle_success)
             .catch(handle_reject(reject, store))
    })
}

export const filter_zoho_groups = function(store, {service='crm', term=null, offset=0, limit=20}={}) {
    return new Promise((resolve, reject) => {
        const handle_success = groups => {
            groups.forEach(g => store.dispatch('ZOHO_GROUP_UPDATE', g))
            resolve(groups)
        }
        store.control
             .filter_zoho_groups(service, term, offset, limit)
             .then(handle_success)
             .catch(handle_reject(reject, store))
    })
}

export const invite_user = function(store, {email, first_name, last_name, phone=null, birthday=null, zcrm_id, send_email_invite=true}) {
    return new Promise((resolve, reject) => {
        store.control
             .invite_user(
                 email,
                 first_name,
                 last_name,
                 phone,
                 birthday,
                 zcrm_id,
                 invite_url,
                 send_email_invite)
             .then(resolve)
             .catch(handle_reject(reject, store))
    })
}

export const save_service = function(store, {name, secret, cors, sign_in_url, sign_out_url}) {
    return new Promise((resolve, reject) => {
        store.control
             .save_service(
                 name,
                 secret,
                 cors,
                 sign_in_url,
                 sign_out_url)
             .then(resolve)
             .catch(handle_reject(reject, store))
    })
}

export const save_group = function(store, {name, zcrm_id=null, zprojects_id=null, zsupport_id=null, id=null}) {
    return new Promise((resolve, reject) => {
        store.control
             .save_group(
                 name,
                 zcrm_id,
                 zprojects_id,
                 zsupport_id,
                 id)
             .then(resolve)
             .catch(handle_reject(reject, store))
    })
}

export const get_group = function(store, {id=null, name=null}) {
    return new Promise((resolve, reject) => {
        const handle_success = group => {
            store.dispatch('GROUP_UPDATE', group)
            resolve(group)
        }
        store.control
             .get_group(id, name)
             .then(handle_success)
             .catch(handle_reject(reject, store))
    })
}


export const get_membership = function(store, {group_id=null, group_name=null}) {
    return new Promise((resolve, reject) => {
        const handle_success = memberships => {
            memberships.forEach(m => store.dispatch('MEMBERSHIP_UPDATE', m))
            resolve(memberships)
        }
        store.control
             .get_membership(group_id, group_name)
             .then(handle_success)
             .catch(handle_reject(reject, store))
    })
}

export const save_membership = function(store, {id=null, user_id, group_id, permission='member'}) {
    return new Promise((resolve, reject) => {
        store.control
             .save_membership(user_id, group_id, permission, id)
             .then(resolve)
             .catch(handle_reject(reject, store))
    })
}

export const delete_membership = function(store, id) {
    return new Promise((resolve, reject) => {
        store.control
             .delete_membership(id)
             .then(resolve)
             .catch(handle_reject(reject, store))
    })
}
