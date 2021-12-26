const conn = require("../models/dbConnection");
const sql = require("mssql");
const { redirect } = require("express/lib/response");

class customerController {
  async viewOrderList(req, res) {
    let shipperID = req.query.id;

    let pool = await conn;
    let getAddress = await pool
      .request()
      .input("input_parameter", sql.Char(5), shipperID)
      .query("SELECT KHUVUCHD FROM TAIXE WHERE MATX = @input_parameter");
    let address = getAddress.recordset[0];
    let getOrderList = await pool
      .request()
      .input("khuvuc", sql.NVarChar(20), address)
      .execute("sp_viewList_DH_TX");
    let orderList = getOrderList.recordset;
    for (let order of orderList) {
      order.shipperID = shipperID;
    }
    res.render("shipper/shipperHome", {
      shipperID: shipperID,
      orderList: orderList,
    });
  }
  async getOrder(req, res) {
    const orderID = req.query.id;
    const shipperID = req.params.shipperID;
    let pool = await conn;
    await pool
      .request()
      .input("MADH", sql.Char(5), orderID)
      .input("MATX", sql.Char(5), shipperID)
      .execute("sp_getOrder_DH")
    res.redirect(`/shipper?id=${shipperID}`)
  }
  async viewMyOrders(req, res) {
    const shipperID = req.params.shipperID;
    
    let pool = await conn;
    let getOrderList = await pool
      .request()
      .input("matx", sql.Char(5), shipperID)
      .execute("DonHangTaiXe")
    let orderList = getOrderList.recordset
    for (let order of orderList) {
      if (order.TRANGTHAI ==='Đã giao') {
        order.finished = 'text-danger fw-bolder'
      }
      else order.finished = ''
    }
    let getIncome = await pool
      .request()
      .input("matx", sql.Char(5), shipperID)
      .execute("TongThuNhap")
    
    res.render("shipper/myOrders", {
      shipperID: shipperID,
      orderList: orderList,
      finishedColor: 'text-danger',
      income: getIncome.returnValue
    });
  }
  async updateStatus(req, res) {
    const shipperID = req.params.shipperID.trim()
    const orderID =  req.query.id
    let pool = await conn
    let updateStatus = await pool.request()
      .input("madh", sql.Char(5),orderID)
      .execute('sp_updateStatus_DH')
    res.redirect(`/shipper/${shipperID}/orderList`)
  }
}
module.exports = new customerController();
