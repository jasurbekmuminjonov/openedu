const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    expense_category_id: {
      type: mongoose.Types.ObjectId,
      ref: "ExpenseCategory",
      required: true,
    },
    expense_subname: {
      type: String,
      default: null,
    },
    expense_amount: {
      type: Number,
      required: true,
    },
    org_id: {
      type: mongoose.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", ExpenseSchema);
