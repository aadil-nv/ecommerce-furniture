const express=require('express')
const user_route = express()
const bodyParser=require('body-parser')
const usercontroller=require('../controllers/usercontroller')

user_route.get('/login',usercontroller.loadLogin)

user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({extended:true}))


user_route.post('/login',usercontroller.insertUser)






module.exports=user_route