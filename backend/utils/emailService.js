const nodemailer = require("nodemailer");
require("dotenv").config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendInvitationEmail = async (
  recipientEmail,
  inviteCode,
  organizationName,
  inviterName
) => {
  try {
    const inviteUrl = `${process.env.FRONTEND_URL}/register?inviteCode=${inviteCode}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `Invitation to join ${organizationName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You've been invited!</h2>
          <p>${inviterName} has invited you to join their organization: <strong>${organizationName}</strong></p>
          
          <div style="margin: 20px 0;">
            <p>Your invitation code is: <strong>${inviteCode}</strong></p>
          </div>
          
          <div style="margin: 30px 0;">
            <a href="${inviteUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Accept Invitation
            </a>
          </div>
          
          <p>Or you can manually enter this code when registering: <strong>${inviteCode}</strong></p>
          
          <p style="color: #666; margin-top: 30px; font-size: 14px;">
            This invitation will expire in 7 days.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendInvitationEmail,
};
