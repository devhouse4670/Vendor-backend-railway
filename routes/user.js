import express from "express";
import User from "../models/User.js";
const router = express.Router();

// router.get("/users", async (req, res) => {
//   try {
//     const users = await User.find().select("-password"); // hide password
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


export default router;
