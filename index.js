const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/furniture_ecommerce");

const { render } = require("ejs");

const path = require("path");
const express = require("express");
const user_route = require("./routes/userRoute");
const app = express();
const session=require("express-session")
const nocache=require('nocache')


app.use(nocache())

app.use(session( {
  secret:"yyy",
  resave:true,
  saveUninitialized:true
} ))

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

const adminRoute = require("./routes/adminRoute");
app.use("/", adminRoute);

app.get("/", (req, res) => {
  res.render("user/index");
});

app.get("/adminlogin", (req, res) => {
  res.render("admin/adminlogin");
});

app.listen("7777", () => {
  console.log("server has started on http://localhost:7777");
});
