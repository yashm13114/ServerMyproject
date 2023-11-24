const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserSchema = require("../model/UserSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { addTransaction, getAllTransaction } = require('../controller/TransactionCtrl')
const authenticate = require("../middleware/authenticate");
const {
    addExpense,
    getExpense,
    getProfile,
    deleteExpense,
    getTransactions,
} = require("../controller/expense");
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
router.use(cookieParser());
router.get("/", (req, res) => {
    res.send(`hello world router`);
});
router.get("/router", (req, res) => {
    res.send(`hello world router`);
});

router.post("/register", async(req, res) => {
    const { name, email, password, cpassword } = req.body;
    if (!name || !email || !password || !cpassword) {
        return res.json({ error: "plz fill it" });
    }
    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.json({ status: "User already exists" });
        }
        const user1 = new User({ name, email, password, cpassword });

        await user1.save();

        res.status(201).json({ message: "successfully" });
    } catch (err) {
        console.log(err);
    }
});

router.post("/login", async(req, res) => {
    try {
        let token;
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please enter all the details" });
        }
        const userlogin = await UserSchema.findOne({ email: email });
        // console.log(userlogin)
        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            token = await userlogin.generateAuthToken();
            console.log(token);
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
            });
            // console.log(`this is cookie ${req.cookie.jwt()}`)

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid Credentials" });
            } else {
                res.json({ message: "logged in successfully" });
            }
        } else {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
    } catch (err) {
        console.log(err);
    }
});
// auth.js
router.get("/profile", authenticate, (req, res) => {
    const { username, email } = req.rootuser;
    res.json({ username, email });
});

router.get("/logout", (req, res) => {
    res.clearCookie("jwt", { path: "/" });
    res.status(200).send("hello");
    // return res.send(req.rootuser)
});
router.post("/forgot-password", async(req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        if (!oldUser) {
            return res.json({ status: "User not exists" });
        }
        const secret = JWT_SECRET + oldUser.password;
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
            expiresIn: "10m",
        });
        console.log(token);
        const decoded = jwt.decode(token);
        console.log(decoded);

        const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "yashm13114@gmail.com",
                pass: "pkwbruokbahvijda",
            },
        });
        // Shyanne Kiehn
        var mailOptions = {
            from: "youremail@gmail.com",
            to: email,
            subject: "Forgot Password",
            text: link,
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
        console.log(link);
    } catch (err) {
        console.log(err);
    }
});

router.get("/reset-password/:id/:token", async(req, res, next) => {
    const { id, token } = req.params;
    // console.log(req.params);
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User not exists" });
    }
    const secret = JWT_SECRET + oldUser.password;

    try {
        // const verify = jwt.verify(token, secret);
        const verify = jwt.verify(token, secret, { algorithm: "HS256" });
        var decoded = jwt.verify(token, secret, { algorithm: "HS256" });

        return res.render("index", { email: decoded.email, status: " verified" });
        // return res.json({ status: "Verified" });
    } catch (err) {
        console.log(err);
        return res.json({ status: "Not Verified" });
    }
});

router.post("/reset-password/:id/:token", async(req, res) => {
    const { id, token } = req.params;
    const { password, cpassword } = req.body;

    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User not exists" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const secret2 = JWT_SECRET + oldUser.cpassword;
    try {
        const verify = jwt.verify(token, secret, { algorithm: "HS256" });

        const verify2 = jwt.verify(token, secret2, { algorithm: "HS256" });

        const encryptedpass = await bcrypt.hash(password, 12);
        const encryptedpass2 = await bcrypt.hash(cpassword, 12);
        await User.updateOne({
            _id: id,
        }, {
            $set: {
                password: encryptedpass,
                cpassword: encryptedpass2,
            },
        });

        return res.json({ status: "updated" });
    } catch (err) {
        console.log(err);
        return res.json({ status: "Something Went Wrong" });
    }
});

router
    .post("/add-expense", addExpense)
    .get("/get-expenses", getExpense)
    .get("/get-profile/:id", getProfile)
    .delete("/delete-expense/:id", deleteExpense);
router.get("/getTransactions", getTransactions);

// get and post routes
router.post("/add-transaction", addTransaction)

router.get("/get-transaction", getAllTransaction)

module.exports = router;