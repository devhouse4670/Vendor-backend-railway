import express from "express";
import Vendor from "../models/Vendor.js";

const router = express.Router();

// GET all vendors
// GET vendor by vendorId
router.get("/:vendorId", async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ vendorId: req.params.vendorId });

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.json({ success: true, vendor });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch vendor" });
  }
});



// GET vendor by ID (final correct version)
router.get("/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ vendorId: req.params.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    // Return vendor SAME WAY your frontend expects
    return res.json({
      success: true,
      vendor: vendor,
      message: "Vendor fetched successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch vendor",
      details: err.message
    });
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


router.get("/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ vendorId: req.params.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json({
      success: true,
      vendor, // wrap it inside "vendor"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch vendor",
      error: err.message,
    });
  }
});


export default router;
