const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const MongoDB_URI = "mongodb://localhost/laptop_shop"
const Port = 3001
const path = require("path")
const { shopRouter } = require("./routes/shop.routes")
const { adminRouter } = require("./routes/admin.router")
const { authRouter } = require('./routes/auth.router')
const session = require('express-session')
const { User } = require("./Models/user.model")
const MongoDBStore = require('connect-mongodb-session')(session)
const app = express()
const flash = require("connect-flash")
const csrf = require("csurf")

const store = new MongoDBStore({
    uri : MongoDB_URI,
    collection : 'session'
})

// middleWares

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(flash())

app.use(express.json())

// static files
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store : store
}))

const csrfProtection = csrf()

app.use(express.static(path.join(__dirname, 'public')))
app.use(csrfProtection);

// Set 

app.set('views', 'views')

app.set('template engine', 'ejs')

// authenticeted

app.use((req , res , next) => {
    if(!req.session.user){
        return next()
    }

    User.findById(req.session.user._id).then(user => {
        req.user = user
        next()
    }).catch(err => {
        console.log(err)
    })

})

// locals

app.use((req ,res , next) => {

    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    res.locals.errorMessage = req.flash('error')
    res.locals.successMessage = req.flash('success')
    if(req.session.isLoggedIn){
        res.locals.userType = req.session.user.userType
    }
    next()
})

// routes

app.use('/', shopRouter)
app.use('/admin', adminRouter)
app.use('/', authRouter)



// Connected to DataBase

mongoose.connect(MongoDB_URI).then(() => {
    app.listen(Port, () => {
        console.log(`listening to Port : ${Port}`)
    })
}).catch(err => {
    console.log(err);
})