const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../helpers/user.helper");
const Org = require("../models/organization.model");
const ExpenseCategory = require("../models/expense-category.model");
const Expense = require("../models/expense.model");
const Group = require("../models/group.model");
const Payment = require("../models/payment.model");
const Salary = require("../models/salary.model");
const Staff = require("../models/staff.model");
const Student = require("../models/student.model");
const Subscription = require("../models/subscription.model");
const Subject = require("../models/subject.model");
const Teacher = require("../models/teacher.model");

exports.createOrganization = async (req, res) => {
  try {
    const { password } = req.body;
    const hashed = await hashPassword(password);
    const org = await Org.create({ ...req.body, password: hashed });
    const expCat = await ExpenseCategory.create({
      org_id: org._id,
      expense_category_name: "To'lov va balans muammolari",
    });
    await Org.findByIdAndUpdate(org._id, { expense_category: expCat });
    return res.json({ message: "success" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "server_error", data: { err: err.message } });
  }
};

exports.loginOrganization = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const org = await Org.findOne({ phone });
    if (!org) {
      return res.status(400).json({ message: "organization_not_found" });
    }
    const isMatch = await comparePassword(password, org.password);
    if (!isMatch) {
      return res.status(400).json({ message: "password_incorrect" });
    }
    const token = generateToken({ org_id: org._id, role: "admin" });
    res.json({ message: "success", data: { token, org } });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "server_error", data: { err: err.message } });
  }
};

exports.editOrganizationPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { org_id } = req.user;
    const org = await Org.findById(org_id);
    if (!org) {
      return res.status(400).json({ message: "organization_not_found" });
    }
    const hashed = await hashPassword(password);
    org.password = hashed;
    await org.save();
    res.json({ message: "success" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "server_error", data: { err: err.message } });
  }
};

exports.editOrganization = async (req, res) => {
  try {
    const { phone, saved_extra_fields, name } = req.body;
    const { org_id } = req.user;
    const org = await Org.findById(org_id);
    if (!org) {
      return res.status(400).json({ message: "organization_not_found" });
    }
    if (phone) {
      org.phone = phone;
    }
    if (saved_extra_fields) {
      org.saved_extra_fields = saved_extra_fields;
    }
    if (name) {
      org.name = name;
    }
    await org.save();
    res.json({ message: "success" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "server_error", data: { err: err.message } });
  }
};

exports.terminateOrganization = async (req, res) => {
  try {
    const { password } = req.body;
    const org = await Org.findById(req.user.org_id);
    if (!org) {
      return res.status(400).json({ message: "organization_not_found" });
    }

    const isMatch = await comparePassword(password, org.password);
    if (!isMatch) {
      return res.status(400).json({ message: "password_incorrect" });
    }

    await Promise.all([
      ExpenseCategory.deleteMany({ org_id: org._id }),
      Expense.deleteMany({ org_id: org._id }),
      Group.deleteMany({ org_id: org._id }),
      Payment.deleteMany({ org_id: org._id }),
      Salary.deleteMany({ org_id: org._id }),
      Staff.deleteMany({ org_id: org._id }),
      Student.deleteMany({ org_id: org._id }),
      Subscription.deleteMany({ org_id: org._id }),
      Subject.deleteMany({ org_id: org._id }),
      Teacher.deleteMany({ org_id: org._id }),
    ]);

    await org.deleteOne();

    return res.json({ message: "success" });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ message: "server_error", data: { err: err.message } });
  }
};
