const express = require('express')
const {getLogin , getSignUp , postSignUp, postLogin, logOut} = require('../Controllers/auth.controller')

const authRouter = express.Router()

authRouter.get('/login' , getLogin)

authRouter.get('/signup' , getSignUp)

authRouter.post('/signup' , postSignUp)

authRouter.post('/login' , postLogin)

authRouter.get('/logout' , logOut)

module.exports={
    authRouter
}