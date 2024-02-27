const express = require("express");
const admin_route = express();
const bodyParser = require("body-parser");
const admincontroller = require("../controllers/admincontroller");


admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

admin_route.post('/adminlogin',admincontroller.adminLogin)
admin_route.post('/admindashboard',admincontroller.adminDashboard)
admin_route.get('/userslist',admincontroller.adminUsersList)
admin_route.get('/addproduct',admincontroller.addProduct)
admin_route.get('/categorymanagement',admincontroller.addCategory)

module.exports = admin_route;