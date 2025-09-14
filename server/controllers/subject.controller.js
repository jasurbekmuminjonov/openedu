const Subject = require("../models/subject.model");

exports.createSubject = async (req, res) => {
  try {
    const subject = await Subject.create({
      ...req.body,
      org_id: req.user.org_id,
    });
    res.json({ message: "success", data: { subject } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.getSubject = async (req, res) => {
  try {
    const subject = await Subject.find({ org_id: req.user.org_id });
    res.json(subject);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};
