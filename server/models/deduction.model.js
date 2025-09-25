const mongoose = require("mongoose");

const DeductionSchema = new mongoose.Schema(
  {
    subscription_id: {
      type: mongoose.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    users: {
      type: [
        {
          group_id: {
            type: mongoose.Types.ObjectId,
            ref: "Group",
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
        },
      ],
      default: [],
    },
    total_summ: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deduction", DeductionSchema);
