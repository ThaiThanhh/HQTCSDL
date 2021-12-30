const express = require('express')
const route = require('./routes/index.R')
    app = express()
    port = 3001
    hbs = require('express-handlebars')
    path = require('path')

app.use(express.urlencoded({
    extended: true,
}))

require('./middlewares/handlebars')(app)


const cookieParser = require('cookie-parser')
app.use(cookieParser())
route(app)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

