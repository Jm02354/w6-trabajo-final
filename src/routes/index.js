const express = require('express');
const { route } = require('./user.router');
const routerUser = require('./user.router');
const routerCategory = require('./category.router');
const routerProduct = require('./product.router');
const { verifyJwt } = require('../utils/verifyJWT');
const routerCart = require('./cart.router');
const routerPurchase = require('./purchase.router');
const routerProductId = require('./productImg.router');
const router = express.Router();

// Put the routes here
router.use('/users', routerUser)
router.use('/categories', routerCategory)
router.use('/products', routerProduct)
router.use('/cart', verifyJwt, routerCart)
router.use('/purchase', verifyJwt, routerPurchase)
router.use('/product_images', verifyJwt, routerProductId)

module.exports = router;