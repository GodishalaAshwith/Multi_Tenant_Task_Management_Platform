const cron = require("node-cron");
const Task = require("../models/Task");

// Run every hour to check for expired tasks
const initializeTaskExpiryJob = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();

      // Find tasks that are expired but not marked as expired
      const expiredTasks = await Task.find({
        dueDate: { $lt: now },
        status: { $ne: "Expired" },
      });

      // Update each expired task and add notification
      for (const task of expiredTasks) {
        task.status = "Expired";
        task.notifications.push({
          message: `Task "${task.title}" has expired`,
          createdAt: now,
          read: false,
        });
        await task.save();
      }

      console.log(
        `Checked for expired tasks: ${expiredTasks.length} tasks marked as expired`
      );
    } catch (error) {
      console.error("Error in task expiry job:", error);
    }
  });

  console.log("Task expiry job initialized");
};

module.exports = initializeTaskExpiryJob;
