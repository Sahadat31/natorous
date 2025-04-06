const express = require('express');
const {getAllUsers, getUser, createUser, updateUser, deleteUser} = require('../controllers/userController')
const {signup,login,forgotPassword} = require('../controllers/authController')
const userRouter = express.Router();

userRouter.post('/signup',signup)
userRouter.post('/login',login)
userRouter.post('/forgotpassword',forgotPassword)
userRouter.route('').get(getAllUsers).post(createUser)
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = userRouter;