const adminVirtify = (req, res , next) => {

    if (req.user.userType === 1) {
        res.redirect('/products')
        next()
    }else {
        next()
    }


}

module.exports = {
    adminVirtify
}