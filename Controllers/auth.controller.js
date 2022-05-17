const { User } = require("../Models/user.model")
const bcrypt = require("bcryptjs")
const { Orders } = require('../Models/orders.model')
const { sendEmail } = require('../utils/email')
const crypto = require('crypto')

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
        return res.redirect('/signup')
    }

    const ExistUserEmail = await User.findOne({email : email})

    if(ExistUserEmail){
        req.flash('error' , 'این ایمیل قبلا ثبت نام کرده است...!')
        return res.redirect('/signup')
    }

    const ExistUserName = await User.findOne({username : username})
    
    if(ExistUserName){
        req.flash('error' , 'این نام کاربری قبلا ثبت نام کرده است...!')
        return res.redirect('/signup')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = new User({
        username: username,
        email: email,
        password: hashedPassword,
        adress: adress,
        postalCode: postalCode
    })

    await user.save()

    sendEmail({
        subject: 'ثبت نام',
        email: email,
        html: '<h1 class="text-center textprimary">شما با موفقیت ثبت نام کردید میتوانید وارد شوید روی <a href="localhost:3001/login">این لینک</a> کلیک کنید.</h1>'
    })

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

const getprofile = async (req, res) => {

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

    res.render('./Shop/profile.ejs', {
        path: '/profile',
        pageTitle: 'حساب کاربری',
        user: req.user,
        ordersLength: ordersLength.length,
        compeleteOrders: completeOrders.length,
        notcompleteOrders: notcompleteOrders.length
    })

}

const editProfile = async (req, res) => {


    res.render('./includes/Admin/addAccount.ejs', {
        path: '/editAccount',
        pageTitle: "ویرایش حساب کاربری",
        user: req.user,
        editing: true
    })


}

// forgot pass

const getForgotPass = async (req, res) => {

    res.render('./auth/forgotPass.ejs', {
        path: '/forgotPass',
        pageTitle: 'فراموشی رمزعبور',
    })


}

const postResetPass = async (req, res) => {

    const email = req.body.email

    crypto.randomBytes(32, (err, buf) => {

        if(err){
            console.log(err);
            return res.redirect('/login')
        }

        const token = buf.toString('hex')

        User.findOne({email : email}).then(async user => {

            if(!user){
                req.flash('error' , 'ایمیلی با چنین نامی وجود نداشت لطفا ایمیل دیگری وارد کنید...!')
                return res.redirect('/login')
            }

            user.set({
                resetToken : token,
                expiredResetToken : Date.now() + 3600000
            })

            return user.save()


        }).then(result => {
            res.redirect('/login')
            sendEmail({
                email : email,
                subject : 'بازیابی رمز عبور',
                html : `<p>برای بازیابی رمز عبور روی <a href='http://localhost:3001/resetPass/${token}'>روی این لینک</a> کلیک کنید</p>`
            })
        })

    })

}

const getTokenEmail = async (req ,res) => {

    const token = req.params.token

    User.findOne({
        resetToken : token,
        expiredResetToken : {$gt : Date.now()}
    }).then(user => {


        if(!user){
            req.flash('error' , 'زمان استفاده از توکن رمز عبور به پایان رسید...!')
            return res.redirect('/login')
        }   

        res.render('./auth/resetPass.ejs' , {
            path : '/reset-pass',
            pageTitle : 'رمزعبور جدید',
            userId : user._id
        })


    }).catch(err => {
        console.log(err);
        return res.redirect('/login')
    })



}

const postNewPass = async (req ,res) => {

    const userId = req.body.userId
    const password = req.body.password
    const confirmPass = req.body.conformPass

    // if(!password){
    //     req.flash('error' , 'مقادیر ورودی شما خالی بود...!')
    //     return res.redirect('/login')
    // }

    // if(!confirmPass){
    //     req.flash('error' , 'مقادیر ورودی شما خالی بود...!')
    //     return res.redirect('/login')
    // }

    if(password !== confirmPass){
        req.flash('error' , 'مقادیر پسورد شما با هم برابر نبود...!')
        return res.redirect('/')
    }
    
    const user = await User.findById(userId)

    if(!user){
        req.flash('error' , 'متاسفانه کاربر مورد نظر یافت نشد...!')
        return res.redirect('/login')
    }

    const hashedPassword = await bcrypt.hash(password , 12)

    user.set({
        password : hashedPassword
    })

    await user.save()

    req.flash('success' , 'مقدار پسورد شما با موفقیت عوض شد لطفا وارد شوید...!')

    sendEmail({
        subject : 'رمز عبور جدید',
        email : user.email,
        html : '<p>مقدار رمزعبور شما با موفقیت تغییر کرد<a href="http://localhost:3001/login"> ورود به سایت</a></p>'
    })

    return res.redirect('/login')

}

module.exports = {
    getLogin,
    getSignUp,
    postSignUp,
    postLogin,
    logOut,
    getprofile,
    editProfile,
    getForgotPass,
    postResetPass,
    getTokenEmail,
    postNewPass
}