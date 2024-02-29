const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const session = require("express-session");
const Addcategory = require("../models/categoryModel");


let category

const adminid = {
    adminemail: "admin007@gmail.com",
    adminpassword: "12345",
};

const adminLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (adminid.adminemail === email && adminid.adminpassword === password) {
            res.redirect("/admindashboard");
        } else {
            return res.render("admin/adminlogin");
        }
    } catch (error) {
        console.log(error.meaasage);
    }
};

const adminDashboard = async (req, res) => {
    try {
        res.render("admin/admindashboard");
    } catch (error) {
        console.log(error.message);
    }
};

const adminUsersList = async (req, res) => {
    try {
        const user = await User.find();

        res.render("admin/userslist", { user });
    } catch (error) {
        console.log(error.meaasage);
    }
};

const addProduct = async (req, res) => {
    try {
        res.render("admin/addproduct");
    } catch (error) {
        console.log(error.message);
    }
};

const categoryManage = async (req, res) => {
    try {
        const category = await Addcategory.find();

        res.render("admin/category", { category });
    } catch (error) {
        console.log(error.message);
    }
};

const blockUser = async (req, res) => {
    try {
        const id = req.query.id;
        const user = await User.findById(id);
        if (user.is_blocked == true) {
            await User.updateOne({ _id: id }, { is_blocked: false });
        } else {
            await User.updateOne({ _id: id }, { is_blocked: true });
        }
        // user.is_blocked=!user.is_blocked;
        // await user.save();

        res.redirect("userslist");
    } catch (error) {
        console.log(error.message);
    }
};

const addListCategory = async (req, res) => {
    try {
        const category = await Addcategory.findOne();

        res.render("admin/addcategory");
    } catch (error) {
        console.log(error.message);
    }
};

const addDetilesCategory = async (req, res) => {
    try {
        const category = new Addcategory({
            categoryname: req.body.category,
            categorydescription: req.body.descategory,
            categorystatus: false,
        });
        await category.save();

        res.render("admin/addcategory");
    } catch (error) {
        console.log(error.message);
    }
};

const blockCategory = async (req, res) => {
    try {
        const categoryid = req.params.id;
        const cid = await Addcategory.findById(categoryid);
        if (cid.categorystatus == false) {
            await Addcategory.updateOne({ _id: cid }, { categorystatus: true });
        } else {
            await Addcategory.updateOne({ _id: cid }, { categorystatus: false });
        }

        res.redirect("/categorymanagement");
    } catch (error) {
        console.log(error.message);
    }
};

const editCategory = async (req, res) => {
    try {
        const id = req.params.id
        const categoryid = await Addcategory.findById({ _id: id })
        if (categoryid) {
            res.render('admin/editcategory', { category: categoryid })
        } else {
            res.redirect('/categorymanagement')
        }

    } catch (error) {
        console.log(error.message)
    }
}


const updateCategory = async (req, res) => {
    try {
        const existingCategory = await Addcategory.findOne({ categoryname: req.body.category });
        const existingDescription = await Addcategory.findOne({ categorydescription: req.body.descategory });

        if (existingCategory && existingCategory._id != req.body.id) {
       
            res.redirect(`/editCategory/${req.body.id}`);
        } else if (existingDescription && existingDescription._id != req.body.id) {
        
            res.redirect(`/editCategory/${req.body.id}`);
        } else {
        
            console.log('cat des:', req.body.descategory);
            await Addcategory.findByIdAndUpdate(
                { _id: req.body.id },
                { $set: { categoryname: req.body.category, categorydescription: req.body.descategory } }
            );
            res.redirect('/categorymanagement');
        }

    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    adminLogin,
    adminDashboard,
    adminUsersList,
    addProduct,
    categoryManage,
    blockUser,
    addListCategory,
    addDetilesCategory,
    blockCategory,
    editCategory,
    updateCategory
};
