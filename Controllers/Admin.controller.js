const { Product } = require("../Models/product.model")

const getAddProduct = (req ,res) => {

    res.render('./includes/Admin/addPRoduct.ejs' , {
        path : "/admin/add/product",
        pageTitle : "افزودن محصولات",
        editing : false,
    })


}

const postAddProduct = async (req , res) => {

    const title = req.body.title.trim()
    const price = req.body.price.trim()
    const imageURL = req.body.imageURL.trim()
    const discription = req.body.discription.trim()
    const quantity = req.body.quantity.trim()

    const newProduct = new Product({
        title : title,
        price : price,
        imageURL : imageURL,
        discription : discription,
        quantity : quantity
    })

    await newProduct.save()

    req.flash('success' , 'محصول با موفقیت اضافه شد...!')

    res.redirect('/products')

}

const getAdminProduct = async (req , res) => {

    const product = await Product.find()

    res.render('./includes/Admin/adminProducts.ejs' , {
        path : '/admin/products',
        pageTitle : 'محصولات ادمین',
        prod : product,
    })

}

const deleteProduct = async (req , res) => {

    const prodId = req.params.prodId
    
    if(!prodId){
        return res.redirect('/admin/products')
    }
    
    await Product.findOneAndDelete({_id : prodId})

    req.flash('success' , 'محصول با موفقیت حذف شد...!')

    res.redirect('/products')
}

const editProduct = async (req , res) => {

    const prodId = req.params.prodId

    if(!prodId){
        return res.redirect('/admin/products')
    }

    const product = await Product.findOne({_id : prodId})

    res.render('./includes/Admin/addProduct.ejs' , {
        path : '/admin/edit/product',
        pageTitle : 'ویرایش محصول',
        editing : true,
        prod : product
    })

}

const postEditProduct = async (req , res) => {

    const prodId = req.body.prodId
    const title = req.body.title
    const imageURL = req.body.imageURL
    const price = req.body.price
    const quantity = req.body.quantity

    const product = await Product.findOne({_id : prodId})

    if(!product){
        req.flash('error' , 'محصول مورد نظر یافت نشد...!')
        return res.redirect('/admin/products')
    }

    product.set({
        title : title,
        imageURL : imageURL,
        price : price,
        quantity : quantity 
    })

    product.save().then(() => {
        req.flash('success' , 'محصول با موفقیت ویرایش شد...!')
        res.redirect('/admin/products')
    })


}

module.exports={
    getAddProduct,
    postAddProduct,
    getAdminProduct,
    deleteProduct,
    editProduct,
    postEditProduct
}