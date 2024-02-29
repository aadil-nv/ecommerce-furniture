const express = require("express");
const admin_route = express();
const bodyParser = require("body-parser");
const admincontroller = require("../controllers/admincontroller");


admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

admin_route.post('/adminlogin',admincontroller.adminLogin)

admin_route.get('/admindashboard',admincontroller.adminDashboard)
admin_route.get('/userslist',admincontroller.adminUsersList)
admin_route.get('/addproduct',admincontroller.addProduct)
admin_route.get('/categorymanagement',admincontroller.categoryManage)
admin_route.get('/blockuser',admincontroller.blockUser)
admin_route.get('/addcategory',admincontroller.addListCategory)
admin_route.post('/addcategory',admincontroller.addDetilesCategory)
admin_route.get('/adminBlockcategory/:id',admincontroller.blockCategory)
admin_route.get('/editCategory/:id',admincontroller.editCategory)
admin_route.post("/editCategory", admincontroller.updateCategory);

module.exports = admin_route;