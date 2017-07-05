var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');

router.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});

router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {title: 'Shopping Cart', products: productChunks,
                    successMsg: successMsg, noMessages: !successMsg});
    });
});

router.get('/add-to-cart/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart.items : {});  
    Product.findById(productId, function (err, product) {
    	if(err){
    		console.log(err);
    	}
        cart.add(product, product.id);
        req.session.cart = cart;
        // console.log(req.session.cart);
        res.redirect('/');
    });
});
router.get('/shopping-cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null});
    }
    // req.session.cart = null;
    var cart = new Cart(req.session.cart.items);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});
router.get('/checkout', function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: req.session.cart.totalPrice, errMsg: errMsg, 
        noError: !errMsg});
});

router.post('/checkout', function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart.items);

    var stripe = require("stripe")(
        "sk_test_3nr79opvJyPsNFo3pBj9Z2rK"
    );
    // console.log(req.session.cart);
    stripe.charges.create({
        amount: (cart.totalPrice * 100),
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        // asynchronously called
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        res.redirect('/');
    });
});

module.exports = router;