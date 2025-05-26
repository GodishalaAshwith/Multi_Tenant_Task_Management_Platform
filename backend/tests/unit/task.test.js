const Task = require("../../models/Task");
const mongoose = require("mongoose");

describe("Task Model Test", () => {
  const taskData = {
    title: "Test Task",
    description: "Test Description",
    organization: new mongoose.Types.ObjectId(),
    assignedTo: new mongoose.Types.ObjectId(),
    createdBy: new mongoose.Types.ObjectId(),
    category: "Bug",
    priority: "High",
    status: "Todo",
    dueDate: new Date(),
  };

  it("should create & save task successfully", async () => {
    const validTask = new Task(taskData);
    const savedTask = await validTask.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe(taskData.title);
    expect(savedTask.status).toBe("Todo"); // Default status
  });

  it("should fail to save task without required fields", async () => {
    const taskWithoutRequiredField = new Task({ title: "Test Task" });
    let err;

    try {
      await taskWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it("should fail to save task with invalid category", async () => {
    const taskWithInvalidCategory = new Task({
      ...taskData,
      category: "InvalidCategory",
    });
    let err;

    try {
      await taskWithInvalidCategory.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it("should fail to save task with invalid priority", async () => {
    const taskWithInvalidPriority = new Task({
      ...taskData,
      priority: "InvalidPriority",
    });
    let err;

    try {
      await taskWithInvalidPriority.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
