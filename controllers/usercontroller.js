const User = require("../models/userModel");
const Otp = require("../models/otp");
const bcrypt = require("bcrypt");
const session = require("express-session");
const nodemailer = require("nodemailer");
const path = require("path");
const { log } = require("console");
const Products = require("../models/productModel");

// --------------OTP Generating-----------------
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};
// ------------------------------End------------------------------------

let userData;

// -------------Bcrypting password----------------
const securedPassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (erorr) {
    console.log(erorr.message);
  }
};
// ------------------------------End------------------------------------

// -------------Loading Registrationpage-----------
const loadRegister = async (req, res) => {
  try {
    res.render("user/registration");
  } catch (erorr) {
    console.log(erorr.message);
  }
};
// ------------------------------End------------------------------------

// ----------------Root Page-----------------------

const home = async (req, res) => {
  try {

    console.log("i am lhome");
    const ProductData = await Products.find();
    res.render("user/index", { ProductData });
  } catch (erorr) {
    console.log(erorr.message);
  }
};
// ------------------------------End------------------------------------

// -------------User Inserting Data in signup page----------------

const insertUser = async (req, res) => {
  try {
    const checkemail = await User.findOne({ email: req.body.email });
    if (checkemail) {
      return res.render("user/registration", {
        message: "Email already exist",
      });
    }

    const spassword = await securedPassword(req.body.password);

    const email = req.body.email;
    const emailRegex = /^[A-Za-z0-9.%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      res.render("user/registration", { message: "Invalid Email Provided" });
    }

    const name = req.body.name;
    const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;

    if (!nameRegex.test(name.trim())) {
      res.render("user/registration", { message: "Invalid Name Provided" });
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(req.body.mno)) {
      return res.render("user/registration", {
        message: "Invalid Mobile Number Povided",
      });
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mno,
      password: spassword,
      is_admin: 0,
      is_blocked:false
    });

    userData = user;

    if (userData) {
      const otp = generateOTP();

      const userotp = new Otp({
        otp: otp,
        email: req.body.email,
      });
      await userotp.save();

      verifyEmail(name, email, otp);

      return res.render("user/otp");
    } else {
      res.render("registration", {
        message: "Your Registration has been Failed ",
      });
    }
  } catch (erorr) {
    console.log(erorr.message);
  }
};
// ------------------------------End------------------------------------

// ----------------Nodemailer OTP send--------------------

