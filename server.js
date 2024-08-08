const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const mysql = require('mysql2')
const cookieparser = require('cookie-parser')
const fileupload = require('express-fileupload')
dotenv.config()
port = process.env.PORT || 5000

const app = express()

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.use(cookieparser())

app.use(express.static('public'))
app.use(express.static('upload')) 
app.use(fileupload())  

    

// define routes
const routes = require ('./server/routes/appRoutes')
const exp = require('constants')
app.use('/',routes)


  



app.listen(port,()=>{
    console.log(`Server listening on port : ${port}`)
})