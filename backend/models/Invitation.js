const mongoose = require("mongoose");

const InvitationSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "member",
    },
    inviteCode: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      default: "pending",
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invitation", InvitationSchema);
