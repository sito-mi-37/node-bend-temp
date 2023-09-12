const express = require('express')
const app = express()
const dbConnect = require('./src/config/dbCon')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require("cookie-parser")
const corsOptions = require('./src/config/corsOptions')
const {logger} = require('./src/middlewares/logEvents')
const path = require('path')
const errorHandler = require('./src/middlewares/errorHandler')
const credentials = require('./src/middlewares/credentials')


const port = process.env.PORT || 3000


app.use(logger)

dbConnect()

app.use(credentials)
app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(cookieParser())

app.use('/users', require('./src/routes/userRoute'))
app.use('/auth', require('./src/routes/authRoute'))
app.use('/refresh', require('./src/routes/refreshRoute'))
app.use('/logout', require('./src/routes/logoutRoute'))
app.use('/register', require('./src/routes/registerRoute'))
app.use('/employees', require('./src/routes/employeeRoute'))

app.all('*', (req, res) => {
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'src', 'view', '404.html'))
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('connected to mongoDb')
    app.listen(port, () => console.log(`App running on port ${port}`))
})

mongoose.connection.on("error", (err) => {
    console.log(err)
})


