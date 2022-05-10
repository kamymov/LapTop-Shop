const { User } = require("../Models/user.model")
const bcrypt = require("bcryptjs")


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

    if (password != confirmPass) {
        req.flash('error', 'مقادیر رمز عبور با هم برابر نیست...!')
        return res.redirect('/singup')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = new User({
        username: username,
        email: email,
        password: hashedPassword
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

module.exports = {
    getLogin,
    getSignUp,
    postSignUp,
    postLogin,
    logOut
}