import express from "express";
import Vendor from "../models/Vendor.js";
<<<<<<< HEAD
import Campaign from '../models/Campaign.js';

const router = express.Router();

/* ==================== VENDOR ROUTES ==================== */
=======
import Campaign from "../models/Campaign.js"; // Add this import if you have Campaign model

const router = express.Router();

// ==================== VENDOR ROUTES ====================
>>>>>>> a92a8c52c363d84363602c48153d8d524195a9a0

// GET all vendors
router.get("/vendors/:id", async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ date: -1 });
    res.json(vendors);
  } catch (err) {
    console.error('Error fetching vendors:', err);
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

<<<<<<< HEAD
// GET vendors by user ID (MUST BE BEFORE /:id route)
=======
// GET vendors by user ID (MUST be before /vendors/:id to avoid conflict)
>>>>>>> a92a8c52c363d84363602c48153d8d524195a9a0
router.get("/vendors/user/:userId", async (req, res) => {
  try {
    const vendors = await Vendor.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(vendors);
  } catch (error) {
<<<<<<< HEAD
    console.error('Error fetching vendors:', error);
=======
    console.error('Error fetching user vendors:', error);
>>>>>>> a92a8c52c363d84363602c48153d8d524195a9a0
    res.status(500).json({ message: error.message });
  }
});

<<<<<<< HEAD
// GET vendor by vendorId string (like VEND-1218) - MUST BE BEFORE /:id
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
    
=======
// GET single vendor by ID
router.get("/vendors/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
>>>>>>> a92a8c52c363d84363602c48153d8d524195a9a0
    res.json(vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST create new vendor
router.post("/vendors", async (req, res) => {
<<<<<<< HEAD
  console.log("Received vendor data:", req.body);
  
=======
>>>>>>> a92a8c52c363d84363602c48153d8d524195a9a0
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

<<<<<<< HEAD
    const newVendor = await vendor.save();
    console.log("Saved vendor:", newVendor);
    
    res.status(201).json(newVendor);
  } catch (error) {
    console.error("Error saving vendor:", error);
    res.status(400).json({ message: error.message });
=======
    const savedVendor = await vendor.save();
    console.log("Vendor saved:", savedVendor);
    res.status(201).json(savedVendor);
  } catch (err) {
    console.error("Error creating vendor:", err);
    res.status(400).json({ error: err.message });
>>>>>>> a92a8c52c363d84363602c48153d8d524195a9a0
  }
});

// Update campaign (fixed version—keeps UTR intact)
router.put('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log('✏️ Updating campaign:', id);
    console.log('Incoming updates:', JSON.stringify(updates, null, 2));

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    // Update all normal fields
    Object.keys(updates).forEach((key) => {
      if (key !== "payments") { 
        campaign[key] = updates[key];
      }
    });

    // Special handling for payments array
    if (updates.payments) {
      console.log("💰 Incoming payments update:", updates.payments);

      campaign.payments = updates.payments.map(p => ({
        date: p.date,
        amount: p.amount,
        utr: p.utr || ""   // ensure utr is saved
      }));
    }

    await campaign.save();

    console.log("✅ Campaign updated successfully");
    console.log("Updated payments saved:", JSON.stringify(campaign.payments, null, 2));

    res.json({
      success: true,
      message: "Campaign updated successfully",
      campaign,
    });
  } catch (error) {
    console.error("❌ Error updating campaign:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update campaign",
      message: error.message,
    });
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
=======
// Get campaigns by vendor ID
router.get('/campaigns/vendor/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    console.log('📊 Fetching campaigns for vendor:', vendorId);
    
    const campaigns = await Campaign.find({ 
      vendorId: vendorId 
    }).sort({ createdAt: -1 });
    
    console.log(`✅ Found ${campaigns.length} campaigns`);
    
    res.json({
      success: true,
      count: campaigns.length,
      campaigns
    });
    
  } catch (error) {
    console.error('❌ Error fetching vendor campaigns:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaigns',
      message: error.message
    });
  }
});

// Get single campaign by ID
router.get('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📊 Fetching campaign:', id);
    
    const campaign = await Campaign.findById(id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }
    
    res.json({
      success: true,
      campaign
    });
    
  } catch (error) {
    console.error('❌ Error fetching campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaign',
      message: error.message
    });
  }
});

// Get all campaigns
router.get('/campaigns', async (req, res) => {
  try {
    console.log('📊 Fetching all campaigns');
    
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: campaigns.length,
      campaigns
    });
    
  } catch (error) {
    console.error('❌ Error fetching campaigns:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaigns',
      message: error.message
    });
  }
});

// Create new campaign
router.post('/campaigns', async (req, res) => {
  try {
    const campaignData = req.body;
    
    console.log('📝 Creating new campaign:', campaignData);
    
    const campaign = new Campaign(campaignData);
    await campaign.save();
    
    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      campaign
    });
    
  } catch (error) {
    console.error('❌ Error creating campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create campaign',
      message: error.message
    });
  }
});

// Update campaign
router.put('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log('✏️ Updating campaign:', id);
    
    const campaign = await Campaign.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Campaign updated successfully',
      campaign
    });
    
  } catch (error) {
    console.error('❌ Error updating campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update campaign',
      message: error.message
    });
  }
});

// Delete campaign
router.delete('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting campaign:', id);
    
    const campaign = await Campaign.findByIdAndDelete(id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Error deleting campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete campaign',
      message: error.message
    });
  }
});

export default router;
>>>>>>> a92a8c52c363d84363602c48153d8d524195a9a0
