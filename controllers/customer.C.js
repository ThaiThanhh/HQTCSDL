const conn = require("../models/dbConnection");
const sql = require("mssql");

class customerController {
  async viewSupplierList(req, res) {
    let cusID = req.query.id;
    let pool = await conn;
    let getSupplierList = await pool.request().query("select * from DOITAC");
    let supplierList = getSupplierList.recordset;
    for (let supplier of supplierList) {
      supplier.cusID = cusID;
    }
    res.render("customer/customerHome", {
      cusID: cusID,
      supplierList: supplierList,
    });
  }
  async viewProductList(req, res) {
    const cusID = req.params.cusID;
    const supID = req.query.id;
    let pool = await conn;
    let getproductList = await pool
      .request()
      .input("MADT", sql.Char(5), supID)
      .execute('XEMDANHSACHSP_DT');
    let productList = getproductList.recordset;

    console.log(productList);
    res.render("customer/viewSupplierProduct", {
      cusID: cusID,
      productList: productList,
    });
  }
  async viewOrderList(req, res) {
    let cusID = req.params.cusID;
    let pool = await conn;
    let getOrderList = await pool
      .request()
      .input("input_parameter", sql.Char(5), cusID)
      .query("select * from DONHANG where MAKH = @input_parameter");
    let orderList = getOrderList.recordset;
    res.render("customer/viewOrder", {
      cusID: cusID,
      orderList: orderList,
    });
  }
}
module.exports = new customerController();
