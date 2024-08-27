const { getAll, create, remove } = require('../controllers/productImg.controllers');
const express = require('express');
const upload = require('../utils/multer')

const routerProductId = express.Router();

routerProductId.route('/')
    .get(getAll)
    .post(upload.single('image'), create);

routerProductId.route('/:id')
    .delete(remove)

module.exports = routerProductId;