const express = require('express')
const { getAddProduct, postAddProduct, getAdminProduct, deleteProduct, editProduct, postEditProduct, getAdminUsers, deleteusers, adminAddAccount, adminSignUp, getAdminEditUsers, postUserEdit, adminOrders, completeSession } = require('../Controllers/Admin.controller')
const { adminVirtify } = require('../MiddleWares/virtify.middleWare')

const adminRouter = express.Router()

adminRouter.get('/add/product' , adminVirtify , getAddProduct)

adminRouter.post('/add/product' , adminVirtify , postAddProduct)

adminRouter.get('/products' , adminVirtify , getAdminProduct)

adminRouter.get('/delete-product/:prodId' , adminVirtify , deleteProduct)

adminRouter.get('/edit-product/:prodId' , adminVirtify , editProduct)

adminRouter.post('/edit-product' , adminVirtify , postEditProduct)

adminRouter.get('/accounts' , adminVirtify , getAdminUsers)

adminRouter.post('/delete-user' , adminVirtify , deleteusers)

adminRouter.get('/addAccount' , adminVirtify , adminAddAccount)

adminRouter.post('/signup' , adminVirtify , adminSignUp)

adminRouter.get('/editAccount/:userId' , adminVirtify , getAdminEditUsers)

adminRouter.post('/editAccount' , postUserEdit)

adminRouter.get('/orders' , adminVirtify , adminOrders)

adminRouter.post('/compelete-session' , adminVirtify , completeSession)


module.exports={
    adminRouter
}