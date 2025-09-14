const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
  {
    group_id: {
      type: mongoose.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    lesson_date: {
      type: Date,
      required: true,
    },
    grades: {
      type: [
        {
          student_id: {
            type: mongoose.Types.ObjectId,
            ref: "Student",
            required: true,
          },
          mark: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
          },
          is_absent: {
            type: Boolean,
            required: true,
          },
          without_homework: {
            type: Boolean,
            required: true,
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", LessonSchema);
