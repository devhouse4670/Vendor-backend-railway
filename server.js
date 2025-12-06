import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dataRoutes from "./routes/data.js";
import vendorRoutes from "./routes/vendors.js";
import campaignRoutes from "./routes/campaign.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["https://vendor-frontend-omega.vercel.app"],
  credentials: true,
}));
app.use(express.json());

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Routes
app.use("/api/data", dataRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
