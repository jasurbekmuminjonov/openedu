const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

const generateToken = ({ org_id, role, user_id = null, expires }) => {
  return jwt.sign({ user_id, role, org_id }, process.env.JWT_SECRET, {
    expiresIn: expires,
  });
};

const comparePassword = async (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  generateToken,
  comparePassword,
};
