const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const app = express();

if (process.env.NODE_ENVIRONMENT==='development') {
    app.use(morgan('dev'))
}
app.use(express.json())
app.use(express.static(`${__dirname}/public`))        // to send static files to client

// mounting the routers
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)

// if till now no route handlers catches it then its an undefined route
app.all('*',(req,res,next)=> {
    const err = new AppError(`Can't find this route ${req.originalUrl} on this server!!!`,404)
    next(err);      // it will call the error handler middleware this way
})
// error handler route
app.use(globalErrorHandler)

module.exports = app;

