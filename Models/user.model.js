const mongoose = require('mongoose')

const Schema = mongoose.Schema

const uesrSchema = new Schema({

    username : {
        type : String,
        required : true,
        minlength : 5
    },
    email : {
        type : String,
        match : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required : true,
        minlength : 10
    },
    userType:{
        type : Number,
        default : 1
    },
    password : {
        type : String , 
        required : true,
        minlength : 7
    },
    cart : {
        items : [{
            productId : {
                type : Schema.Types.ObjectId,
                ref : 'Product',
                required : true
            },
            quantity : {
                type : Number,
                default : 1
            }
        }]
    },
    date : {
        type : Date,
        default : Date.now()
    }


})

uesrSchema.methods.addToCart = function(product){

    const findIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString()
    })

    let newQuantity = 1;
    const updatedCartitems = [...this.cart.items]

    if(findIndex >= 0){
        newQuantity = this.cart.items[findIndex].quantity + 1;
        updatedCartitems[findIndex].quantity = newQuantity
    }else{
        updatedCartitems.push({
            productId : product._id,
            quantity : newQuantity
        })
    }

    const updatedCart = {
        items : updatedCartitems
    }

    this.cart = updatedCart;
    return this.save()

}

uesrSchema.methods.deleteCart = function(productId){

    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString()
    })

    this.cart.items = updatedCartItems;

    return this.save()

}

const User = mongoose.model('User' , uesrSchema)

module.exports={
    User
}