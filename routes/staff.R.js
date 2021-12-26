const express = require('express')
const route = express.Router()
const staffController = require('../controllers/staff.C')

route.get('/', staffController.viewSuppliers)
route.get('/:staffID/supContracts', staffController.viewSupplierContract)
route.get('/:staffID/supContracts/:supID/approval', staffController.approval)
module.exports = route