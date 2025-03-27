const { signup, verifyAccount, login } = require('../controllers/authController')

const userRouter = require('express').Router()


userRouter.post('/signup',signup)
userRouter.post('/verify',verifyAccount)
userRouter.post('/login',login)





module.exports = userRouter