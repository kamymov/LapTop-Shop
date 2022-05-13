const express = require('express')
const { getAddProduct, postAddProduct, getAdminProduct, deleteProduct, editProduct, postEditProduct, getAdminUsers, deleteusers, adminAddAccount, adminSignUp, getAdminEditUsers, postUserEdit, adminOrders } = require('../Controllers/Admin.controller')

const adminRouter = express.Router()

adminRouter.get('/add/product' , getAddProduct)

adminRouter.post('/add/product' , postAddProduct)

adminRouter.get('/products' , getAdminProduct)

adminRouter.get('/delete-product/:prodId' , deleteProduct)

adminRouter.get('/edit-product/:prodId' , editProduct)

adminRouter.post('/edit-product' , postEditProduct)

adminRouter.get('/accounts' , getAdminUsers)

adminRouter.post('/delete-user' , deleteusers)

adminRouter.get('/addAccount' , adminAddAccount)

adminRouter.post('/signup' , adminSignUp)

adminRouter.get('/editAccount/:userId' , getAdminEditUsers)

adminRouter.post('/editAccount' , postUserEdit)

adminRouter.get('/orders' , adminOrders)

module.exports={
    adminRouter
}