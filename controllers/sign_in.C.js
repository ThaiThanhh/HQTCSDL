const userM = require("../models/user.M");
const session = require("express-session");
const conn = require("../models/dbConnection");
const sql = require("mssql");
const { redirect } = require("express/lib/response");
const saltRounds = 10;
class sign_inController {
  async index(req, res) {
    res.render("signin",{
      layout: false
    });
  }
  async login(req, res) {
    const userName = req.body.username;
    const psw = req.body.password;
    let pool = await conn;
    let userAccount = await pool
      .request()
      .input("input_parameter", sql.VarChar(3), userName)
      .query(`select * from TAIKHOAN where USERNAME = @input_parameter`);
    if (!userAccount) {
      console.log("Can not find account");
      return redirect("/");
    }
   
    if (userAccount.recordset[0].PASS === psw) {
      let role = userAccount.recordset[0].ROLE;
    
      let id = userAccount.recordset[0].ID.trim();
      switch (role) {
        case 1: //đối tác
      
          let getSupplier = await pool
            .request()
            .input("input_parameter", sql.Char(5), id)
            .query("select * from DOITAC where TAIKHOAN = @input_parameter")
          let supID = getSupplier.recordset[0].MADT.trim()
          res.redirect(`/supplier?id=${supID}`);
          break;
        case 4:
          let getCustomer = await pool
            .request()
            .input("input_parameter", sql.Char(5), id)
            .query("select * from KHACHHANG where TAIKHOAN = @input_parameter")
          let cusID = getCustomer.recordset[0].MAKH.trim()
          res.redirect(`/customer?id=${cusID}`)
          break
        case 2:
          let getShipper = await pool
            .request()
            .input("input_parameter", sql.Char(5), id)
            .query("select * from TAIXE where TAIKHOAN = @input_parameter")
          let shipperID = getShipper.recordset[0].MATX.trim()
          res.redirect(`/shipper?id=${shipperID}`)
          break
        case 3:
          let getStaff = await pool
            .request()
            .input("input_parameter", sql.Char(5), id)
            .query("select * from NHANVIEN where TAIKHOAN = @input_parameter")
          let staffID = getStaff.recordset[0].MANV.trim()
          res.redirect(`/staff?id=${staffID}`)
          break
        default:

          break;
      }
    }

  }
}
module.exports = new sign_inController();
