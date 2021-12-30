const conn = require("../models/dbConnection");
const sql = require("mssql");
const { redirect } = require("express/lib/response");

class staffController {
  async viewSuppliers(req, res) {
    let staffID = req.query.id;
    let pool = await conn;
    let getSuppliers = await pool.request().query("select * from DOITAC");
    let suppliers = getSuppliers.recordset;
    for (var supplier of suppliers) {
      supplier.MANV = staffID;
    }
    res.render("staff/staffHome", {
      staffID: staffID,
      suppliers: suppliers,
    });
  }
  async viewSupplierContract(req, res) {
    let staffID = req.params.staffID;
    let supplierID = req.query.id;
    let pool = await conn;
    // let getSupplierContracts = await pool
    //   .request()
    //   .input("madt", sql.Char(5), supplierID)
    //   .execute("XemDanhSachHopDong_DT");
    let getSupplierContracts = await pool
      .request()
      .input("MADT", sql.Char(5), supplierID)
      .execute("ThongKeHD333");
    console.log(getSupplierContracts);
    let supplierContracts = getSupplierContracts.recordset;
    for (var supplierContract of supplierContracts) {
      supplierContract.MANV = staffID;
      supplierContract.TINHTRANG =
        supplierContract.TINHTRANGDUYET == 1 ? "Đã duyệt" : "Đang chờ duyệt";
    }

    
    res.render("staff/supplierContracts", {
      countContract: getSupplierContracts.returnValue,
      staffID: staffID,
      supplierID: supplierID,
      supplierContracts: supplierContracts,
    });
    
  }
  async approval(req, res) {
      let staffID = req.params.staffID.trim();
      let supID = req.params.supID.trim();
  
      let contractID = req.query.id;
      let pool = await conn;
      await pool
        .request()
        .input("mahd", sql.Char(5), contractID)
        .input("manv", sql.Char(5), staffID)
        .execute("sp_capnhat_TTduyet");
      res.redirect(`/staff/${staffID}/supContracts?id=${supID}`);
   
  }
}

module.exports = new staffController();
