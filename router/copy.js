const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserSchema = require("../model/UserSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser")
const authenticate = require("../middleware/authenticate")

const JWT_SECRET =
    "f1a5a554258b5c4222cd8ebc5dea8b4912a8d8795c0422bb7ba22eb16abd7308";
mongoose
// .connect("mongodb+srv://yash:jOhfBi3986fmdSAM@cluster0.uqlowxi.mongodb.net/ExpenseTracker")
    .connect("mongodb://0.0.0.0:27017/DialyExpense")
    .then(() => {
        console.log("Connected to mongo");
    })
    .catch((err) => {
        console.log("error" + err);
    });
const User = require("../model/UserSchema");
router.use(cookieParser())
router.get("/", (req, res) => {
    res.send(`hello world router`);
});
router.get("/router", (req, res) => {
    res.send(`hello world router`);
});


router.get("/profile", (req, res) => {
    res.send(req.rootuser)
});





module.exports = router;