const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");
const router = express.Router();

// Create a new task (Admin, Manager)
router.post(
  "/",
  authMiddleware,
  checkRole(["admin", "manager"]),
  async (req, res) => {
    try {
      const { title, description, assignedTo, category, priority, dueDate } =
        req.body;

      const task = new Task({
        title,
        description,
        organization: req.organizationId,
        assignedTo,
        createdBy: req.user._id,
        category,
        priority,
        dueDate,
      });

      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get all tasks for organization
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ organization: req.organizationId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get task by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task (Admin, Manager, or Assigned User)
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      organization: req.organizationId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user has permission to update
    const canUpdate =
      req.user.role === "admin" ||
      req.user.role === "manager" ||
      task.assignedTo.toString() === req.user._id.toString();

    if (!canUpdate) {
      return res.status(403).json({
        message: "You don't have permission to update this task",
      });
    }

    // If not admin/manager, can only update status
    if (req.user.role === "member") {
      const { status } = req.body;
      if (status && status !== "Expired") {
        task.status = status;
      }
    } else {
      // Admin/Manager can update all fields
      Object.keys(req.body).forEach((key) => {
        if (key !== "organization" && key !== "createdBy") {
          task[key] = req.body[key];
        }
      });
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task (Admin, Manager only)
router.delete(
  "/:id",
  authMiddleware,
  checkRole(["admin", "manager"]),
  async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        organization: req.organizationId,
      });

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get my tasks
router.get("/my/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      organization: req.organizationId,
      assignedTo: req.user._id,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my notifications
router.get("/my/notifications", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      organization: req.organizationId,
      assignedTo: req.user._id,
      "notifications.read": false,
    }).select("notifications");

    const notifications = tasks
      .flatMap((task) => task.notifications)
      .filter((notification) => !notification.read)
      .sort((a, b) => b.createdAt - a.createdAt);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.patch("/notifications/:taskId", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      organization: req.organizationId,
      assignedTo: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.notifications.forEach((notification) => {
      notification.read = true;
    });

    await task.save();
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
