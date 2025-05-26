const request = require("supertest");
const app = require("../../server");
const User = require("../../models/User");
const Invitation = require("../../models/Invitation");
const Organization = require("../../models/Organization");
const { generateToken } = require("../../utils/auth");
const mongoose = require("mongoose");

describe("Invitation System Integration Tests", () => {
  let adminToken;
  let memberToken;
  let testOrg;
  let adminUser;
  let memberUser;

  beforeEach(async () => {
    // Create test organization
    testOrg = await Organization.create({
      name: "Test Organization",
      plan: "basic",
      settings: {
        allowGuestAccess: false,
      },
    });

    // Create admin user
    adminUser = await User.create({
      name: "Test Admin",
      email: "admin@test.com",
      password: "password123",
      organization: testOrg._id,
      role: "admin",
    });

    // Create member user
    memberUser = await User.create({
      name: "Test Member",
      email: "member@test.com",
      password: "password123",
      organization: testOrg._id,
      role: "member",
    });

    adminToken = generateToken(adminUser);
    memberToken = generateToken(memberUser);
  });

  describe("POST /api/invitations", () => {
    it("admin can create invitation", async () => {
      const res = await request(app)
        .post("/api/invitations")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          email: "newuser@test.com",
          role: "member",
        });

      expect(res.status).toBe(201);
      expect(res.body.email).toBe("newuser@test.com");
      expect(res.body.organization).toBe(testOrg._id.toString());
    });

    it("member cannot create invitation", async () => {
      const res = await request(app)
        .post("/api/invitations")
        .set("Authorization", `Bearer ${memberToken}`)
        .send({
          email: "newuser@test.com",
          role: "member",
        });

      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/invitations/:token", () => {
    it("can fetch invitation details", async () => {
      const invitation = await Invitation.create({
        email: "newuser@test.com",
        organization: testOrg._id,
        role: "member",
        token: "test-token-123",
      });

      const res = await request(app).get(
        `/api/invitations/${invitation.token}`
      );

      expect(res.status).toBe(200);
      expect(res.body.organization.name).toBe("Test Organization");
      expect(res.body.role).toBe("member");
    });

    it("returns 404 for invalid token", async () => {
      const res = await request(app).get("/api/invitations/invalid-token");

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/invitations/:token/accept", () => {
    it("can accept invitation and create user", async () => {
      const invitation = await Invitation.create({
        email: "newuser@test.com",
        organization: testOrg._id,
        role: "member",
        token: "test-token-123",
      });

      const res = await request(app)
        .post(`/api/invitations/${invitation.token}/accept`)
        .send({
          name: "New User",
          password: "password123",
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();

      // Verify user was created
      const user = await User.findOne({ email: "newuser@test.com" });
      expect(user).toBeDefined();
      expect(user.organization.toString()).toBe(testOrg._id.toString());
      expect(user.role).toBe("member");
    });
  });
});
