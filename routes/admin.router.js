const express = require('express')
const { getAddProduct, postAddProduct, getAdminProduct, deleteProduct, editProduct, postEditProduct, getAdminUsers, deleteusers } = require('../Controllers/Admin.controller')

const adminRouter = express.Router()

adminRouter.get('/add/product' , getAddProduct)

adminRouter.post('/add/product' , postAddProduct)

adminRouter.get('/products' , getAdminProduct)

adminRouter.get('/delete-product/:prodId' , deleteProduct)

adminRouter.get('/edit-product/:prodId' , editProduct)

adminRouter.post('/edit-product' , postEditProduct)

adminRouter.get('/accounts' , getAdminUsers)

adminRouter.post('/delete-user' , deleteusers)

module.exports={
    adminRouter
}