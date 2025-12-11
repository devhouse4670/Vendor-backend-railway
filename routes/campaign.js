import express from 'express';
import Campaign from '../models/Campaign.js'; // Adjust path to your Campaign model
const router = express.Router();

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
  const { vendorId } = req.params;
  const campaigns = await Campaign.find({ vendorId });
  res.json({ success: true, campaigns });
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