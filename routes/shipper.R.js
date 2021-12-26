const express = require('express')
const route = express.Router()
const shipperController = require('../controllers/shipper.C')

route.get('/', shipperController.viewOrderList)
route.get('/:shipperID/get', shipperController.getOrder)
route.get('/:shipperID/orderList', shipperController.viewMyOrders)
route.get('/:shipperID/updateOrder', shipperController.updateStatus)
module.exports = route