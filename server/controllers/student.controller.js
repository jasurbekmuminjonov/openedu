const { hashPassword } = require("../helpers/user.helper");
const Student = require("../models/student.model");
const Group = require("../models/group.model");

exports.createStudent = async (req, res) => {
  try {
    const hashed = await hashPassword(req.body.phone.slice(-4));
    const student = await Student.create({
      ...req.body,
      password: hashed,
      org_id: req.user.org_id,
    });
    res.json({ message: "success", data: { student } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.editStudent = async (req, res) => {
  try {
    const { student_id } = req.body;
    delete req.body.balance;
    const student = await Student.findByIdAndUpdate(student_id, req.body);
    res.json({ message: "success", data: { student } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const student = await Student.find({ org_id: req.user.org_id });
    res.json(student);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.getStudentByQuery = async (req, res) => {
  try {
    const { group_id, id, q } = req.query;

    if (!group_id && !id && (!q || q.length <= 3)) {
      return res.json([]);
    }

    if (id) {
      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({ message: "student_not_found" });
      }
      return res.json(student);
    }

    let students = [];
    if (group_id) {
      const group = await Group.findById(group_id);
      if (!group) {
        return res.status(404).json({ message: "group_not_found" });
      }

      const ids = group.students.map((s) => s.student_id);

      students = await Student.find({ _id: { $in: ids } });
    } else {
      students = await Student.find({ org_id: req.user.org_id });
    }

    if (q) {
      const queryLower = q.toLowerCase();
      students = students.filter((s) => {
        const combined =
          `${s.first_name}${s.last_name}${s.middle_name}${s.phone}`.toLowerCase();
        return combined.includes(queryLower);
      });
    }

    res.json(students);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};
