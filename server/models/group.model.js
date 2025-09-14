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
          student_id: {
            type: mongoose.Types.ObjectId,
            ref: "Student",
            required: true,
          },
          joined_date: {
            type: Date,
            required: true,
          },
        },
      ],
      default: [],
    },
    teacher_id: {
      type: mongoose.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },
    subject_id: {
      type: mongoose.Types.ObjectId,
      ref: "Subject",
      default: null,
    },
    lesson_days: {
      type: [
        {
          type: String,
          required: true,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },
      ],
      default: [],
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
