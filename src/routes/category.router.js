const { getAll, create, getOne, remove, update } = require('../controllers/category.controllers');
const express = require('express');
const { verifyJwt } = require('../utils/verifyJWT');

const routerCategory = express.Router();

routerCategory.route('/')
    .get(getAll)
    .post(verifyJwt, create);

routerCategory.route('/:id')
    .get(getOne)
    .delete(verifyJwt, remove)
    .put(update);

module.exports = routerCategory;