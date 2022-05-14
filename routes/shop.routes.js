const express = require("express")
const { MainPage , getProduct, getProductDetails, searchEngine, addToCart, getCart , deleteProduct, postOrders } = require("../Controllers/shop.contoller")
const shopRouter = express.Router()


shopRouter.get('/' , MainPage)

shopRouter.get('/products' , getProduct)

shopRouter.get('/product-details/:prodId' , getProductDetails)

shopRouter.post('/search-engine' , searchEngine)

shopRouter.get('/shop-cart' , getCart)

shopRouter.post('/addToCart' , addToCart)

shopRouter.post('/cart-delete' , deleteProduct)

shopRouter.post('/create-order' , postOrders)

module.exports={
    shopRouter
}