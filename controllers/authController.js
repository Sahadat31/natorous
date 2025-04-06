const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const AppError = require('../utils/appError');

const signup = async(req,res,next) => {
    try {
        const newUser = await User.create({
            name:req.body.name,
            email:req.body.email,
            role: req.body.role,
            password:req.body.password,
            passwordChangedAt: req.body.passwordChangedAt
        })
        const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
        res.status(201).json({
            status: 'Success',
            token,
            data: {
                user: {
                    id: newUser.id,
                    name: newUser.email
                }
            }
        })
    } catch(err) {
        return next(new AppError(err.message,409))
    }
}

const login = async(req,res,next) => {
    try {
        // get email and password
        const {email,password} = req.body;
        // check if email and password is present
        if (!email || !password) return next(new AppError('Provide email and password!',400));
        // check if email and password is valid
        const user = await User.findOne({email}).select('+password') // as password select is set to false in model
        if (!user || !(await user.comparePassword(String(password)))) {
            return next(new AppError('Incorrect email or password', 401));
        }
        // if valid sign token and send
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
        res.status(200).json({
            status: 'Success',
            data: {
                token
            }
        })
    } catch(err) {
        return next(new AppError(err.message,409))
    }
}

const protectRoutes = async(req,res,next) => {
    try{
        // check if token is present
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        if (!token) return next(new AppError('You are not logged in! Please log in to proceed.',401))
        // verify token
        const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET_KEY)
        // check if user still exists
        const logged_user = await User.findById(decoded.id)
        if (!logged_user) {
            return next(new AppError('The user with this token doesnot exist anymore!',401))
        }
        // check if the user has recently changed password after token is issued
        if (logged_user.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('Password changed after token is issued. Please login again!',401))
        }
        // GRANT ACCESS
        req.user = logged_user;
        next();
    }catch(err) {
        return next(new AppError(err.message,409))
    }
}
// function for authorization which will return a route handler
const restrict = (...roles) => {
    return (req,res,next) => {
        // roles is like an array which contains user roles like ['user','admin']
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have necessary authorization to perform this operation',401))
        }
        next();
    }
}

// route handler for forgot password
const forgotPassword = async(req,res,next)=> {
    try {
        // check if user exists
        const user = await User.findOne({email: req.body.email})
        if (!user) {
            return next(new AppError('There is no user with this email id',404))
        }
        // create reset token for the user
        const resetToken = user.createForgetPasswordToken()
        await user.save({validateBeforeSave: false})        // save encrypted resettoken and expiry time into db
        next();

    }catch(err) {
        return next(new AppError(err.message,409))
    }
}
// route handler for reset password

module.exports={
    signup,
    login,
    protectRoutes,
    restrict,
    forgotPassword
}