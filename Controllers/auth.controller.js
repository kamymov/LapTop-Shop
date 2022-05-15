const { User } = require("../Models/user.model")
const bcrypt = require("bcryptjs")
const { Orders } = require('../Models/orders.model')

// login

const getLogin = (req, res) => {



    res.render('./auth/login.ejs', {
        path: '/login',
        pageTitle: 'ورود',
    })


}

const postLogin = async (req, res) => {

    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    if (!username) {
        req.flash('error', 'نام کاربری خالی است...!')
        return res.redirect('/login')
    }

    if (!email) {
        req.flash('error', 'ایمیل خالی است...!')
        return res.redirect('/login')
    }

    if (!password) {
        req.flash('error', 'رمز عبور خالی است...!')
        return res.redirect('/login')
    }

    const user = await User.findOne({ username: username, email: email })

    if (!user) {
        return res.redirect('/login')
    }

    bcrypt.compare(password, user.password).then(isMatch => {

        if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user
            req.flash('success', 'شما با موفقیت وارد شدید...!')
            return res.redirect('/')
        } else {
            req.flash('error', 'رمز عبور اشتباه است...!')
            return res.redirect('/login')
        }

    })

}

// signup


const getSignUp = (req, res) => {

    res.render('./auth/singup.ejs', {
        path: '/singup',
        pageTitle: 'ثبت نام'
    })


}

const postSignUp = async (req, res) => {

    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const confirmPass = req.body.confirmPass
    const adress = req.body.adress
    const postalCode = req.body.postalCode

    if (!username) {
        req.flash('error', 'مقادیر ورودی شما خالی بود...!')
        return res.redirect('/signup')
    }
    if (!email) {
        req.flash('error', 'مقادیر ورودی شما خالی بود...!')

        return res.redirect('/signup')
    }
    if (!password) {
        req.flash('error', 'مقادیر ورودی شما خالی بود...!')
        return res.redirect('/signup')
    }
    if (!confirmPass) {
        req.flash('error', 'مقادیر ورودی شما خالی بود...!')
        return res.redirect('/signup')
    }

    if (!adress) {
        req.flash('error', 'مقادیر ورودی شما خالی بود...!')
        return res.redirect('/signup')
    }

    if (!postalCode) {
        req.flash('error', 'مقادیر ورودی شما خالی بود...!')
        return res.redirect('/signup')
    }

    if (password != confirmPass) {
        req.flash('error', 'مقادیر رمز عبور با هم برابر نیست...!')
        return res.redirect('/singup')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = new User({
        username: username,
        email: email,
        password: hashedPassword,
        adress : adress,
        postalCode : postalCode
    })

    await user.save()

    req.flash('success', 'حساب کاربری با موفقیت ثبت شد لطفا مجددا وارد شوید...!')

    return res.redirect('/login')


}

const logOut = async (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/login')
        }
    })


}

// profile

const getprofile = async (req ,res) => {

    const orders = await Orders.find().populate('user.userId')

    const ordersLength = orders.filter(f => {
        return f.user.userId._id.toString() === req.user._id.toString()
    })

    const completeOrders = ordersLength.filter(f => {
        return f.level === 4
    })

    const notcompleteOrders = ordersLength.filter(f => {
        return f.level !== 4
    })

    res.render('./Shop/profile.ejs' , {
        path : '/profile',
        pageTitle : 'حساب کاربری',
        user : req.user,
        ordersLength : ordersLength.length,
        compeleteOrders : completeOrders.length,
        notcompleteOrders : notcompleteOrders.length
    })

}

const editProfile = async (req ,res) => {

    
    res.render('./includes/Admin/addAccount.ejs' , {
        path : '/editAccount',
        pageTitle : "ویرایش حساب کاربری",
        user : req.user,
        editing : true
    })


}


module.exports = {
    getLogin,
    getSignUp,
    postSignUp,
    postLogin,
    logOut,
    getprofile,
    editProfile
}