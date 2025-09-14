const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema(
  {
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
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true, //+998901234567
      unique: true,
    },
    password: { type: String, required: true, unique: true },
    sections: {
      type: [
        {
          type: String,
          enum: [
            "student",
            "payment",
            "salary",
            "expense",
            "group",
            "subscription",
            "subject",
            "teacher",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", StaffSchema);
