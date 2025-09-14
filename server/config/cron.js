const cron = require("node-cron");
const Group = require("../models/group.model");
const Student = require("../models/student.model");

cron.schedule("0 */6 * * *", async () => {
  try {
    const now = new Date();
    const today = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const groups = await Group.find().populate("subscription_id");

    for (const group of groups) {
      const subscription = group.subscription_id;

      if (!subscription) continue;

      if (
        subscription.subscription_date === today &&
        (subscription.last_charged_month !== currentMonth ||
          subscription.last_charged_year !== currentYear)
      ) {
        await Student.updateMany(
          { _id: { $in: group.students } },
          {
            $inc: { balance: -subscription.subscription_amount },
            $push: {
              deductions: {
                deduction_date: now,
                deduction_amount: subscription.subscription_amount,
              },
            },
          }
        );

        subscription.last_charged_month = currentMonth;
        subscription.last_charged_year = currentYear;
        await subscription.save();
      }
    }
  } catch (err) {
    console.error("cron_job_error", err.message);
  }
});
