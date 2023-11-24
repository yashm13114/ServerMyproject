const ExpenseSchema = require("../model/ExpenseSchema");
const userSchema = require("../model/UserSchema");

exports.addExpense = async(req, res) => {
    const { title, amount, date } = req.body;

    const income = ExpenseSchema({
        date,
        title,
        amount,
    });

    try {
        //validations
        if (!date || !title || !amount) {
            return res.status(400).json({ message: "All fields are required!" });
        }
        if (amount <= 0 || !amount === "number") {
            return res
                .status(400)
                .json({ message: "Amount must be a positive number!" });
        }
        await income.save();
        res.status(200).json({ message: "Expense Added" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }

    console.log(income);
};

exports.getExpense = async(req, res) => {
    try {
        const incomes = await ExpenseSchema.find().sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getTransactions = async(req, res) => {
    try {
        const transactions = await ExpenseSchema.find({ userid: req.body.userid })
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// exports.getProfile = async(req, res) => {
//     try {
//         const profile = await userSchema.find().sort({ createdAt: -1 })
//         res.status(200).json(profile)
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' })
//     }
// }

exports.deleteExpense = async(req, res) => {
    const { id } = req.params;
    ExpenseSchema.findByIdAndDelete(id)
        .then((income) => {
            return res.status(200).json({ message: "Expense Deleted" });
        })
        .catch((err) => {
            return res.status(500).json({ message: "Server Error" });
            console.log(err);
        });
};
exports.getProfile = async(req, res) => {
    const { id } = req.params;
    userSchema
        .findById(id)
        .then(async(income) => {
            const profile = await userSchema.find()
            return res.status(200).json(profile);
            return res.status(200).json({ message: "Expense Deleted" });
        })
        .catch((err) => {
            return res.status(500).json({ message: "Server Error" });
            console.log(err);
        });
};