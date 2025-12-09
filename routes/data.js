import express from "express";
import Vendor from "../models/Vendor.js";
import Campaign from '../models/Campaign.js';

const router = express.Router();

/* ==================== VENDOR ROUTES ==================== */

// 1. GET vendors by user ID (MUST be first among the GETs with parameters)
router.get("/vendors/user/:userId", async (req, res) => {
  try {
    const vendors = await Vendor.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors by user:', error);
    res.status(500).json({ message: error.message });
  }
});

// 2. GET vendor by vendorId or MongoDB ID (Generic parameter :vendorId or :id)
router.get("/vendors/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    // Try to find by vendorId field first (for strings like VEND-1218)
    let vendor = await Vendor.findOne({ vendorId: vendorId });
    
    // If not found and it looks like a MongoDB ObjectId, try findById
    if (!vendor && vendorId.match(/^[0-9a-fA-F]{24}$/)) {
      vendor = await Vendor.findById(vendorId);
    }
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json(vendor);
  } catch (error) {
    console.error('Error fetching specific vendor:', error);
    res.status(500).json({ message: error.message });
  }
});

// 3. GET all vendors (No parameters, placed last in GETs)
router.get("/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    console.error('Error fetching all vendors:', err);
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

// POST create new vendor
router.post("/vendors", async (req, res) => {
  console.log("Received vendor data:", req.body);
  
  try {
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

    const newVendor = await vendor.save();
    console.log("Saved vendor:", newVendor);
    
    res.status(201).json(newVendor);
  } catch (error) {
    console.error("Error saving vendor:", error);
    res.status(400).json({ message: error.message });
  }
});

// PUT update vendor (uses ID, typically the MongoDB _id)
router.put("/vendors/:id", async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json(updatedVendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE vendor
router.delete("/vendors/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    await vendor.deleteOne();
    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ==================== CAMPAIGN ROUTES ==================== */

// 1. GET campaigns by vendor ID (Most specific campaign GET)
router.get("/campaigns/vendor/:vendorId", async (req, res) => {
  try {
    const campaigns = await Campaign.find({ vendorId: req.params.vendorId });
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns by vendor:', error);
    res.status(500).json({ message: error.message });
  }
});

// 2. GET campaign by ID (Generic ID, MUST be last in campaign GETs)
router.get("/campaigns/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new campaign
router.post("/campaigns", async (req, res) => {
  console.log("Received campaign data:", req.body);
  
  try {
    const campaign = new Campaign(req.body);
    const savedCampaign = await campaign.save();
    console.log("Saved campaign:", savedCampaign);
    
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error saving campaign:", error);
    res.status(400).json({ message: error.message });
  }
});

// PUT update campaign
router.put("/campaigns/:id", async (req, res) => {
  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCampaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.json(updatedCampaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE campaign
router.delete("/campaigns/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    await campaign.deleteOne();
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
