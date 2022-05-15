const express = require('express')
const {getLogin , getSignUp , postSignUp, postLogin, logOut, getprofile, editProfile} = require('../Controllers/auth.controller')

const authRouter = express.Router()

authRouter.get('/login' , getLogin)

authRouter.get('/signup' , getSignUp)

authRouter.post('/signup' , postSignUp)

authRouter.post('/login' , postLogin)

authRouter.get('/logout' , logOut)

authRouter.get('/profile' , getprofile)

authRouter.get('/editAccount' , editProfile)


module.exports={
    authRouter
}