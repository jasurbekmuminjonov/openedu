const mongoose = require("mongoose");

const SalarySchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    salary_amount: {
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

module.exports = mongoose.model("Salary", SalarySchema);
