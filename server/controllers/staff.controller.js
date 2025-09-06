const { hashPassword } = require("../helpers/user.helper");
const Staff = require("../models/staff.model");

exports.createStaff = async (req, res) => {
  try {
    const { org_id } = req.user;
    const { password } = req.body;
    const hashed = await hashPassword(password);
    await Staff.create({ ...req.body, org_id, password: hashed });
    res.json({ message: "success" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik", err });
  }
};
