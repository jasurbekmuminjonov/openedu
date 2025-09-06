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
    const { org_password } = req.body;
    const hashed = await hashPassword(org_password);
    await Org.create({ ...req.body, org_password: hashed });
    return res.status({ message: "success" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", err });
  }
};

exports.loginOrganization = async (req, res) => {
  try {
    const { org_phone, org_password } = req.body;
    const org = await Org.findOne({ org_phone });
    if (!org) {
      return res.json({ message: "organization_not_found" });
    }
    const isMatch = await comparePassword(org_password, org.org_password);
    if (!isMatch) {
      return res.json({ message: "password_incorrect" });
    }
    const token = generateToken({ org_id: org._id, role: "admin" });
    res.json({ message: "success", data: { token } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", err });
  }
};

exports.editOrganizationPassword = async (req, res) => {
  try {
    const { org_password } = req.body;
    const { org_id } = req.user;
    const org = await Org.findById(org_id);
    if (!org) {
      return res.json({ message: "organization_not_found" });
    }
    const hashed = await hashPassword(org_password);
    org.org_password = hashed;
    await org.save();
    res.json({ message: "success" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.editOrganization = async (req, res) => {
  try {
    const { org_phone, saved_extra_fields, org_name } = req.body;
    const { org_id } = req.user;
    const org = await Org.findById(org_id);
    if (!org) {
      return res.json({ message: "organization_not_found" });
    }
    if (org_phone) {
      org.org_phone = org_phone;
    }
    if (saved_extra_fields) {
      org.saved_extra_fields = saved_extra_fields;
    }
    if (org_name) {
      org.org_name = org_name;
    }
    await org.save();
    res.json({ message: "success" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};

exports.terminateOrganization = async (req, res) => {
  try {
    const { org_password } = req.body;
    const org = await Org.findById(req.user.org_id);
    if (!org) {
      return res.json({ message: "organization_not_found" });
    }

    const isMatch = await comparePassword(org_password, org.org_password);
    if (!isMatch) {
      return res.json({ message: "password_incorrect" });
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
      .json({ message: "Serverda xatolik", err: err.message });
  }
};
