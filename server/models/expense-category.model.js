const mongoose = require("mongoose");

const ExpenseCategorySchema = new mongoose.Schema(
  {
    expense_category_name: {
      type: String,
      required: true,
    },
    org_id: {
      type: mongoose.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExpenseCategory", ExpenseCategorySchema);
