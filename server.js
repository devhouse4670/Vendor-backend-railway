import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import dataRoutes from "./routes/data.js";

dotenv.config();

const app = express();

// Trust proxy if behind a proxy (Render, Heroku)
app.set("trust proxy", 1);

// CORS setup
app.use(cors({
  origin: "https://vendor-frontend-omega.vercel.app", // frontend URL
  credentials: true,  // allow cookies/credentials
}));

// Handle preflight requests
app.options("*", cors({
  origin: "https://vendor-frontend-omega.vercel.app",
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/data", dataRoutes);

// Example protected route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
