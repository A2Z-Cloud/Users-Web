const password_requirements = {
    min_length: 8,
}

export const password_errors = function(password) {
    const {min_length} = password_requirements
    const errors       = []
    if (password && password.length < min_length) {
        errors.push('Passwords must be at least ' + min_length + ' characters long.')
    }
    return errors
}

export const valid_email = function(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}
