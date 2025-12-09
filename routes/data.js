import express from "express";
import Vendor from "../models/Vendor.js";
import Campaign from "../models/Campaign.js"; // Add this import if you have Campaign model

const router = express.Router();

// ==================== VENDOR ROUTES ====================

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

// Get campaigns by user ID
router.get('/campaigns/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('📊 Fetching campaigns for user:', userId);
    
    // Find all campaigns where the user is the creator/owner
    const campaigns = await Campaign.find({ 
      userId: userId  // or createdBy, ownerId - whatever field you use
    }).sort({ createdAt: -1 }); // Sort by newest first
    
    console.log(`✅ Found ${campaigns.length} campaigns`);
    
    res.json({
      success: true,
      count: campaigns.length,
      campaigns
    });
    
  } catch (error) {
    console.error('❌ Error fetching user campaigns:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaigns',
      message: error.message
    });
  }
});

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
