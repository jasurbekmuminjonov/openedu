const cron = require("node-cron");
const Group = require("../models/group.model");
const Student = require("../models/student.model");
const Subscription = require("../models/subscription.model");
const Deduction = require("../models/deduction.model");

cron.schedule("0 */6 * * *", async () => {
  try {
    const now = new Date();
    const today = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const subscriptions = await Subscription.find({
      subscription_date: today,
      $or: [
        { last_charged_month: { $ne: currentMonth } },
        { last_charged_year: { $ne: currentYear } },
      ],
    });

    for (const subscription of subscriptions) {
      const groups = await Group.find({ subscription_id: subscription._id });

      if (!groups || groups.length === 0) continue;

      let deductionData = {
        subscription_id: subscription._id,
        users: [],
        total_summ: 0,
      };

      for (const group of groups) {
        if (!group.students || group.students.length === 0) continue;

        const studentIds = group.students.map((s) => s.student_id);

        await Student.updateMany(
          { _id: { $in: studentIds } },
          {
            $inc: { balance: -subscription.subscription_amount },
            $push: {
              deductions: {
                deduction_date: now,
                deduction_amount: subscription.subscription_amount,
                group_id: group._id,
              },
            },
          }
        );

        deductionData.users.push({
          group_id: group._id,
          students: studentIds,
        });

        deductionData.total_summ +=
          subscription.subscription_amount * studentIds.length;
      }

      if (deductionData.users.length > 0) {
        await Deduction.create(deductionData);
      }

      subscription.last_charged_month = currentMonth;
      subscription.last_charged_year = currentYear;
      await subscription.save();
    }
  } catch (err) {
    console.error("cron_job_error", err.message);
  }
});
