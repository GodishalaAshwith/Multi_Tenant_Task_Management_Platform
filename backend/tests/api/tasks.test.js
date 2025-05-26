const request = require("supertest");
const app = require("../../server");
const User = require("../../models/User");
const Task = require("../../models/Task");
const { generateToken } = require("../../utils/auth");

describe("Task API Endpoints", () => {
  let token;
  let testUser;
  let testTask;

  beforeEach(async () => {
    // Create test user
    testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      organization: new mongoose.Types.ObjectId(),
      role: "admin",
    });

    // Generate token
    token = generateToken(testUser);

    // Create test task
    testTask = await Task.create({
      title: "Test Task",
      description: "Test Description",
      organization: testUser.organization,
      assignedTo: testUser._id,
      createdBy: testUser._id,
      category: "Bug",
      priority: "High",
      dueDate: new Date(),
    });
  });

  describe("GET /api/tasks", () => {
    it("should get all tasks", async () => {
      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("should fail without auth token", async () => {
      const res = await request(app).get("/api/tasks");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      const newTask = {
        title: "New Task",
        description: "New Description",
        assignedTo: testUser._id,
        category: "Feature",
        priority: "Medium",
        dueDate: new Date(),
      };

      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(newTask);

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe(newTask.title);
    });

    it("should fail to create task with invalid data", async () => {
      const invalidTask = {
        title: "Invalid Task",
        // Missing required fields
      };

      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidTask);

      expect(res.statusCode).toBe(400);
    });
  });

  describe("PATCH /api/tasks/:id", () => {
    it("should update a task", async () => {
      const update = {
        title: "Updated Task",
        status: "In Progress",
      };

      const res = await request(app)
        .patch(`/api/tasks/${testTask._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(update);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe(update.title);
      expect(res.body.status).toBe(update.status);
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task", async () => {
      const res = await request(app)
        .delete(`/api/tasks/${testTask._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

      const deletedTask = await Task.findById(testTask._id);
      expect(deletedTask).toBeNull();
    });
  });
});
