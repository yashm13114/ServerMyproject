const mongoose = require("mongoose");
const db = process.env.DATABASE
mongoose
    .connect(db)
    .then(() => {
        console.log("Connected to mongo");
    })
    .catch((err) => {
        console.log("error" + err);
    });