const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true, //+998901234567
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    expense_category: {
      type: mongoose.Types.ObjectId,
      ref: "ExpenseCategory",
      default: null,
    },
    saved_extra_fields: {
      type: [
        {
          schema: {
            type: String,
            required: true,
            enum: ["student", "subject", "group", "teacher", "staff"],
          },
          field_name: {
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

module.exports = mongoose.model("Organization", OrganizationSchema);
