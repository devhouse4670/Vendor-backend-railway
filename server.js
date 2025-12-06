import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import dataRoutes from "./routes/data.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// CORS Configuration - Must be FIRST middleware
const corsOptions = {
  origin: [
    'https://vendor-frontend-omega.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-JSON'],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Body parser - AFTER CORS
app.use(express.json());
app.use(cookieParser());
// Root Route
app.get("/", (req, res) => {
  res.json({ 
    message: "Vendor Backend API", 
    status: "Running",
    version: "1.0.0",
    cors: "enabled",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      data: "/api/data",
      test: "/api/test"
    }
  });
});

// Test Route
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "Backend is working!", 
    timestamp: new Date(),
    cors: "working"
  });
});

// CORS Test Route
app.get("/api/cors-test", (req, res) => {
  res.json({ 
    message: 'CORS is working!',
    origin: req.headers.origin,
    method: req.method
  });
});

app.post("/api/cors-test", (req, res) => {
  res.json({ 
    message: 'POST CORS is working!',
    body: req.body
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => {
    console.error("❌ MongoDB Error:", err);
    // Don't exit - allow server to run for testing
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/data", dataRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.path,
    method: req.method
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ 
    error: "Internal server error", 
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message 
  });
});

// Listen on 0.0.0.0 for Railway
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS enabled for: ${corsOptions.origin.join(', ')}`);
});
