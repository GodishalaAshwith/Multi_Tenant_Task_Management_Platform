const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Organization = require("../models/Organization");
const Invitation = require("../models/Invitation");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");
const crypto = require("crypto");

const router = express.Router();

// Register User with Organization
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, organizationType, organizationName, inviteCode } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let organization;
    let role = "member";

    if (inviteCode) {
      // Join existing organization via invite
      const invitation = await Invitation.findOne({ 
        inviteCode,
        email,
        status: "pending",
        expiresAt: { $gt: new Date() }
      });

      if (!invitation) {
        return res.status(400).json({ message: "Invalid or expired invite code" });
      }

      organization = invitation.organization;
      role = invitation.role;

      // Update invitation status
      invitation.status = "accepted";
      await invitation.save();
    } else if (organizationType === "create" && organizationName) {
      // Create new organization
      organization = new Organization({
        name: organizationName,
        inviteCode: crypto.randomBytes(6).toString("hex"),
        createdBy: null // Will update after user creation
      });
      role = "admin";
    } else {
      return res.status(400).json({ 
        message: "Must either provide an invite code or create a new organization" 
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      organization: organization._id,
      role
    });

    // If creating new org, update the createdBy field
    if (organizationType === "create") {
      organization.createdBy = user._id;
      await organization.save();
    }

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email })
      .populate("organization", "name inviteCode");
      
    if (!user || !user.isActive) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        organizationId: user.organization._id
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: {
          id: user.organization._id,
          name: user.organization.name
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Info (Protected)
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("organization", "name inviteCode");
      
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const { sendInvitationEmail } = require("../utils/emailService");

// Create Invitation (Protected - Admin/Manager only)
router.post("/invite", 
  authMiddleware, 
  checkRole(["admin", "manager"]), 
  async (req, res) => {
    try {
      const { email, role = "member" } = req.body;

      // Validate role assignment
      if (req.user.role === "manager" && role === "admin") {
        return res.status(403).json({ 
          message: "Managers cannot assign admin roles" 
        });
      }

      // Check if user already exists in organization
      const existingUser = await User.findOne({ 
        email, 
        organization: req.organizationId 
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: "User already exists in this organization" 
        });
      }

      // Check for existing pending invitation
      const existingInvite = await Invitation.findOne({
        email,
        organization: req.organizationId,
        status: "pending",
        expiresAt: { $gt: new Date() }
      });

      if (existingInvite) {
        return res.status(400).json({ 
          message: "An active invitation already exists for this email" 
        });
      }

      // Create new invitation
      const inviteCode = crypto.randomBytes(6).toString("hex");
      const invitation = new Invitation({
        organization: req.organizationId,
        email,
        role,
        inviteCode,
        invitedBy: req.user._id
      });

      await invitation.save();

      // Send invitation email
      try {
        await sendInvitationEmail(
          email,
          inviteCode,
          req.user.organization.name,
          req.user.name
        );
      } catch (emailError) {
        // If email fails, log it but don't fail the request
        console.error("Failed to send invitation email:", emailError);
      }

      res.status(201).json({ 
        message: "Invitation sent successfully",
        inviteCode
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Get Organization Members (Protected)
router.get("/members", 
  authMiddleware,
  async (req, res) => {
    try {
      const members = await User.find({ 
        organization: req.organizationId 
      })
      .select("-password")
      .sort({ role: 1, name: 1 });

      res.json(members);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Update User Role (Protected - Admin only)
router.patch("/users/:userId/role",
  authMiddleware,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const { role } = req.body;
      const { userId } = req.params;

      // Prevent self-role change
      if (userId === req.user._id.toString()) {
        return res.status(400).json({ 
          message: "Cannot change your own role" 
        });
      }

      const user = await User.findOne({ 
        _id: userId,
        organization: req.organizationId
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = role;
      await user.save();

      res.json({ message: "User role updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Remove User from Organization (Protected - Admin only)
router.delete("/users/:userId",
  authMiddleware,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const { userId } = req.params;

      // Prevent self-removal
      if (userId === req.user._id.toString()) {
        return res.status(400).json({ 
          message: "Cannot remove yourself from the organization" 
        });
      }

      const user = await User.findOne({ 
        _id: userId,
        organization: req.organizationId
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.isActive = false;
      await user.save();

      res.json({ message: "User removed from organization successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

module.exports = router;
