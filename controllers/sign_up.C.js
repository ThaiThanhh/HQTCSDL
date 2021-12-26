const userM = require('../models/user.M')
const bcrypt = require('bcrypt');
const session = require('express-session')
const saltRounds = 10;
class sign_upController {
    async index(req, res){
        res.render('account/signup',{
            layout: false
        }) 
    }
    
}
module.exports = new sign_upController