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
