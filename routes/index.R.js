const homeRoute = require('./home.R')
const sign_inRoute =  require('./sign_in.R')
const sign_upRoute =  require('./sign_up.R')
const supplierRoute = require('./supplier.R')
const customerRoute = require('./customer.R')
const shipperRoute = require('./shipper.R')
const staffRoute = require('./staff.R')
function Route(app){
    app.use('/', sign_inRoute)
    app.use('/signin', sign_inRoute)
    app.use('/signup', sign_upRoute)
    app.use('/supplier', supplierRoute)
    app.use('/customer', customerRoute)
    app.use('/shipper', shipperRoute)
    app.use('/staff', staffRoute)
}

module.exports = Route