class ApiResponce {
    constructor(statusCode, message="Success", data, success, errors) {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
        this.errors = errors
    }
}

export default ApiResponce;