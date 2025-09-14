const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../helpers/user.helper");
const Staff = require("../models/staff.model");

exports.createStaff = async (req, res) => {
  try {
    const { org_id } = req.user;
    const { password } = req.body;
    const hashed = await hashPassword(password);
    const staff = await Staff.create({ ...req.body, org_id, password: hashed });
    res.json({ message: "success", data: { staff } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.loginStaff = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const staff = await Staff.findOne({ phone });
    if (!staff) {
      return res.status(400).json({ message: "staff_not_found" });
    }
    const isMatch = await comparePassword(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: "password_incorrect" });
    }
    const token = generateToken({
      org_id: staff.org_id,
      role: "staff",
      user_id: staff._id,
    });
    res.json({ message: "success", data: { token, staff } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.find({ org_id: req.user.org_id });
    res.json(staff);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.editStaffPassword = async (req, res) => {
  try {
    const { password, staff_id } = req.body;
    const staff = await Staff.findById(staff_id);
    if (!staff) {
      return res.status(400).json({ message: "staff_not_found" });
    }
    const hashed = await hashPassword(password);
    staff.password = hashed;
    await staff.save();
    res.json({ message: "success" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "server_error", data: { err: err.message } });
  }
};

exports.editStaff = async (req, res) => {
  try {
    const { staff_id } = req.body;

    const staff = await Staff.findByIdAndUpdate(staff_id, req.body);
    if (!staff) {
      return res.status(400).json({ message: "staff_not_found" });
    }

    res.json({ message: "success", data: { staff } });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "server_error", data: { err: err.message } });
  }
};
