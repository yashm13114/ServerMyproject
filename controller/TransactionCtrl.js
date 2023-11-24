const TransactionSchema = require("../model/TransactionSchema");

const getAllTransaction = async(req, res) => {
    try {
        const Transactions = await TransactionSchema.find({ userid: req.body.userid });
        res.status(201).json(Transactions);
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error');
    }
};

const addTransaction = async(req, res) => {
    try {
        const newTransaction = new TransactionSchema(req.body);
        await newTransaction.save();
        res.status(201).json({ message: "transaction added successfully" });
    } catch (err) {
        console.log(err)
        res.status(500).send('Error while adding transaction');
    }
};

module.exports = { getAllTransaction, addTransaction };