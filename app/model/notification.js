export const Info    = 'info'
export const Success = 'success'
export const Warning = 'warning'
export const Error   = 'error'


export class Notification {
    constructor({message, type=Info}) {
        this.message = message
        this.type    = type
    }

    static from_error(error) {
        const message = error.message
        const type    = Error
        return new Notification({message, type})
    }
}
