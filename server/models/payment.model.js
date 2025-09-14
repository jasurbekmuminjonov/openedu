const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    payment_amount: {
      type: Number,
      required: true,
    },
    org_id: {
      type: mongoose.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    staff_id: {
      type: mongoose.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
