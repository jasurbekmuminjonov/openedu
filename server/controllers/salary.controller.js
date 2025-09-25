const Salary = require("../models/salary.model");

exports.createSalary = async (req, res) => {
  try {
    const salary = await Salary.create({
      ...req.body,
      org_id: req.user.org_id,
    });
    res.json({ message: "success", data: { salary } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.getSalary = async (req, res) => {
  try {
    const { teacher_id } = req.query;
    const salary = await Salary.find(
      teacher_id
        ? { org_id: req.user.org_id, teacher_id }
        : { org_id: req.user.org_id }
    ).populate("teacher_id");
    res.json(salary);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.deleteSalary = async (req, res) => {
  try {
    await Salary.findByIdAndDelete(req.body.salary_id);
    res.json({ message: "successfuly_deleted" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};
