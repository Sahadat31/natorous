const User = require('../models/userModels');
const AppError = require('../utils/appError');
const getAllUsers = async(req,res,next) => {
    try {
        const users = await User.find()
        res.status(500).json({
            status: "Sucess",
            data: {
                users
            }
        })
    }catch(err) {
        return next(new AppError(err.message,409))
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
    deleteUser
}