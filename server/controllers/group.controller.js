const Group = require("../models/group.model");

exports.createGroup = async (req, res) => {
  try {
    const group = await Group.create({ ...req.body, org_id: req.user.org_id });
    res.json({ message: "success", data: { group } });
  } catch (err) {
    console.log(err.message);
    a;
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.editGroup = async (req, res) => {
  try {
    const { group_id } = req.body;
    const group = await Group.findByIdAndUpdate(group_id, req.body);
    res.json({ message: "success", data: { group } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.getGroup = async (req, res) => {
  try {
    const group = await Group.find({ org_id: req.user.org_id })
      .populate("teacher_id")
      .populate("subscription_id")
      .populate("subject_id");

    res.json(group);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.getGroupByQuery = async (req, res) => {
  try {
    const { teacher_id, subject_id, subscription_id, id, student_id } =
      req.query;

    if (id && id !== "undefined") {
      const group = await Group.findById(id)
        .populate("teacher_id")
        .populate("subject_id")
        .populate("subscription_id");
      if (!group) {
        return res.status(404).json({ message: "group_not_found" });
      }
      return res.json(group);
    }

    const filter = { org_id: req.user.org_id };
    if (teacher_id && teacher_id !== "undefined")
      filter.teacher_id = teacher_id;
    if (subject_id && subject_id !== "undefined")
      filter.subject_id = subject_id;
    if (student_id && student_id !== "undefined")
      filter["students.student_id"] = student_id;
    if (subscription_id && subscription_id !== "undefined")
      filter.subscription_id = subscription_id;
    console.log(filter);

    const groups = await Group.find(filter)
      .populate("teacher_id")
      .populate("subject_id")
      .populate("subscription_id");

    res.json(groups);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};
