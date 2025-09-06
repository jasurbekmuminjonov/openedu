const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema(
  {
    org_name: {
      type: String,
      required: true,
    },
    org_phone: {
      type: String,
      required: true, //+998901234567
      unique: true,
    },
    org_password: {
      type: String,
      required: true,
    },
    saved_extra_fields: {
      type: [
        {
          schema: {
            type: String,
            required: true,
            enum: ["user", "subject", "group", "teacher", "staff"],
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
