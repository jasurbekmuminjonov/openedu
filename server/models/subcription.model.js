const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    subscription_name: {
      type: String,
      required: true,
    },
    subscription_amount: {
      type: Number,
      required: true,
    },
    subscription_date: {
      type: Number,
      required: true,
      min: 1,
      max: 31,
    },
    org_id: {
      type: mongoose.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
