const express = require("express");
const user_route = express();
const bodyParser = require("body-parser");
const usercontroller = require("../controllers/usercontroller");
const userAuth = require('../middleware/userAuth');
const { addCategory } = require("../controllers/admincontroller");



user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));


// without user loginage
user_route.get("/", usercontroller.home);
user_route.get("/login",userAuth.isLogout, usercontroller.loadLogin);
user_route.get("/registration",usercontroller.loadRegister);
// user first otp
user_route.post("/registration", usercontroller.insertUser);
user_route.post('/otp',usercontroller.otpLogin)
user_route.post('/resendotp',usercontroller.resendOtp)
// user with login
user_route.post("/userhome", usercontroller.userLogin);
user_route.get('/userprofile',usercontroller.loadUserProfile)

user_route.get('/userhome',usercontroller.backToUserHome)

// loading shop page
user_route.get('/shoppage',usercontroller.loadShopPage)
// loading About page
user_route.get('/aboutpage',usercontroller.loadAboutPage)
// loading contact page
user_route.get('/contactpage',usercontroller.loadAboutPage)
// loading Product Tab
user_route.get('/producttab/:id',usercontroller.loadProductTab)





module.exports = user_route;
