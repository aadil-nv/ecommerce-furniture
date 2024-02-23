const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/furniture_ecommerce");

const { render } = require("ejs");

const path = require("path");
const express = require("express");
const user_route = require("./routes/userRoute");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

app.get("/", (req, res) => {
  res.render("user/index");
});
app.listen("7777", () => {
  console.log("server has started on http://localhost:7777");
});
