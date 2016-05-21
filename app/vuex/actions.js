import { email_confirmation_url } from 'app/consts'


export const save_user = function(store, {email, first_name, last_name, phone}) {
    const current_user = store.state.user

    this.$control
        .save_user(
            email,
            first_name,
            last_name,
            phone,
            current_user.birthday,
            current_user.zcrm_id,
            email_confirmation_url,
            current_user.id
        )
        .catch(error => store.dispatch('SET_ERROR', error))
}

export const filter_users = function(store) {
    this.$control
        .filter_users()
        .then(users => store.dispatch('SET_USERS', users))
        .catch(error => store.dispatch('SET_ERROR', error))
}
