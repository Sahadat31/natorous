const User = require('../models/userModels');
const AppError = require('../utils/appError');

const filterObj = (requestBody,...allowedFields) => {
    const newBody = {};
    Object.keys(requestBody).forEach(el => {
        if (allowedFields.includes(el)) newBody[el] = requestBody[el]
    })
    return newBody;
}
const getAllUsers = async(req,res,next) => {
    try {
        const users = await User.find()
        res.status(200).json({
            status: "Sucess",
            data: {
                users
            }
        })
    }catch(err) {
        return next(new AppError(err.message,409))
    }
}

const updateMe = async(req,res,next) => {
    try {
        // first check if the req body contains password, that won't be allowed
        if (req.body.password) return next(new AppError('This route is not for updating password',400))
        // filter req body to select which fields we want to update only
        const filteredBody = filterObj(req.body,"name","photo")
        // now update the document
        const updatedUser = await User.findByIdAndUpdate(req.user._id,filteredBody,{
            runValidators: true,
            new: true
        })
        res.status(200).json({
            status: 'Success',
            data:  {
                user: updatedUser
            }
        })
    } catch (err) {
        return next(new AppError(err.message,502))
    }
}
const deleteMe = async(req,res,next) => {
    // we will just set active property to false
    try {
        await User.findByIdAndUpdate(req.user._id,{active: false})
        res.status(204).json({
            status: 'Success',
            data: null
        })
    }catch(err) {
        return next(new AppError(err.message,502))
    }
}
const createUser = (req,res) => {
    res.status(500).json({
        status: "failure",
        message: "The route has not been defined yet."
    })
}
const getUser = (req,res) => {
    res.status(500).json({
        status: "failure",
        message: "The route has not been defined yet."
    })
}
const updateUser = (req,res) => {
    res.status(500).json({
        status: "failure",
        message: "The route has not been defined yet."
    })
}
const deleteUser = (req,res) => {
    res.status(500).json({
        status: "failure",
        message: "The route has not been defined yet."
    })
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe
}