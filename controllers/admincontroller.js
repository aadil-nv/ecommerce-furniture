const express = require("express");
const app = express();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const session = require("express-session");
const Addcategory = require("../models/categoryModel");
const Products = require("../models/productModel");
const multer = require("multer");
const path = require("path");

// ---------------------Multer image saving--------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).array("images", 4);

app.use(express.static(path.join(__dirname, "public")));

// ------------------------------End------------------------------------

// -------------------------Admin Eamil nad Password--------------------
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
// ------------------------------End------------------------------------

// ------------------------Loading Admin Dashboard----------------------

const adminDashboard = async (req, res) => {
  try {
    res.render("admin/admindashboard");
  } catch (error) {
    console.log(error.message);
  }
};
// ------------------------------End------------------------------------

// ------------------------------Loading admin to UserList ------------------------------------

const adminUsersList = async (req, res) => {
  try {
    const user = await User.find();

    res.render("admin/userslist", { user });
  } catch (error) {
    console.log(error.meaasage);
  }
};
// ------------------------------End------------------------------------

// ------------------------------Loading Admin to addProduct page------------------------------------

const addProduct = async (req, res) => {
  try {
    const category = await Addcategory.find();
    res.render("admin/addproduct", { category });
  } catch (error) {
    console.log(error.message);
  }
};

// ------------------------------End------------------------------------

// ------------------------------Loading admin to CategoryMagement Page------------------------------------

const categoryManage = async (req, res) => {
  try {
    const category = await Addcategory.find();

    res.render("admin/category", { category });
  } catch (error) {
    console.log(error.message);
  }
};

// ---------------------------------------------------End-----------------------------------------------------

// ----------------------------------------Admin blocking User-----------------------------------------------------

const blockUser = async (req, res) => {
  try {
    const id = req.query.id;
    const user = await User.findById(id);
    if (user.is_blocked == true) {
      await User.updateOne({ _id: id }, { is_blocked: false });
    } else {
      await User.updateOne({ _id: id }, { is_blocked: true });
    }
    res.redirect("userslist");
  } catch (error) {
    console.log(error.message);
  }
};
// ----------------------------------------------------End-----------------------------------------------------

// --------------------------------------------Loading Addcategory page----------------------------------------------------

const addListCategory = async (req, res) => {
  try {
    const category = await Addcategory.findOne();

    res.render("admin/addcategory");
  } catch (error) {
    console.log(error.message);
  }
};
// ----------------------------------------------------End----------------------------------------------------------

// ------------------------------------------Adding category Detiles---------------------------------------------

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
// -------------------------------------------------End-----------------------------------------------------

// ------------------------------Admin Blocking the user only login    ------------------------------------

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
// --------------------------------------End-------------------------------------------------------

// ------------------------------Admin Editing page Load with category detiles----------------------------------------

const editCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const categoryid = await Addcategory.findById({ _id: id });
    if (categoryid) {
      res.render("admin/editcategory", { category: categoryid });
    } else {
      res.redirect("/categorymanagement");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// ---------------------------------------------------End---------------------------------------------------------

// -----------------------------------------Admin Updating Category detiles---------------------------------------

const updateCategory = async (req, res) => {
  try {
    const existingCategory = await Addcategory.findOne({
      categoryname: req.body.category,
    });
    const existingDescription = await Addcategory.findOne({
      categorydescription: req.body.descategory,
    });

    if (existingCategory && existingCategory._id != req.body.id) {
      res.redirect(`/editCategory/${req.body.id}`);
    } else if (existingDescription && existingDescription._id != req.body.id) {
      res.redirect(`/editCategory/${req.body.id}`);
    } else {
      await Addcategory.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            categoryname: req.body.category,
            categorydescription: req.body.descategory,
          },
        }
      );
      res.redirect("/categorymanagement");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// -----------------------------------------------End-------------------------------------------------------

// ------------------------------Loading Productlist and sending Product data intothe page ------------------------------------
const productList = async (req, res) => {
  try {
    const product = await Products.find();

    res.render("admin/productlist", { product });
  } catch (error) {
    console.log(error.message);
  }
};
const editProductDetiles = async (req, res) => {
  try {
    res.render("admin/editproductdetiles");
  } catch (error) {
    console.log(error.message);
  }
};

// --------------------------------------------End----------------------------------------------------------------

// --------------------------Adding NewProduct into Product and saving Product data Into Database------------------------------

const addNewProduct = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        const errorMsg = "Image more than 4 is not allowed";

        console.log(errorMsg);
        return res.redirect("/addproduct");
      }

      const alreadyProduct = await Products.findOne({
        productname: req.body.productName,
      });

      if (alreadyProduct) {
        const errorMsg = "Product already added";
        console.log(errorMsg);
        return res.redirect("/addproduct");
      }

      const product = new Products({
        productname: req.body.productName,
        productprice: req.body.productPrice,
        productquadity: req.body.productQuantity,
        productdescription: req.body.productDescription,
        categoryId: req.body.productCategory,
        productimage: req.files.map((file) => file.filename),
        isListed: true,
      });

      await product.save();

      res.redirect("/productlist");
    });
  } catch (err) {
    console.log(err);
  }
};
// --------------------------End Adding NewProduct into Product and saving Product data Into Database------------------------------


// --------------------------Upadating The data in the Category ------------------------------

const updateCategoryfetch = async (req, res) => {
  try {
    const catId = req.params.id;
    const { name, des } = req.body;

    const existingCategory = await Addcategory.findOne({ categoryname: name });

    const existingDescription = await Addcategory.findOne({
      categorydescription: des
    });
  

    if (existingCategory && existingCategory._id != catId) {
      return res.json({ already: "Name Already in the Category" });
    } else if (existingDescription && existingDescription._id != catId) {
      return res.json({ already: "Descategory Already in the Category" });
    } else {
      await Addcategory.findByIdAndUpdate({_id:catId},
        {$set: { categoryname: name, categorydescription: des },
      });
      return res.json({ success: "Category updated successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// --------------------------End Upadating The data in the Category ------------------------------





// ------------------------------------------------End--------------------------------------------------------

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
  updateCategory,
  productList,
  editProductDetiles,
  addNewProduct,
  updateCategoryfetch,
};
