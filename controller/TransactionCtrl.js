const TransactionSchema = require("../model/TransactionSchema");

const getAllTransaction = async(req, res) => {
    try {
        const { frequency } = req.body;
        const Transactions = await TransactionSchema.find({
            userid: req.body.userid,
        });

        res.status(201).json(Transactions);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
};
const deleteTransaction = async(req, res) => {
    try {
        const { id } = req.params;
        TransactionSchema.findByIdAndDelete(id)
            .then((income) => {
                return res.status(200).json({ message: "Expense Deleted" });
            })
            .catch((err) => {
                return res.status(500).json({ message: "Server Error" });
                console.log(err);
            });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
};
const deleteExpense = async(req, res) => {
    const { id } = req.params;
    TransactionSchema.findByIdAndDelete(id)
        .then((income) => {
            return res.status(200).json({ message: "Expense Deleted" });
        })
        .catch((err) => {
            return res.status(500).json({ message: "Server Error" });
            console.log(err);
        });
};

const addTransaction = async(req, res) => {
    try {
        const newTransaction = new TransactionSchema(req.body);
        await newTransaction.save();
        res.status(201).json({ message: "transaction added successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error while adding transaction");
    }
};
const editTransaction = async(req, res) => {
    try {
        // let transaction = await TransactionSchema.findOneAndUpdate({ _id: req.params._id });
        let transaction = await TransactionSchema.findOneAndUpdate({ _id: req.body.transactionId }, req.body.payload);
        res.status(200).send("transaction edited");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error while editing transaction");
    }
};
const updateTransaction = async(req, res) => {
    try {
        const { id } = req.params;
        const updatedTransaction = req.body; // Assuming the request body contains the updated transaction data

        const result = await TransactionSchema.findByIdAndUpdate(id, updatedTransaction, { new: true });

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllTransaction, addTransaction, deleteTransaction, deleteExpense, editTransaction, updateTransaction };