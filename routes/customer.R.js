const express = require('express')
const route = express.Router()
const customerController = require('../controllers/customer.C')

route.get('/',customerController.viewSupplierList)
route.get('/:cusID/productList', customerController.viewProductList)
route.get('/:cusID/orderList', customerController.viewOrderList)

module.exports = route