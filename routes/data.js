import express from "express";
import Vendor from "../models/Vendor.js";
import Campaign from "../models/Campaign.js"; // Add this import if you have Campaign model

const router = express.Router();

// ==================== VENDOR ROUTES ====================

// GET all vendors
router.get("/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ date: -1 });
    res.json(vendors);
  } catch (err) {
    console.error('Error fetching vendors:', err);
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

// GET vendors by user ID (MUST be before /vendors/:id to avoid conflict)
router.get("/vendors/user/:userId", async (req, res) => {
  try {
    const vendors = await Vendor.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching user vendors:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET single vendor by ID
router.get("/vendors/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST create new vendor
router.post("/vendors", async (req, res) => {
  try {
    console.log("Creating vendor:", req.body);
    
    const vendor = new Vendor({
      userId: req.body.userId,
      vendorId: req.body.vendorId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      aadhaar: req.body.aadhaar,
      pan: req.body.pan,
      category: req.body.category,
      vendorType: req.body.vendorType,
      status: req.body.status,
      date: req.body.date || new Date(),
      uploadDoc: req.body.uploadDoc || "",
      utr: req.body.utr || "",
      msg: req.body.msg || "",
      extra: req.body.extra || "",
      insertUrls: req.body.insertUrls || [{ url: "" }]
    });

    const savedVendor = await vendor.save();
    console.log("Vendor saved:", savedVendor);
    res.status(201).json(savedVendor);
  } catch (err) {
    console.error("Error creating vendor:", err);
    res.status(400).json({ error: err.message });
  }
});

// PUT update vendor
router.put("/vendors/:id", async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    
    res.json(updatedVendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE vendor
router.delete("/vendors/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    await vendor.deleteOne();
    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ error: "Failed to delete vendor" });
  }
});

// ==================== CAMPAIGN ROUTES ====================

// GET campaigns by vendor ID
router.get("/campaigns/vendor/:vendorId", async (req, res) => {
  try {
    const campaigns = await Campaign.find({ vendorId: req.params.vendorId });
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add more campaign routes here if needed...

export default router;
