const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
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
app.all('*',(req,res)=> {
    res.status(404).json({
        status: 'Failure',
        message: `Can't find this route ${req.originalUrl} on this server!!!`
    })
})

module.exports = app;

