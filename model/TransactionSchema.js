const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({

    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    reference: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Transactions", TransactionSchema);