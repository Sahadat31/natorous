const express = require('express');
const {getAllUsers, getUser, createUser, updateUser, deleteUser} = require('../controllers/userController')
const {signup,login,forgotPassword,resetPassword} = require('../controllers/authController')
const userRouter = express.Router();

userRouter.post('/signup',signup)
userRouter.post('/login',login)
userRouter.post('/forgotpassword',forgotPassword)
userRouter.patch('/resetpassword/:token',resetPassword)
userRouter.route('/').get(getAllUsers).post(createUser)
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = userRouter;