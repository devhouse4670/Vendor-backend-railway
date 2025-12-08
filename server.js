import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import dataRoutes from "./routes/data.js";

dotenv.config();
console.log("Auth routes loaded");

const app = express();
app.set("trust proxy", 1);

// CORS Configuration - ADD YOUR GODADDY DOMAIN
const allowedOrigins = [
  'https://winexch.blog',           // ✅ ADD THIS - Your GoDaddy domain
  'http://winexch.blog',            // ✅ ADD THIS - HTTP version
  'https://www.winexch.blog',       // ✅ ADD THIS - WWW version
  'http://www.winexch.blog',        // ✅ ADD THIS - WWW HTTP version
  'https://vendor-frontend-omega.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // Allow exact matches
    const allowedDomains = [
      'https://winexch.blog',
      'http://winexch.blog',
      'https://vendor-frontend-omega.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    // Check if origin matches or is subdomain of winexch.blog
    if (allowedDomains.includes(origin) || origin.endsWith('.winexch.blog')) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser and cookie parser
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.json({ 
    message: "Vendor Backend API", 
    status: "Running",
    version: "1.0.0",
    allowedOrigins: allowedOrigins,
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
    cors: "enabled"
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => {
    console.error("❌ MongoDB Error:", err);
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
  console.log(`🔒 CORS enabled for: ${allowedOrigins.join(', ')}`);
});