const verifyEmail = async (name, email, otp) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: "adilev2000@gmail.com",
        pass: "zufu zbyh zeac zptj",
      },
    });
    const mailoption = {
      from: "adilev2000@gmail.com",
      to: email,
      subject: "for verification mail",
      html: `<h1>hi ${name} this is OTP form Ecommerce-Furniture <a>${otp}</a></h1>`,
    };
    transport.sendMail(mailoption, (err, info) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(`Email has been sent: ${info.messageId}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};
// ------------------------------End------------------------------------

// ------------------OTP validation--------------------------------

const otpLogin = async (req, res) => {
  try {
    const storedEmail = await Otp.findOne({ Otps: req.body.otp }).sort({createdAt:-1});
    const storedOtp = storedEmail.otp;
    const { n1, n2, n3, n4 } = req.body;
    const userOtp = `${n1}${n2}${n3}${n4}`;
    console.log(userOtp);

    if (storedOtp == userOtp) {
      await userData.save();
      await User.findOneAndUpdate(
        { email: userData.email },
        { is_verified: true }
      );
      return res.render("user/login", {
        message: "Successfull Registerd Now Login",
      });
    } else {
      return res.render("user/otp", { message: "wrong Otp" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
// ------------------------------End------------------------------------

// ----------------Loading login page --------------------------------

const loadLogin = async (req, res) => {
  try {
    res.render("user/login");
  } catch (erorr) {
    console.log(erorr.message);
  }
};
// ------------------------------End------------------------------------

// -------------User Login validaing and entering with userdata --------------------------------------

const userLogin = async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.body.email });
    console.log(userData);
    
    if (!userData) {
      res.render("user/login", { message: "Not a user" });
    }
    
    const block = userData.is_blocked;

    const ProductData = await Products.find();
     
    if (userData) {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        userData.password
      );

      if (passwordMatch && !block) {
        req.session.user = userData._id;
        res.redirect("/");
      } else if (block) {
        res.render("user/login", { message: "Your Account has been blocked" });
      } else {
        res.render("user/login", { message: "Incorrect Mail and Password" });
      }
    } else {
      res.render("user/login", { message: "Your Account has been blocked" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// -------------------------------------------End---------------------------------------------

// -------------------------------------------Loading User Profile-------------------------------------------

const loadUserProfile = async (req, res) => {
  try {
    if (User) {
      res.render("user/userprofile");
    }
    //  else {
    //   // req.session.destroy();
    //   res.render("user/login");
    // }
  } catch (error) {
    console.log(error.message);
  }
};
// ------------------------------End Loading UserProfile------------------------------------

const logout = async (req, res) => {
  try {
   req.session.destroy((err)=>{
    if(err)
    {cosole.log("session is not destroyed")}
    else
    { res.redirect('/')}
   })
  } catch (error) {
    console.log(error.message);
  }
};






// -----------------Resending the OTP-------------------------------

const resendOtp = async (req, res) => {
  try {
    const newotp = generateOTP();

    verifyEmail(userData.name, userData.email, newotp);
    await Otp.updateOne({ email: userData.email }, { otp: newotp });

    res.render("user/otp");
  } catch (error) {
    console.log(error.message);
  }
};
// ------------------------------End------------------------------------

// -------------------Back to userHome with UsererData--------------------------------
const backToUserHome = async (req, res) => {
  try {
    const ProductData = await Products.find();

    res.render("user/index", { ProductData, User: req.session.user });
  } catch (error) {
    console.log(error.message);
  }
};
// ----------------------------------------------End--------------------------------------------

// ----------------------------------------------Loading ShopPage-------------------------------------------

const loadShopPage = async (req, res) => {
  try {
    res.render("user/shop", { User });
  } catch (error) {
    console.log(error.message);
  }
};

// ----------------------------------------------End--------------------------------------------

// ----------------------------------------------Loading AboutPage-------------------------------------------

const loadAboutPage = async (req, res) => {
  try {
    res.render("user/about", { User });
  } catch (error) {
    console.log(error.message);
  }
};

// ----------------------------------------------Ending AboutPage-------------------------------------------

// ----------------------------------------------Loading ShopPage-------------------------------------------
const loadContactPage = async (req, res) => {
  try {
    res.render("user/contact", { User });
  } catch (error) {
    console.log(error.message);
  }
};

// ----------------------------------------------End ShopPage-------------------------------------------

// ----------------------------------------------Loading Product Tab-------------------------------------------

const loadProductTab = async (req, res) => {
  try {
    const productId = req.params.id;
    const savedData = await Products.findById(productId);
    console.log(savedData);

    if (savedData) {
      res.render("user/producttab", { savedData });
    }
    res.redirect("index");
  } catch (error) {
    console.log(error.message);
  }
};

// ----------------------------------------------End Product Tab-------------------------------------------


// ----------------------------------------------Loding Google Auth-------------------------------------------

const loadGoogleAuth=async (req,res)=>{
  try {
    const ProductData = await Products.find();
    res.render('user/index',{ProductData,User})
    
  } catch (error) {
    console.log(error.message)
  }
}



// -------------------Exporting Controllers-----------------------

module.exports = {
  loadRegister,
  insertUser,
  verifyEmail,
  otpLogin,
  loadLogin,
  userLogin,
  loadUserProfile,
  logout,
  resendOtp,
  home,
  backToUserHome,
  loadShopPage,
  loadAboutPage,
  loadContactPage,
  loadProductTab,
  loadGoogleAuth
};

// ------------------------------End------------------------------------
