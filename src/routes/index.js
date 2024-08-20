const express = require('express');
const { route } = require('./user.router');
const routerUser = require('./user.router');
const router = express.Router();

// Put the routes here
router.use('/users', routerUser)

module.exports = router;