const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    middle_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true, //+998901234567
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    password: { type: String, required: true },
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

module.exports = mongoose.model("Student", StudentSchema);
