const express = require('express')
const {getLogin , getSignUp , postSignUp, postLogin, logOut, getprofile, editProfile, getForgotPass, postResetPass, getTokenEmail, postNewPass} = require('../Controllers/auth.controller')

const authRouter = express.Router()

authRouter.get('/login' , getLogin)

authRouter.get('/signup' , getSignUp)

authRouter.post('/signup' , postSignUp)

authRouter.post('/login' , postLogin)

authRouter.get('/logout' , logOut)

authRouter.get('/profile' , getprofile)

authRouter.get('/editAccount' , editProfile)

authRouter.get('/resetPass' , getForgotPass)

authRouter.post('/resetPass' , postResetPass)

authRouter.get('/resetPass/:token' , getTokenEmail)

authRouter.post('/newPass' , postNewPass)

module.exports={
    authRouter
}