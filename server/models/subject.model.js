const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    subject_name: {
      type: String,
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
    org_id: {
      type: mongoose.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", SubjectSchema);
