import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dataRoutes from "./routes/data.js";
import vendorRoutes from "./routes/vendors.js";
import campaignRoutes from "./routes/campaign.js";
import userRoutes from "./routes/userRoutes.js";
import Campaign from "./models/Campaign.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.log("❌ MongoDB Error:", err));

app.use("/api/data", dataRoutes);
app.use("/api/vendors", vendorRoutes);  // ⬅ IMPORTANT FIX

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

app.use("/api/campaigns", campaignRoutes);


app.use("/api/users", userRoutes);


app.use("/api/auth", authRoutes);



app.use('/api/data/vendors', vendorRoutes);

