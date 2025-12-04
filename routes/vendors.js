import express from "express";
import Vendor from "../models/Vendor.js";

const router = express.Router();

// GET all vendors
router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

// GET vendor by ID
router.get("/:id", async (req, res) => {
  try {
const vendor = await Vendor.findOne({ vendorId: req.params.id });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vendor" });
  }
});

// POST new vendor
router.post("/", async (req, res) => {
  try {
    const newVendor = new Vendor(req.body);
    const savedVendor = await newVendor.save();
    res.status(201).json(savedVendor);
  } catch (err) {
    res.status(500).json({ error: "Failed to add vendor" });
  }
});

// UPDATE vendor
router.put("/:id", async (req, res) => {
  try {
    await Vendor.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Vendor updated successfully ppp" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update vendor" });
  }
});


// GET vendors by user ID
router.get('/vendors/user/:userId', async (req, res) => {
  try {
    const vendors = await Vendor.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
