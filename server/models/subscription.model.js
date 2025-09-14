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
    last_charged_month: {
      type: Number,
      default: null,
      min: 0,
      max: 11,
    },
    last_charged_year: {
      type: Number,
      default: null,
    },
    extra_fields: {
      type: [
        {
          field_name: {
            type: String,
            default: "",
          },
          field_value: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
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
