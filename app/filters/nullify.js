import Vue from 'vue'


Vue.filter('nullify', {
    read(value) {
        return value
    },
    write(value) {
        value = (value === '') ? null : value
        return value
    },
})
