const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/schoolImages', express.static(path.join(__dirname, 'schoolImages')));

// Database connection
require("./config/db");

// Routes
const schoolRoutes = require("./routes/schoolRoutes");
const authRoutes = require("./routes/authRoutes");
app.use("/api/schools", schoolRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "School Management System API" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Page Not Found" });
});

const Port = process.env.PORT || 5000;

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
