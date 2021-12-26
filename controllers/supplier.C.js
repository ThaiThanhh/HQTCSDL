const conn = require("../models/dbConnection");
const sql = require("mssql");
const { redirect } = require("express/lib/response");
const { reset } = require("nodemon");
class supplierController {
  async productManage(req, res) {
    let supID = req.query.id;
    let pool = await conn;
    let getproductList = await pool
      .request()
      .input("input_parameter", sql.Char(5), supID)
      .query("select * from SANPHAM where MaDT = @input_parameter");
    let productList = getproductList.recordset;
    res.render("supplier/supplierHome", {
      supID: supID,
      productList: productList,
    })
  }
  async orderManage(req, res) {
    let supID = req.params.supID;
    let pool = await conn;
    let getOrderList = await pool
      .request()
      .input("input_parameter", sql.Char(5), supID)
      .query("select * from DONHANG where MADT = @input_parameter");
    let orderList = getOrderList.recordset;
    res.render("supplier/supplierOrder", {
      supID: supID,
      orderList: orderList,
    });
  }

  async productDetail(req, res) {
    const productID = req.query.id;
    const supID = req.params.supID.trim();
    let pool = await conn;
    let getProduct = await pool
      .request()
      .input("input_parameter", sql.Char(5), productID)
      .query("select * from SANPHAM where MASP = @input_parameter");

    let product = getProduct.recordset[0];
    console.log(supID, product);
    res.render("supplier/productDetail", {
      product: product,
      supID: supID,
    });
  }

  async updateProduct(req, res) {
    const productName = req.body.productName;
    const productID = req.body.productID;
    const productPrice = req.body.priceOfProduct;
    const productAmount = req.body.numberOfProduct;
    const productBranch = req.body.productStorage;
    let pool = await conn;
    console.log(productName);
    if (productName) {
      await pool
        .request()
        .input("input_parameter", sql.Char(5), productID)
        .input("input_parameter2", sql.NVarChar(20), productName)
        .query(
          `update SANPHAM set TENSP = @input_parameter2 where MASP = @input_parameter`
        );
    }
    if (productPrice) {
      await pool
        .request()
        .input("input_parameter", sql.Char(5), productID)
        .input("input_parameter2", sql.Float, productPrice)
        .query(
          `update SANPHAM set GIABAN = @input_parameter2 where MASP = @input_parameter`
        );
    }
    if (productAmount) {
      await pool
        .request()
        .input("input_parameter", sql.Char(5), productID)
        .input("input_parameter2", sql.Int, productAmount)
        .query(
          `update SANPHAM set SOLUONGTON = @input_parameter2 where MASP = @input_parameter`
        );
    }
    if (productBranch) {
      await pool
        .request()
        .input("input_parameter", sql.Char(5), productID)
        .input("input_parameter2", sql.int, productBranch)
        .query(
          `update SANPHAM set SOLUONGTON = @input_parameter2 where MASP = @input_parameter`
        );
    }
    const supID = req.params.supID.trim();
    res.redirect(`/supplier?id=${supID}`);
  }

  async deleteProduct(req, res) {
    const supID = req.params.supID.trim();
    const productID = req.query.id;
    let pool = await conn;
    pool
      .request()
      .input("input_parameter", sql.Char(5), productID)
      .query(`DELETE FROM SANPHAM WHERE MASP = @input_parameter;`);
    res.redirect(`/supplier?id=${supID}`);
  }
  async addProductView(req, res) {
    res.render("supplier/addProduct", {
      supID: req.params.supID.trim(),
    });
  }

  async addProduct(req, res) {
    const supID = req.params.supID.trim()
    const productInfo = req.body

    let pool = await conn
    let insertedProduct = await pool.request()
      .input("MADT", sql.Char(5),supID)
      .input("STT", sql.Int, productInfo.productStorage)
      .input("TENSP", sql.NVarChar(20), productInfo.productName)
      .input("SOLUONGTON", sql.Int, productInfo.numberOfProduct)
      .input("GIABAN", sql.Float, productInfo.priceOfProduct)
      .execute('ThemSanPham')
    res.redirect(`/supplier?id=${supID}`)
  }

  async updateStatus(req, res) {
    const supID = req.params.supID.trim()

    const orderID = req.query.id
    let pool = await conn
    let updateStatus = await pool.request()
      .input("madh", sql.Char(5),orderID)
      .execute('sp_updateStatus_DH')
    res.redirect(`/supplier/${supID}/order`)
  }
  async viewContracts(req, res) {
    const supID = req.params.supID.trim()
    let pool = await conn;
    let getSupplierContracts = await pool
        .request()
        .input("madt", sql.Char(5), supID)
        .execute('XemDanhSachHopDong_DT')

    let supplierContracts = getSupplierContracts.recordset;
    for (var supplierContract of supplierContracts) {
        supplierContract.TINHTRANG = (supplierContract.TINHTRANGDUYET == 1) ? 'Đã duyệt' :'Đang chờ duyệt' 
    }
    res.render("supplier/supplierContracts", {
        supID: supID,
        supplierContracts: supplierContracts
    })
  }
  async addContract(req, res) {
    const supID = req.params.supID.trim()
    const number = req.body.number
    let pool = await conn;
    await pool
        .request()
        .input("madt", sql.Char(5), supID)
        .input("mathue", sql.Char(10), number)
        .execute('sp_insert_HD')
    res.redirect(`/supplier/${supID}/contracts`)
  }
  async discountPrice(req, res) {
    const supID = req.params.supID.trim()
    let pool = await conn;
    await pool
        .request()
        .input("MADT", sql.Char(5), supID)
        .input("STT", sql.Int, req.body.STT)
        .input("MASP", sql.Char(5), req.body.MASP)
        .input("PHANTRAM", sql.Float, req.body.discount)
        .execute('GIAMGIASP_CN ')
    res.redirect(`/supplier?id=${supID}`)
  }
  async increasePrice(req, res) {
    const supID = req.params.supID.trim()
    let pool = await conn;
    await pool
        .request()
        .input("MADT", sql.Char(5), supID)
        .input("STT", sql.Int, req.body.STT)
        .input("MASP", sql.Char(5), req.body.MASP)
        .input("GIATANG", sql.Float, req.body.increase_price)
        .execute('TANGGIASP_CN')
    res.redirect(`/supplier?id=${supID}`)
  }
}

module.exports = new supplierController();
