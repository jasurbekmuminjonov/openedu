const { hashPassword } = require("../helpers/user.helper");
const Teacher = require("../models/teacher.model");

exports.createTeacher = async (req, res) => {
  try {
    const hashed = await hashPassword(req.body.phone.slice(-4));
    const teacher = await Teacher.create({
      ...req.body,
      password: hashed,
      org_id: req.user.org_id,
    });
    res.json({ message: "success", data: { teacher } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.find({ org_id: req.user.org_id });
    res.json(teacher);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};
