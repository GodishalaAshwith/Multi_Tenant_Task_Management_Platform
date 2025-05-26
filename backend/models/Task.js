const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["Bug", "Feature", "Improvement"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Completed", "Expired"],
      default: "Todo",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    notifications: [
      {
        message: String,
        createdAt: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

// Index for querying tasks by organization
TaskSchema.index({ organization: 1, createdAt: -1 });
// Index for checking expired tasks
TaskSchema.index({ status: 1, dueDate: 1 });

module.exports = mongoose.model("Task", TaskSchema);
