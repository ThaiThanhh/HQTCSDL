const homeController = require('../controllers/home.C')
const express = require('express')
const route = express.Router()

route.get('/', homeController.index)
module.exports = route