const User = require("../models/userModel");
const Otp= require('../models/otp')
const bcrypt = require("bcrypt");
const session = require("express-session")
const nodemailer = require('nodemailer')
const path = require('path')

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
}



const securedPassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (erorr) {
    console.log(erorr.message);
  }
};

const loadRegister = async (req, res) => {
  try {
    res.render("user/registration");
  } catch (erorr) {
    console.log(erorr.message);
  }
};


const insertUser = async (req, res) => {
  try {
    const checkemail = await User.findOne({ email: req.body.email })
    if (checkemail) {
      res.render('user/registration', { message: "Email already exist" })

    } else {
      const spassword = await securedPassword(req.body.password)
      const email = req.body.email
      const emailRegex = /^[A-Za-z0-9.%+-]+@gmail\.com$/
      if (!emailRegex.test(email)) {
        res.render('user/registration', { message: 'Invalid email provided' });
      }
      const name = req.body.name

      if (!name || !/^[a-zA-Z][a-zA-Z\s]*$/.test(name)) {
        res.render('user/registration', { message: "Inavlid name provided" })
      }

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mno,
        password: spassword,
        is_admin: 0,

      })

      const userData = user

      if (userData) {
        res.render("user/otp", { message: "Succesfilly Registerd Your Form . Please Verify Your Mail", });
        
        
        const otp = generateOTP()

        const userotp= new Otp ({
          otp:otp,
          email:req.body.email
        })
        const userOTP=await  userotp.save()

        verifyEmail(name, email, otp)

      } else {
        res.render("registration", {
          message: "Your Registration has been Failed ",
        });
      }
    }
  } catch (erorr) {
    console.log(erorr.message);
  }
};







const verifyEmail = async (name, email, otp) => {
  try {

    const transport = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: "adilev2000@gmail.com",
        pass: "zufu zbyh zeac zptj",
      }
    });
    const mailoption = {
      from: "adilev2000@gmail.com",
      to: email,
      subject: 'for verification mail',
      html: `<h1>hi ${name} this is OTP form Ecommerce-Furniture <a>${otp}</a></h1>`
    }
    transport.sendMail(mailoption, (err, info) => {
      if (err) {
        console.log(err.message);
      }
      else {
        console.log(`Email has been sent: ${info.messageId}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    })
  } catch (error) {
    console.log(error.message);
  }
}

const otpLogin= async (req,res)=>{
  try {
    const storedEmail=await Otp.findOne({otps:req.body.otp})
    
    console.log(storedEmail)
    const storedOtp=storedEmail.otp

    const userOtp= [req.body.n1,req.body.n2,req.body.n3,req.body.n4 ]
    const checkOtp=userOtp.join('')

    console.log(storedOtp);
    console.log(checkOtp);
    
    if(storedOtp===checkOtp){
      res.render('user/index')
    }else{
      res.render('user/registration')
    }

  } catch (error) {
    console.log(error.message)
  }
}



const loadLogin = async (req, res) => {
  try {
    res.render("user/login");
  } catch (erorr) {
    console.log(erorr.message);
  }
};



const userLogin = async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.body.email });


    if (userData) {
      const passwordMatch = await bcrypt.compare(req.body.password, userData.password);

      if (passwordMatch) {
        req.session.user = userData._id;
        res.render("user/index", { User: req.session.user });
      } else {
        res.render("user/login", { message: "Incorrect Mail and Password" });
      }
    } else {
      res.render("user/login", { message: "Incorrect Mail and Password" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadUserProfile = async (req, res) => {
  try {
    if (User) {
      res.render("user/userprofile")
    } else {
      req.session.destroy()
      res.render('user/login')
    }

  } catch (error) {
    console.log(error.message)
  }

}


module.exports = {
  loadRegister,
  insertUser,
  verifyEmail,
  otpLogin,
  loadLogin,
  userLogin,
  loadUserProfile
};
