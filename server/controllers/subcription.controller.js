const Subscription = require("../models/subscription.model");

exports.createSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      org_id: req.user.org_id,
    });
    res.json({ message: "success", data: { subscription } });
  } catch (err) {
    console.log(err.message);
    a;
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.editSubscription = async (req, res) => {
  try {
    const { subscription_id } = req.body;
    const subscription = await Subscription.findByIdAndUpdate(
      subscription_id,
      req.body
    );
    res.json({ message: "success", data: { subscription } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.find({ org_id: req.user.org_id });
    res.json(subscription);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "server_error", data: { err } });
  }
};
