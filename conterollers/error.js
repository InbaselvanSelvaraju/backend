const AppError = require('../utilitis/appError')

const handleCastErrorDB = (err) => {
    const message = `Invalid Pth ${err.path}:${err.value}`;
    return new AppError(message, 400)
};

const handleDuplicateKeyErrorDB = (err, res) => {
    const message = "email is already exist"
    return new AppError(message, 400)
};
const handleValidationError = (err,res) => {
    const message = Object.values(err.errors).map(el => el.message)
    return new AppError(message,400)
}

const senderrorResponsre = (err, res) => {
    res.status(err.statuscode).json({
        status: err.status,
        error: err.name,
        message: err.message,
        error: err,
        err : err
        
    })
};

module.exports = (err,req,res,next) => {
    err.statuscode = err.statuscode || 500,
        err.status = err.status || "error"
    
   
    if (err.name ==="CastError") {
       err = handleCastErrorDB(err) 
    };
    if (err.code === 11000) {
        err = handleDuplicateKeyErrorDB(err)
    }
    if (err.name ==="ValidationError") {
        err =handleValidationError(err)
    }
    senderrorResponsre(err,res)
}