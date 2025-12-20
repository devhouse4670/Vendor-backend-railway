import express from "express";
import Vendor from "../models/Vendor.js";
import Campaign from '../models/Campaign.js';

const router = express.Router();

/* ==================== VENDOR ROUTES ==================== */

// GET all vendors
router.get("/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

// GET vendors by user ID (MUST BE BEFORE /:id route)
router.get("/vendors/user/:userId", async (req, res) => {
  try {
    const vendors = await Vendor.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ message: error.message });
  }
});

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
    
    res.json(vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ message: error.message });
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

// Get campaigns by user ID - MUST come before /:id route
router.get('/campaigns/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('📊 Fetching campaigns for user:', userId);
    
    const campaigns = await Campaign.find({ 
      userId: userId
    }).sort({ createdAt: -1 });
    
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

// Get campaigns by vendor ID - MUST come before /:id route
router.get('/campaigns/vendor/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    console.log('📊 Fetching campaigns for vendor:', vendorId);
    console.log('📍 Full URL:', req.originalUrl);
    console.log('📍 Params:', req.params);
    
    const campaigns = await Campaign.find({ 
      vendorId: vendorId 
    }).sort({ createdAt: -1 });
    
    console.log(`✅ Found ${campaigns.length} campaigns for vendor ${vendorId}`);
    
    res.json({ 
      success: true, 
      count: campaigns.length,
      campaigns 
    });
    
  } catch (error) {
    console.error('❌ Error fetching vendor campaigns:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vendor campaigns',
      message: error.message
    });
  }
});

// Get single campaign by ID - MUST come after specific routes
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

// Create new campaign
router.post('/campaigns', async (req, res) => {
  try {
    const campaignData = req.body;
    
    console.log('📝 Creating new campaign');
    console.log('Campaign data received:', JSON.stringify(campaignData, null, 2));
    
    // Log payments specifically to debug
    if (campaignData.payments) {
      console.log('💰 Payments data:', JSON.stringify(campaignData.payments, null, 2));
      console.log('Number of payments:', campaignData.payments.length);
    }
    
    // Create the campaign
    const campaign = new Campaign(campaignData);
    
    // Log before saving
    console.log('Campaign object before save:', JSON.stringify(campaign.toObject(), null, 2));
    
    await campaign.save();
    
    // Log after saving
    console.log('✅ Campaign saved successfully');
    console.log('Saved campaign payments:', JSON.stringify(campaign.payments, null, 2));
    
    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      campaign
    });
    
  } catch (error) {
    console.error('❌ Error creating campaign:', error);
    console.error('Error details:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
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
    console.log('Update data:', JSON.stringify(updates, null, 2));
    
    // Log payments if being updated
    if (updates.payments) {
      console.log('💰 Updating payments:', JSON.stringify(updates.payments, null, 2));
    }
    
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
    
    console.log('✅ Campaign updated successfully');
    console.log('Updated campaign payments:', JSON.stringify(campaign.payments, null, 2));
    
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
    
    console.log('✅ Campaign deleted successfully');
    
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


// Create new campaign
router.post('/campaigns', async (req, res) => {
  try {
    const campaignData = req.body;
    
    console.log('📝 Creating new campaign');
    console.log('Campaign data received:', JSON.stringify(campaignData, null, 2));
    
    // Log payments specifically to debug
    if (campaignData.payments) {
      console.log('💰 Payments data:', JSON.stringify(campaignData.payments, null, 2));
      console.log('Number of payments:', campaignData.payments.length);
    }
    
    // Create the campaign
    const campaign = new Campaign(campaignData);
    
    // Log before saving
    console.log('Campaign object before save:', JSON.stringify(campaign.toObject(), null, 2));
    
    await campaign.save();
    
    // Log after saving
    console.log('✅ Campaign saved successfully');
    console.log('Saved campaign payments:', JSON.stringify(campaign.payments, null, 2));
    
    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      campaign
    });
    
  } catch (error) {
    console.error('❌ Error creating campaign:', error);
    console.error('Error details:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create campaign',
      message: error.message
    });
  }
});



router.get("/campaigns/vendor/:vendorId/count", async (req, res) => {
  try {
    const { vendorId } = req.params;

    const totalCampaigns = await Campaign.countDocuments({
      vendorId: vendorId
    });

    res.json({ totalCampaigns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/campaigns/vendor/:vendorId/live-count", async (req, res) => {
  try {
    const { vendorId } = req.params;

    const liveCampaigns = await Campaign.countDocuments({
      vendorId: vendorId,
      status: "Live" // or "Active"
    });

    res.json({ liveCampaigns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/campaigns/vendor/:vendorId/stats", async (req, res) => {
  try {
    const { vendorId } = req.params;

    const totalCampaigns = await Campaign.countDocuments({ vendorId });
    const liveCampaigns = await Campaign.countDocuments({
      vendorId,
      status: "Live"
    });

    res.json({
      totalCampaigns,
      liveCampaigns
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.get("/campaigns/vendor/:vendorId/stats", async (req, res) => {
  try {
    const { vendorId } = req.params;

    const totalCampaigns = await Campaign.countDocuments({
      vendorCode: vendorId // 🔴 change this to your actual field
    });

    const liveCampaigns = await Campaign.countDocuments({
      vendorCode: vendorId,
      status: { $in: ["Live", "Active", "Running"] }
    });

    res.json({ totalCampaigns, liveCampaigns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json({ success: true, campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



// Update campaign
router.put('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log('✏️ Updating campaign:', id);
    console.log('Update data:', JSON.stringify(updates, null, 2));
    
    // Log payments if being updated
    if (updates.payments) {
      console.log('💰 Updating payments:', JSON.stringify(updates.payments, null, 2));
    }
    
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
    
    console.log('✅ Campaign updated successfully');
    console.log('Updated campaign payments:', JSON.stringify(campaign.payments, null, 2));
    
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
    
    console.log('✅ Campaign deleted successfully');
    
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