const request = require("supertest");
const app = require("../../server");
const User = require("../../models/User");
const Organization = require("../../models/Organization");
const { generateToken } = require("../../utils/auth");
const mongoose = require("mongoose");

describe("Organization Integration Tests", () => {
  let token;
  let testUser;
  let testOrg;

  beforeEach(async () => {
    // Create test organization
    testOrg = await Organization.create({
      name: "Test Organization",
      plan: "basic",
      settings: {
        allowGuestAccess: false,
        taskCategories: ["Bug", "Feature", "Documentation"],
      },
    });

    // Create test user
    testUser = await User.create({
      name: "Test Admin",
      email: "admin@test.com",
      password: "password123",
      organization: testOrg._id,
      role: "admin",
    });

    token = generateToken(testUser);
  });

  describe("GET /api/organizations/current", () => {
    it("should get current organization details", async () => {
      const res = await request(app)
        .get("/api/organizations/current")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Test Organization");
      expect(res.body.plan).toBe("basic");
    });

    it("should fail without authentication", async () => {
      const res = await request(app).get("/api/organizations/current");

      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/organizations/settings", () => {
    it("should update organization settings", async () => {
      const newSettings = {
        allowGuestAccess: true,
        taskCategories: ["Bug", "Feature", "Documentation", "Research"],
      };

      const res = await request(app)
        .put("/api/organizations/settings")
        .set("Authorization", `Bearer ${token}`)
        .send({ settings: newSettings });

      expect(res.status).toBe(200);
      expect(res.body.settings.allowGuestAccess).toBe(true);
      expect(res.body.settings.taskCategories).toContain("Research");
    });

    it("should fail for non-admin users", async () => {
      // Create member user
      const memberUser = await User.create({
        name: "Test Member",
        email: "member@test.com",
        password: "password123",
        organization: testOrg._id,
        role: "member",
      });

      const memberToken = generateToken(memberUser);

      const res = await request(app)
        .put("/api/organizations/settings")
        .set("Authorization", `Bearer ${memberToken}`)
        .send({
          settings: {
            allowGuestAccess: true,
          },
        });

      expect(res.status).toBe(403);
    });
  });
});
