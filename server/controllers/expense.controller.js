const ExpenseCategory = require("../models/expense-category.model");
const Expense = require("../models/expense.model");

exports.createExpenseCategory = async (req, res) => {
  try {
    const expenseCategory = await ExpenseCategory.create({
      ...req.body,
      org_id: req.user.org_id,
    });
    res.json({ message: "success", data: { expenseCategory } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      org_id: req.user.org_id,
    });
    res.json({ message: "success", data: { expense } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.find({ org_id: req.user.org_id });
    res.json(expense);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};
exports.getExpenseCategory = async (req, res) => {
  try {
    const expenseCategory = await ExpenseCategory.find({
      org_id: req.user.org_id,
    });
    res.json(expenseCategory);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.body.expense_id);
    res.json({ message: "successfuly_deleted" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.deleteExpenseCategory = async (req, res) => {
  try {
    await ExpenseCategory.findByIdAndDelete(req.body.expense_category_id);
    res.json({ message: "successfuly_deleted" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};
