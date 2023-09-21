const express = require("express")
const morgan = require("morgan")
const app = express()
const userRoutes = require("./routes/users")
const productRoutes = require("./routes/product")
const GlobalError = require('./conterollers/error')

app.use(express.json())
// middleware
app.use(morgan('dev'))

app.use((req,res,next) => {
    req.requstTime = new Date().toISOString()
    next()
})

// routes
app.use('/api/users', userRoutes)
app.use('/api/products',productRoutes)

// unhandled routes
app.all("*",(req,res,next) => {
    res.status(404).json({
        status: 'success',
        message : `cannot find${req.originalUrl} in the server`
    })
})
// global error handling
/*app.use((err,req,res,next) => {
    err.statusCode = err.stauscode || 500
    err.status = err.status || 'error'
    // err.message = " it is global error"

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        // error:err

    })
})
*/

app.use(GlobalError)

module.exports = app;




