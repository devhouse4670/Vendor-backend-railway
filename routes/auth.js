import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Auto secure in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    });

    res.json({ 
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      error: "Registration failed",
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    // REMOVED: Manual CORS headers - let middleware handle it
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    // Set cookie with proper settings
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    });

    // Send response with user data
    res.json({ 
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      error: "Login failed",
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// LOGOUT (optional but useful)
router.post("/logout", (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: "Logged out successfully" });
});

// VERIFY TOKEN (optional but useful)
router.get("/verify", async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ 
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
