const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    subscription_id: {
      type: mongoose.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    students: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Student",
          required: true,
        },
      ],
      default: [],
    },
    teacher_id: {
      type: mongoose.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },
    org_id: {
      type: mongoose.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    extra_fields: {
      type: [
        {
          field_name: {
            type: String,
            required: true,
          },
          field_value: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", GroupSchema);
