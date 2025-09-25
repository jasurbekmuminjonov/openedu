const Payment = require("../models/payment.model");
const Student = require("../models/student.model");
const Org = require("../models/organization.model");
const Expense = require("../models/expense.model");
const mongoose = require("mongoose");

exports.createPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { student_id, payment_amount, is_expense } = req.body;
    const { user_id, org_id } = req.user;
    if (!user_id) {
      return res.status(400).json({ message: "for_staff_only" });
    }
    if (is_expense) {
      const org = await Org.findById(org_id);
      const student = await Student.findById(student_id);
      await Expense.create({
        expense_category_id: org.expense_category,
        expense_subname: `${student.first_name} ${student.last_name} balansda xatolik`,
        expense_amount: payment_amount,
        org_id,
      });
    }
    await Student.findByIdAndUpdate(
      student_id,
      { $inc: { balance: payment_amount } },
      { session }
    );

    const payment = await Payment.create(
      [{ ...req.body, staff_id: user_id, org_id }],
      { session }
    );

    await session.commitTransaction();
    res.json({ message: "success", data: { payment } });
  } catch (err) {
    await session.abortTransaction();
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  } finally {
    session.endSession();
  }
};

exports.getPayment = async (req, res) => {
  try {
    const { student_id } = req.query;
    const filter = student_id
      ? { org_id: req.user.org_id, student_id }
      : { org_id: req.user.org_id };
    const payment = await Payment.find(filter)
      .populate("student_id")
      .populate("staff_id");
    res.json(payment);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};
