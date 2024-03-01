const express = require("express");
const admin_route = express();
const bodyParser = require("body-parser");
const admincontroller = require("../controllers/admincontroller");
// const admincontroller = require("../controllers/admincontroller");
const multer=require('multer')

admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

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
admin_route.get('/productlist',admincontroller.productList)
admin_route.get('/editproductdetiles',admincontroller.editProductDetiles)
admin_route.post('/addproduct',admincontroller.addNewProduct)

module.exports = admin_route;