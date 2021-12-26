// const sql = require('mssql/msnodesqlv8')
const sql = require('mssql')
const config = {
    server: "localhost",
    user: "sa",
    password: "123456",
    database: "QL_HTVC",
    // driver: "msnodesqlv8",
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      options: {
        encrypt: true, // for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs
        instancename: 'SQLEXPRESS'
      },
}

// const conn = new sql.ConnectionPool(config).connect().then(pool => {
//     return pool
// })

// module.exports = {
//     conn: conn,
//     sql: sql
// }

const conn = sql.connect(config)
module.exports = conn