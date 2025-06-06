const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const initializeTaskExpiryJob = require("./utils/taskExpiryJob");

dotenv.config(); // Load environment variables

const app = express();
connectDB(); // Connect to MongoDB

// Initialize task expiry job
initializeTaskExpiryJob();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // Allow frontend to connect
app.use(express.json()); // Parse JSON body

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
