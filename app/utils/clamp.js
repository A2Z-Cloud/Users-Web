
export const clamp = function(min, value, max) {
    value = Math.min(value, max)
    value = Math.max(value, min)

    return value
}
