import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
<<<<<<< HEAD
=======

console.log("🔥 auth.js loaded");
>>>>>>> a92a8c52c363d84363602c48153d8d524195a9a0

const router = express.Router();

// =======================
// REGISTER USER
// =======================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

<<<<<<< HEAD
    res.status(201).json({
=======
    return res.status(201).json({
>>>>>>> a92a8c52c363d84363602c48153d8d524195a9a0
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (err) {
<<<<<<< HEAD
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
=======
    console.error("❌ Register Error:", err);
    return res.status(500).json({ error: "Registration failed" });
>>>>>>> a92a8c52c363d84363602c48153d8d524195a9a0
  }
});

// =======================
// LOGIN USER
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email & password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

<<<<<<< HEAD
    res.json({
=======
    return res.json({
>>>>>>> a92a8c52c363d84363602c48153d8d524195a9a0
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
<<<<<<< HEAD

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET vendors by user ID
router.get('/vendors/user/:userId', async (req, res) => {
=======
  } catch (err) {
    console.error("❌ Login Error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

// =======================
// GET Vendors by User ID
// =======================
router.get("/vendors/user/:userId", async (req, res) => {
>>>>>>> a92a8c52c363d84363602c48153d8d524195a9a0
  try {
    const vendors = await Vendor.find({ userId: req.params.userId }).sort({
      date: -1
    });
    return res.json(vendors);
  } catch (err) {
    console.error("❌ Vendor Fetch Error:", err);
    return res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

export default router;
