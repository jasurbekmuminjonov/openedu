const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema(
  {
    group_id: {
      type: mongoose.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    exam_title: {
      type: String,
      required: true,
    },
    exam_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "completed", "canceled"],
    },
    grades: {
      type: [
        {
          student_id: {
            type: mongoose.Types.ObjectId,
            ref: "Student",
            required: true,
          },
          result: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
          },
          is_absent: {
            type: Boolean,
            required: true,
          },
        },
      ],
      default: [],
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

module.exports = mongoose.model("Exam", ExamSchema);
