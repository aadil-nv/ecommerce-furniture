const Admin = require("../models/userModel");
const bcrypt = require("bcrypt");
const session = require("express-session");


const adminid = {
    adminemail: "admin007@gmail.com",
    adminpassword: "12345"
}

const adminLogin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        console.log(email)
        console.log(password)
        if (adminid.adminemail === email && adminid.adminpassword === password) {
            res.render('admin/admindashboard')
        } else {

            return res.render('admin/adminlogin')
        }



    } catch (error) {
        console.log(error.meaasage)
    }

};

const adminDashboard=async (req,res)=>{
    try {
        res.render('admin/admindashboard')
        
    } catch (error) {
        console.log(error.message);
    }
}

const adminUsersList = async (req, res) => {
    try {
        res.render('admin/userslist')

    } catch (error) {
        console.log(error.meaasage);
    }
}

const addProduct=async (req,res)=>{
    try {
        res.render('admin/addproduct')
        
    } catch (error) {
        console.log(error.message)
    }
}

const addCategory= async (req,res)=>{
    try {
        res.render("admin/category")
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    adminLogin,
    adminDashboard,
    adminUsersList,
    addProduct,
    addCategory
};
