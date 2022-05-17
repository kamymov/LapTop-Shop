const { Product } = require("../Models/product.model")
const { User } = require("../Models/user.model")
const bcrypt = require('bcryptjs')
const { Orders } = require("../Models/orders.model")
const e = require("connect-flash")

// add product

const getAddProduct = (req, res) => {

    res.render('./includes/Admin/addPRoduct.ejs', {
        path: "/admin/add/product",
        pageTitle: "افزودن محصولات",
        editing: false,
    })


}

const postAddProduct = async (req, res) => {

    const title = req.body.title.trim()
    const price = req.body.price.trim()
    const imageURL = req.body.imageURL.trim()
    const discription = req.body.discription.trim()
    const quantity = req.body.quantity.trim()

    const newProduct = new Product({
        title: title,
        price: price,
        imageURL: imageURL,
        discription: discription,
        quantity: quantity
    })

    await newProduct.save()

    req.flash('success', 'محصول با موفقیت اضافه شد...!')

    res.redirect('/products')

}

// edit product

const getAdminProduct = async (req, res) => {

    const product = await Product.find()

    res.render('./includes/Admin/adminProducts.ejs', {
        path: '/admin/products',
        pageTitle: 'محصولات ادمین',
        prod: product,
    })

}

const deleteProduct = async (req, res) => {

    const prodId = req.params.prodId

    if (!prodId) {
        return res.redirect('/admin/products')
    }

    await Product.findOneAndDelete({ _id: prodId })

    req.flash('success', 'محصول با موفقیت حذف شد...!')

    res.redirect('/products')
}

const editProduct = async (req, res) => {

    const prodId = req.params.prodId

    if (!prodId) {
        return res.redirect('/admin/products')
    }

    const product = await Product.findOne({ _id: prodId })

    res.render('./includes/Admin/addProduct.ejs', {
        path: '/admin/edit/product',
        pageTitle: 'ویرایش محصول',
        editing: true,
        prod: product
    })

}

const postEditProduct = async (req, res) => {

    const prodId = req.body.prodId
    const title = req.body.title
    const imageURL = req.body.imageURL
    const price = req.body.price
    const quantity = req.body.quantity

    const product = await Product.findOne({ _id: prodId })

    if (!product) {
        req.flash('error', 'محصول مورد نظر یافت نشد...!')
        return res.redirect('/admin/products')
    }

    product.set({
        title: title,
        imageURL: imageURL,
        price: price,
        quantity: quantity
    })

    product.save().then(() => {
        req.flash('success', 'محصول با موفقیت ویرایش شد...!')
        res.redirect('/admin/products')
    })


}

// add or edit users

const getAdminUsers = async (req, res) => {

    const user = await User.find()

    const adminSelf = user.filter(f => {
        return f._id.toString() === req.user._id.toString()
    })

    const limitUser = user.filter(f => {
        return f.userType !== 3
    })

    limitUser.unshift(adminSelf[0])

    res.render('./includes/Admin/users.ejs', {
        path: '/admin/account',
        pageTitle: 'حساب های کاربری',
        users: limitUser,
        userType: req.user.userType
    })


}

const deleteusers = async (req, res) => {

    const userId = req.body.userId

    User.findByIdAndDelete(userId).then(() => {
        req.flash('success', 'کاربر مورد نظر با موفقیت پاک شد...!')
        return res.redirect('/admin/accounts')
    }).catch(err => {
        console.log(err);
        req.flash('error', 'متاسفانه عملیات شما با خطا مواجه شد...!')
        return res.redirect('/admin/accounts')
    })

}

const adminAddAccount = async (req, res) => {

    res.render('./includes/Admin/addAccount.ejs', {
        path: '/admin/addAccount',
        pageTitle: 'افزودن کاربر',
        userType: req.user.userType,
        editing: false
    })


}

const adminSignUp = async (req, res) => {

    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const userType = req.body.userType

    if (!username) {
        req.flash('error', 'مقدار نام کاربری خالی است')
        return res.redirect('/admin/addAccount')
    }
    if (!email) {
        req.flash('error', 'مقدار ایمیل خالی است')
        return res.redirect('/admin/addAccount')
    }
    if (!password) {
        req.flash('error', 'مقدار رمز عبور خالی است')
        return res.redirect('/admin/addAccount')
    }

    const userExist = await User.find().or([
        { username: username },
        { email: email }
    ])

    if (userExist.length > 0) {
        req.flash('error', 'متاسفانه ایمیل یا نام کاربری موجود است...!')
        return res.redirect('/admin/addAccount')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
        userType: userType
    })

    await newUser.save()

    return res.redirect('/admin/accounts')

}

const getAdminEditUsers = async (req, res) => {

    const userId = req.params.userId

    const user = await User.findById(userId)

    if (!user) {
        req.flash('error', 'هیچ کاربری یافت نشد...!')
        return res.redirect('/admin/accounts')
    }

    res.render('./includes/Admin/addAccount.ejs', {
        path: "admin/editAcount",
        pageTitle: 'ویرایش کاربر',
        editing: true,
        user: user
    })


}

const postUserEdit = async (req, res) => {

    const userId = req.body.userId
    const username = req.body.username
    const email = req.body.email
    const userType = req.body.userType
    const adress = req.body.adress
    const postalCode = req.body.postalCode

    if(req.user.userType <= 2){
        if(req.user._id.toString() !== userId.toString()){
            req.flash('error' , 'متاسفانه شما قادر به انجام این عملیات نیستید...!')
            return res.redirect('/')
        }
    }

    if (!username) {
        req.flash('error', 'نام کاربری ارسال نشده است')
        return res.redirect('/admin/accounts')
    }
    if (!email) {
        req.flash('error', 'ایمیل ارسال نشده است')
        return res.redirect('/admin/accounts')
    }

    const user = await User.findById(userId)

    if (!user) {
        req.flash('error', 'متاسفانه کاربر مورد نظر یافت نشد...!')
        return res.redirect('/admin/accounts')
    }

    user.set({
        username: username,
        email: email,
        userType: userType,
        adress : adress,
        postalCode : postalCode
    })

    await user.save()

    if(req.user.userType <= 2){
        return res.redirect('/profile')
    }else{
        return res.redirect('/admin/accounts')
    }

}

 // admin orders

const adminOrders = async (req ,res) => {

    const orders = await Orders.find()

    res.render('./includes/Admin/orders.ejs' , {
        path : '/admin/orders',
        pageTitle : 'سفارشات',
        orders : orders
    })

}

// orders session

const completeSession = async (req , res) => {

    const userId = req.body.userId
    const level = req.body.level


    if(!userId){
        req.flash('error' , 'متاسفانه نام کاربری ارسال نشده است...!')
        return res.redirect('/admin/orders')
    }
    
    const order = await Orders.findById(userId)

    if(!order){
        req.flash('error' , 'متاسفانه سفارش مورد نظر یافت نشد...!')
        return res.redirect('admin/orders')
    }

    await order.set({
        level : level
    })

    req.flash('success' , 'مرحله با موفقیت انجام شد...!')

    await order.save()

    return res.redirect('/admin/orders')


}

module.exports = {
    getAddProduct,
    postAddProduct,
    getAdminProduct,
    deleteProduct,
    editProduct,
    postEditProduct,
    getAdminUsers,
    deleteusers,
    adminAddAccount,
    adminSignUp,
    getAdminEditUsers,
    postUserEdit,
    adminOrders,
    completeSession,
}