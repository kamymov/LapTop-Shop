const { Orders } = require("../Models/orders.model")
const { Product } = require("../Models/product.model")


const MainPage = async (req, res) => {

    const product = await Product.find()

    res.render('./index.ejs', {
        path: "/",
        pageTitle: "صفحه اصلی",
        prods: product,
    })
}

const getProduct = async (req, res) => {

    const product = await Product.find()

    res.render('./Shop/products.ejs', {
        path: "/products",
        pageTitle: "محصولات",
        prod: product,
    })

}

const getProductDetails = async (req, res) => {

    const prodId = req.params.prodId

    const product = await Product.findOne({ _id: prodId })

    if (!product) {
        return res.redirect('/')
    }

    res.render('./Shop/product-details.ejs', {
        path: '/product-details',
        pageTitle: product.title,
        prod: product
    })


}

const searchEngine = async (req, res) => {

    const search = req.body.search_input.trim().toLowerCase();

    if (!search) {
        return res.redirect('/')
    }

    const searchArray = search.split(' ')

    const product = await Product.find().select({ title: 1 })

    const findProduct = []

    product.forEach(e => {

        for (let i = 0; i <= product.length; i++) {
            if (e.title.toLowerCase().includes(searchArray[i])) {
                const findIndex = findProduct.findIndex(f => {
                    return f.id.toString() === e._id.toString()
                })
                if (findIndex >= 0) {
                    findProduct[findIndex].quantity = findProduct[findIndex].quantity + 1
                } else {
                    findProduct.push({ id: e._id.toString(), quantity: 1 })
                }
            }
        }


    });


    for (let i = 0; i < findProduct.length - 1; i++) {
        if (findProduct[i].quantity >= findProduct[i + 1].quantity) {

        } else {
            const temp = findProduct[i + 1]
            findProduct[i + 1] = findProduct[i]
            findProduct[i] = temp
            if (findProduct[i].quantity < findProduct[i - 1].quantity) {

            } else {
                const tempp = findProduct[i - 1]
                findProduct[i - 1] = findProduct[i]
                findProduct[i] = tempp
            }
        }
    }

    const Prod = []

    findProduct.forEach(prod => {
        Prod.push(prod.id)
    });

    const finallProduct = []

    for (let i = 0; i < Prod.length; i++) {
        const product = await Product.findOne({ _id: Prod[i] })

        finallProduct.push(product)

    }

    res.render('./Shop/products.ejs', {
        path: '',
        pageTitle: 'جستجو برای محصولات',
        prod: finallProduct
    })

}

const getCart = async (req, res) => {

    const user = await req.user.populate('cart.items.productId')

    res.render('./Shop/cart.ejs', {
        path: '/shop-cart',
        pageTitle: 'سبد خرید',
        product: user.cart.items
    })


}

const addToCart = (req, res) => {

    const productId = req.body.prodId

    Product.findById(productId).then(prod => {
        res.redirect('/shop-cart')
        req.user.addToCart(prod)
    })


}

const deleteProduct = (req, res) => {

    const productId = req.body.prodId
    res.redirect('/shop-cart')
    req.user.deleteCart(productId)


}

const postOrders = async (req, res) => {

    req.user.populate('cart.items.productId')
        .then(user => {

            const product = user.cart.items.map(c => {
                return {
                    quantity: c.quantity,
                    product: { ...c.productId._doc }
                }
            })

            const order = new Orders({
                user: {
                    name: req.user.username,
                    userId: req.user._id
                },
                products: product,
            })

            order.save()



        }).then(() => {
            req.user.clearCart()
        }).catch(err => {
            console.log(err);
            req.flash('error', 'متاسفانه سفارش شما به دلایل نامعلوم ثبت نشد لطفا با پشتیبانی تماس بگیرید...!')
        })

    req.flash('success', 'سفارش شما با موفقیت ثبت شد...!')

    return res.redirect('/shop-cart')


}

module.exports = {
    MainPage,
    getProduct,
    getProductDetails,
    searchEngine,
    getCart,
    addToCart,
    deleteProduct,
    postOrders
}