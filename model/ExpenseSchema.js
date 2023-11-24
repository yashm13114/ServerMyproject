const mongoose = require('mongoose');


const ExpenseSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    amount: {
        type: Number,
        required: true,
        maxLength: 20,
        trim: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Expense', ExpenseSchema)