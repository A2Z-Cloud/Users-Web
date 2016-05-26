import { email_confirmation_url } from 'app/consts'


export const accept_invite = function(store, {token, email, password}) {
    return new Promise((resolve, reject) => {  // eslint-disable-line no-undef
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        this.$control
            .accept_invite(token, email, password, email_confirmation_url)
            .then(resolve)
            .catch(handle_error)
    })
}

export const save_user = function(store, {email, first_name, last_name, phone}) {
    return new Promise((resolve, reject) => {  // eslint-disable-line no-undef
        const current_user = store.state.user
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        this.$control
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
                current_user.id
            )
            .then(resolve)
            .catch(handle_error)
    })
}

export const change_password = function (store, {old_password, new_password}) {
    return new Promise((resolve, reject) => {  // eslint-disable-line no-undef
        const current_user = store.state.user
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        this.$control
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
                current_user.id
            )
            .then(resolve)
            .catch(handle_error)
    })
}

export const send_email_confirmation = function(store) {
    return new Promise((resolve, reject) => {  // eslint-disable-line no-undef
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        this.$control
            .send_email_confirmation(email_confirmation_url)
            .then(resolve)
            .catch(handle_error)
    })
}

export const filter_users = function(store) {
    return new Promise((resolve, reject) => {  // eslint-disable-line no-undef
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        this.$control
            .filter_users()
            .then(resolve)
            .catch(handle_error)
    })
}
