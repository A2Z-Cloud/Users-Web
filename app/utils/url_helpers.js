// HELPER FUNCTIONS FOR URL QUERYS AND DOMAINS //

export const get_query_param = function(name, url) {
    // get url from window if not set
    if (!url) url = window.location.href

    // remove escaped characters from key
    name = name.replace(/[\[\]]/g, "\\$&")

    // search for key in url
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url)

    // return result of search
    if (!results) return null           // return null for missing key
    if (!results[2]) return ''          // return empty string for missing value
    return decodeURIComponent(          // return decoded value
        results[2].replace(/\+/g, " ")
    )
}

const get_url_domain = function(url) {
    // find and remove protocol (http, ftp, etc.) and get domain for each url
    if (url.indexOf("://") > -1) {
        return url.split('/')[2]
    }

    return url.split('/')[0]
}

export const url_domain_match = function(primary_url,secondary_url) {
    return (get_url_domain(primary_url) === get_url_domain(secondary_url))
}

export const create_sign_out_url = function({auth_client_url, router_mode, redirect_path}) {
    // Take the user to the A2Z Auth with a redirect to the
    // auth sign in page after they sign out.
    // Additionally after they sign in again have the next
    // parameter be set back to this url
    const delimiter   = router_mode === 'hash' ? '/#!' : ''
    const current_url = window.location.protocol + '//' + window.location.host + delimiter + redirect_path
    const sign_in_url_return = auth_client_url + '?next=' + encodeURIComponent(current_url)

    return auth_client_url + '/sign-out?next=' + encodeURIComponent(sign_in_url_return)
}
