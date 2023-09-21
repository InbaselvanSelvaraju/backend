class AppError{
    constructor(message,statuscode) {
        this.message = message,
        this.statuscode = statuscode,
        this.status = `${statuscode}`. startsWith('4') ? "fail" : "error";
        Error.captureStackTrace(this,this.constructor)  
    }
}

module.exports = AppError



